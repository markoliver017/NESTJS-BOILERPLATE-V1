---
description: Guide for scaffolding a new NestJS CRUD module with Drizzle ORM, DTOs, audit logging, and auth guards
---

This workflow defines the standard for adding a new backend module.

# File Structure

```
src/[feature]/
├── dto/
│   ├── create-[feature].dto.ts    # Create DTO with class-validator
│   └── update-[feature].dto.ts    # Update DTO (extends create, all optional)
├── entities/
│   └── [feature].entity.ts        # Entity type (optional)
├── [feature].controller.ts        # REST controller
├── [feature].service.ts           # Business logic with Drizzle
├── [feature].module.ts            # Module definition
├── [feature].controller.spec.ts   # Controller test
└── [feature].service.spec.ts      # Service test
```

---

# 1. Define the Database Schema

**File**: `src/db/schema.ts`

Add a new table using the established pattern:

```typescript
// ==========================================
//  [FEATURE_NAME]
// ==========================================

export const [feature] = pgTable('[feature]', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

    // Foreign key to user (if needed)
    userId: varchar('user_id', { length: 36 })
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),

    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    status: varchar('status', { length: 50 }).default('active'),

    // Timestamps — always include both
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .$onUpdate(() => new Date()),
});

// Relations (if needed)
export const [feature]Relations = relations([feature], ({ one }) => ({
    user: one(user, {
        fields: [[feature].userId],
        references: [user.id],
    }),
}));
```

**Then export in `src/db/index.ts`**:

```typescript
import * as appSchema from './schema'; // Already imports all tables
```

> The existing `index.ts` uses `import * as appSchema from './schema'`, so new tables
> added to `schema.ts` are automatically included. No changes needed to `index.ts`
> unless you create a separate schema file.

---

# 2. Create DTOs

## Create DTO

**File**: `src/[feature]/dto/create-[feature].dto.ts`

```typescript
import { IsString, IsOptional, IsEmail, MaxLength, IsBoolean, IsNumber, IsUUID } from 'class-validator';

export class Create[Feature]Dto {
    @IsString()
    @MaxLength(255)
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    status?: string;
}
```

## Update DTO

**File**: `src/[feature]/dto/update-[feature].dto.ts`

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { Create[Feature]Dto } from './create-[feature].dto';

export class Update[Feature]Dto extends PartialType(Create[Feature]Dto) {}
```

**Rules**:

- Always use `class-validator` decorators — not Zod (Zod is frontend only)
- Always use `PartialType` for Update DTOs
- Use `@MaxLength` on varchar fields to match DB constraints

---

# 3. Create the Service

**File**: `src/[feature]/[feature].service.ts`

```typescript
import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { Create[Feature]Dto } from './dto/create-[feature].dto';
import { Update[Feature]Dto } from './dto/update-[feature].dto';
import { db } from 'src/db';
import { eq } from 'drizzle-orm';
import { [feature] as [feature]Table } from 'src/db/schema';
import { AudittrailService } from '../audittrail/audittrail.service';

@Injectable()
export class [Feature]Service {
    constructor(private readonly audittrailService: AudittrailService) {}

    async create(create[Feature]Dto: Create[Feature]Dto, userId: string) {
        try {
            const [newRecord] = await db
                .insert([feature]Table)
                .values({ ...create[Feature]Dto })
                .returning();

            await this.audittrailService.log({
                userId,
                controller: '[feature]',
                action: 'create',
                details: `Created [feature]: ${newRecord.name}`,
                isError: false,
            });

            return newRecord;
        } catch (error) {
            await this.audittrailService.log({
                userId,
                controller: '[feature]',
                action: 'create',
                details: `Failed to create [feature]`,
                isError: true,
                stackTrace: error instanceof Error ? error.stack : undefined,
            });
            throw new InternalServerErrorException('Something went wrong');
        }
    }

    async findAll() {
        return await db.query.[feature].findMany();
    }

    async findOne(id: number) {
        const record = await db.query.[feature].findFirst({
            where: eq([feature]Table.id, id),
        });
        if (!record) {
            throw new NotFoundException(`[Feature] with id ${id} not found`);
        }
        return record;
    }

    async update(id: number, update[Feature]Dto: Update[Feature]Dto, userId: string) {
        try {
            const [updated] = await db
                .update([feature]Table)
                .set({ ...update[Feature]Dto })
                .where(eq([feature]Table.id, id))
                .returning();

            await this.audittrailService.log({
                userId,
                controller: '[feature]',
                action: 'update',
                details: `Updated [feature] id ${id}`,
                isError: false,
            });

            return updated;
        } catch (error) {
            await this.audittrailService.log({
                userId,
                controller: '[feature]',
                action: 'update',
                details: `Failed to update [feature] id ${id}`,
                isError: true,
                stackTrace: error instanceof Error ? error.stack : undefined,
            });
            throw new InternalServerErrorException(error);
        }
    }

    async remove(id: number, userId: string) {
        try {
            const [deleted] = await db
                .delete([feature]Table)
                .where(eq([feature]Table.id, id))
                .returning();

            await this.audittrailService.log({
                userId,
                controller: '[feature]',
                action: 'delete',
                details: `Deleted [feature] id ${id}`,
                isError: false,
            });

            return deleted;
        } catch (error) {
            await this.audittrailService.log({
                userId,
                controller: '[feature]',
                action: 'delete',
                details: `Failed to delete [feature] id ${id}`,
                isError: true,
                stackTrace: error instanceof Error ? error.stack : undefined,
            });
            throw new InternalServerErrorException(error);
        }
    }
}
```

**Rules**:

- Every mutation (create/update/delete) MUST have `try/catch`
- Every `try` block MUST log success via `AudittrailService.log()`
- Every `catch` block MUST log error with `stackTrace`
- Use `db.query.[feature].findMany()` for reads (Drizzle relational queries)
- Use `db.insert/update/delete` for writes with `.returning()`

---

# 4. Create the Controller

**File**: `src/[feature]/[feature].controller.ts`

```typescript
import {
    Controller, Get, Post, Body, Patch, Param, Delete,
    UsePipes, ValidationPipe, ParseIntPipe,
} from '@nestjs/common';
import { [Feature]Service } from './[feature].service';
import { Create[Feature]Dto } from './dto/create-[feature].dto';
import { Update[Feature]Dto } from './dto/update-[feature].dto';
import * as nestjsBetterAuth from '@thallesp/nestjs-better-auth';

@Controller('[feature]')
export class [Feature]Controller {
    constructor(private readonly [feature]Service: [Feature]Service) {}

    @Post()
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
    create(
        @Body() create[Feature]Dto: Create[Feature]Dto,
        @nestjsBetterAuth.Session() userSession: nestjsBetterAuth.UserSession,
    ) {
        return this.[feature]Service.create(create[Feature]Dto, userSession.session.userId);
    }

    @Get()
    findAll() {
        return this.[feature]Service.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.[feature]Service.findOne(id);
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() update[Feature]Dto: Update[Feature]Dto,
        @nestjsBetterAuth.Session() userSession: nestjsBetterAuth.UserSession,
    ) {
        return this.[feature]Service.update(id, update[Feature]Dto, userSession.session.userId);
    }

    @Delete(':id')
    remove(
        @Param('id', ParseIntPipe) id: number,
        @nestjsBetterAuth.Session() userSession: nestjsBetterAuth.UserSession,
    ) {
        return this.[feature]Service.remove(id, userSession.session.userId);
    }
}
```

**Rules**:

- Always use `@UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))` on POST/PATCH
- Use `@nestjsBetterAuth.Session()` to get the authenticated user for audit logging
- Use `ParseIntPipe` for integer IDs

---

# 5. Create the Module

**File**: `src/[feature]/[feature].module.ts`

```typescript
import { Module } from '@nestjs/common';
import { [Feature]Service } from './[feature].service';
import { [Feature]Controller } from './[feature].controller';
import { AudittrailModule } from '../audittrail/audittrail.module';

@Module({
    imports: [AudittrailModule],  // ALWAYS import for audit logging
    controllers: [[Feature]Controller],
    providers: [[Feature]Service],
    exports: [[Feature]Service],  // Export if other modules need it
})
export class [Feature]Module {}
```

---

# 6. Register in App Module

**File**: `src/app.module.ts`

```typescript
import { [Feature]Module } from './[feature]/[feature].module';

@Module({
    imports: [
        // ... existing imports
        [Feature]Module,  // Add here
    ],
})
export class AppModule {}
```

---

# 7. Generate Migration

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

---

# Checklist

- [ ] Table defined in `src/db/schema.ts` with timestamps?
- [ ] Relations defined if foreign keys exist?
- [ ] Create DTO uses `class-validator` with `@MaxLength` matching DB?
- [ ] Update DTO uses `PartialType(CreateDto)`?
- [ ] Service injects `AudittrailService`?
- [ ] Every mutation has `try/catch` with audit logging on both success and error?
- [ ] Controller uses `@UsePipes(ValidationPipe)` on POST/PATCH?
- [ ] Controller uses `@nestjsBetterAuth.Session()` for user context?
- [ ] Module imports `AudittrailModule`?
- [ ] Module registered in `app.module.ts`?
- [ ] Migration generated and applied?
