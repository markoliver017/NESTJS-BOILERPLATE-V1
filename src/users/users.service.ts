import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { db } from 'src/db';
import { eq, ilike, or, sql } from 'drizzle-orm';
import { user as userTable } from 'src/db/auth-schema';
import { AudittrailService } from '../audittrail/audittrail.service';
import { UserSession } from '@thallesp/nestjs-better-auth';

@Injectable()
export class UsersService {
  constructor(private readonly audittrailService: AudittrailService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const [newUser] = await db
        .insert(userTable)
        .values({
          id: randomUUID(),
          ...createUserDto,
        })
        .returning();

      // Audit log: user created
      await this.audittrailService.log({
        userId: newUser.id,
        controller: 'users',
        action: 'create',
        details: `User created with email ${newUser.email}`,
        isError: false,
      });

      return newUser;
    } catch (error) {
      console.log('Create User Error: ', error);

      // Audit log: create error
      await this.audittrailService.log({
        userId: createUserDto.email, // fallback identifier if no ID yet
        controller: 'users',
        action: 'create',
        details: `Failed to create user with email ${createUserDto.email}`,
        isError: true,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });

      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findAll(q?: string, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    // Build where clause for search
    const whereClause = q
      ? or(ilike(userTable.name, `%${q}%`), ilike(userTable.email, `%${q}%`))
      : undefined;

    // Fetch paginated data
    const data = await db
      .select()
      .from(userTable)
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    // Count total records
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(userTable)
      .where(whereClause);

    return {
      data,
      total: Number(count),
    };
  }

  async findOneByEmail(email: string) {
    const user = await db.query.user.findFirst({
      where: eq(userTable.email, email),
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async findOne(id: string) {
    return await db.query.user.findFirst({ where: eq(userTable.id, id) });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const [newUser] = await db
        .update(userTable)
        .set({
          ...updateUserDto,
        })
        .where(eq(userTable.id, id))
        .returning();

      // Audit log: user updated
      await this.audittrailService.log({
        userId: newUser.id,
        controller: 'users',
        action: 'update',
        details: `User updated with email ${newUser.email}`,
        isError: false,
      });

      return newUser;
    } catch (error) {
      // Audit log: update error
      await this.audittrailService.log({
        userId: id,
        controller: 'users',
        action: 'update',
        details: `Failed to update user with id ${id}`,
        isError: true,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });

      // Handle DB errors or duplicate email, etc.
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string, UserSession: UserSession) {
    const { session } = UserSession;
    try {
      const [deletedUser] = await db
        .delete(userTable)
        .where(eq(userTable.id, id))
        .returning();

      // Audit log: user deleted
      await this.audittrailService.log({
        userId: session.userId,
        controller: 'users',
        action: 'delete',
        details: `User deleted with email ${deletedUser.email}`,
        isError: false,
      });

      return deletedUser;
    } catch (error) {
      // Audit log: delete error
      await this.audittrailService.log({
        userId: session.userId,
        controller: 'users',
        action: 'delete',
        details: `Failed to delete user with id ${id}`,
        isError: true,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });

      throw new InternalServerErrorException(error);
    }
  }
}
