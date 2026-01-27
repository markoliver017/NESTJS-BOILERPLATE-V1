# Audit Trail Setup Guide

This guide shows how to wire audit logging into any NestJS resource using the `AudittrailModule`. It follows the patterns used in the `UsersModule`.

---

## 1. Module Setup

Import `AudittrailModule` in your feature module so you can inject `AudittrailService`.

```ts
// src/your-feature/your-feature.module.ts
import { Module } from '@nestjs/common';
import { YourFeatureService } from './your-feature.service';
import { YourFeatureController } from './your-feature.controller';
import { AudittrailModule } from '../audittrail/audittrail.module';

@Module({
  imports: [AudittrailModule],
  controllers: [YourFeatureController],
  providers: [YourFeatureService],
})
export class YourFeatureModule {}
```

---

## 2. Service: Inject and Log

Inject `AudittrailService` and call `audittrailService.log()` for mutations and errors.

```ts
// src/your-feature/your-feature.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AudittrailService } from '../audittrail/audittrail.service';

@Injectable()
export class YourFeatureService {
  constructor(private readonly audittrailService: AudittrailService) {}

  async create(createDto: CreateDto) {
    try {
      const newItem = await this.db.insert(table).values(createDto).returning();

      // Audit: success
      await this.audittrailService.log({
        userId: newItem.userId, // or current user ID
        controller: 'your-feature',
        action: 'create',
        details: `Item created with ID ${newItem.id}`,
        isError: false,
      });

      return newItem;
    } catch (error) {
      // Audit: error
      await this.audittrailService.log({
        userId: createDto.userId, // fallback identifier
        controller: 'your-feature',
        action: 'create',
        details: `Failed to create item`,
        isError: true,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });

      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async update(id: string, updateDto: UpdateDto) {
    try {
      const updated = await this.db
        .update(table)
        .set(updateDto)
        .where(eq(table.id, id))
        .returning();

      // Audit: success
      await this.audittrailService.log({
        userId: updated[0].userId,
        controller: 'your-feature',
        action: 'update',
        details: `Item ${id} updated`,
        isError: false,
      });

      return updated[0];
    } catch (error) {
      // Audit: error
      await this.audittrailService.log({
        userId: id,
        controller: 'your-feature',
        action: 'update',
        details: `Failed to update item ${id}`,
        isError: true,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });

      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async remove(id: string) {
    try {
      const deleted = await this.db
        .delete(table)
        .where(eq(table.id, id))
        .returning();

      // Audit: success
      await this.audittrailService.log({
        userId: deleted[0].userId,
        controller: 'your-feature',
        action: 'delete',
        details: `Item ${id} deleted`,
        isError: false,
      });

      return deleted[0];
    } catch (error) {
      // Audit: error
      await this.audittrailService.log({
        userId: id,
        controller: 'your-feature',
        action: 'delete',
        details: `Failed to delete item ${id}`,
        isError: true,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
```

---

## 3. What to Log

- **Mutations**: `create`, `update`, `delete` (state changes)
- **Errors**: always include `isError: true` and optional `stackTrace`
- **Optional**: reads (`findAll`, `findOne`) if you need access tracking

### Log Fields

| Field        | Type          | Required | Notes                                          |
| ------------ | ------------- | -------- | ---------------------------------------------- |
| `userId`     | string (UUID) | Yes      | ID of the acting user                          |
| `controller` | string        | Yes      | NestJS controller name (kebab-case)            |
| `action`     | string        | Yes      | `create`/`update`/`delete`/etc.                |
| `details`    | string        | No       | Human‑readable description                     |
| `isError`    | boolean       | No       | `false` by default                             |
| `stackTrace` | string        | No       | Include when `isError: true`                   |
| `ipAddress`  | string        | No       | Auto‑filled by controller if you call via HTTP |
| `userAgent`  | string        | No       | Auto‑filled by controller if you call via HTTP |

---

## 4. Controller (Optional: Auto IP/UA)

If you want `ipAddress`/`userAgent` auto‑filled, call `AudittrailService.create()` from the controller instead of `log()`:

```ts
// src/your-feature/your-feature.controller.ts
import {
  Controller,
  Post,
  Body,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { Request } from 'express';
import { AudittrailService } from '../audittrail/audittrail.service';
import { CreateAudittrailDto } from '../audittrail/dto/create-audittrail.dto';

@Controller('your-feature')
export class YourFeatureController {
  constructor(
    private readonly yourFeatureService: YourFeatureService,
    private readonly audittrailService: AudittrailService,
  ) {}

  @Post()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async create(@Req() req: Request, @Body() createDto: CreateDto) {
    const result = await this.yourFeatureService.create(createDto);

    // Optional: log with request metadata
    await this.audittrailService.create({
      userId: result.userId,
      controller: 'your-feature',
      action: 'create',
      details: `Item created via HTTP`,
      isError: false,
      // ipAddress/userAgent auto‑filled by controller logic
    });

    return result;
  }
}
```

---

## 5. Querying Audit Logs

Use the `AudittrailController` endpoints or inject `AudittrailService` directly.

### GET `/audittrail`

- Filters: `userId`, `controller`, `action`, `isError`
- Pagination: `page`, `limit`
- Sort: `sortBy` (`createdAt`/`id`), `sortOrder` (`asc`/`desc`)

### GET `/audittrail/:id`

- Fetch a single audit entry by numeric ID.

---

## 6. Tips & Gotchas

- **Immutability**: `PATCH`/`DELETE` on audit entries are rejected by design.
- **Validation**: `CreateAudittrailDto` requires `userId` (matches DB `notNull`).
- **Error handling**: Always log errors before re‑throwing; include `stackTrace` for debugging.
- **Performance**: Audit logging is async; it won’t block the main operation unless you `await`.
- **Testing**: Mock `AudittrailService` in unit tests to avoid hitting the DB.

---

## 7. Reference Implementation

See `src/users/` for a complete example:

- `users.module.ts`: imports `AudittrailModule`
- `users.service.ts`: logs mutations and errors
- `users.controller.ts`: optional HTTP‑level logging

---

That’s it! Follow this pattern for any new resource to get consistent, immutable audit trails across your NestJS app.
