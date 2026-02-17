import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTheaterGroupDto } from './dto/create-theater-group.dto';
import { UpdateTheaterGroupDto } from './dto/update-theater-group.dto';
import { db } from 'src/db';
import { eq } from 'drizzle-orm';
import { theaterGroups as theaterGroupsTable } from 'src/db/theater-groups-schema';
import { AudittrailService } from '../audittrail/audittrail.service';
import { sql } from 'drizzle-orm';

@Injectable()
export class TheaterGroupsService {
  constructor(private readonly audittrailService: AudittrailService) {}

  async create(createTheaterGroupDto: CreateTheaterGroupDto, userId: string) {
    try {
      const [newRecord] = await db
        .insert(theaterGroupsTable)
        .values({ ...createTheaterGroupDto })
        .returning();

      await this.audittrailService.log({
        userId,
        controller: 'theater-groups',
        action: 'create',
        details: `Created theater group: ${newRecord.name}`,
        isError: false,
      });

      return newRecord;
    } catch (error) {
      await this.audittrailService.log({
        userId,
        controller: 'theater-groups',
        action: 'create',
        details: `Failed to create theater group`,
        isError: true,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findAll(query?: string, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const whereClause = query
      ? sql`(${theaterGroupsTable.name} ILIKE ${`%${query}%`} OR ${theaterGroupsTable.shortCode} ILIKE ${`%${query}%`})`
      : undefined;

    const [total] = await db
      .select({
        count: sql<number>`cast(count(${theaterGroupsTable.id}) as int)`,
      })
      .from(theaterGroupsTable)
      .where(whereClause);

    const data = await db.query.theaterGroups.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: (theaterGroups, { desc }) => [desc(theaterGroups.createdAt)],
    });

    return { data, total: total.count };
  }

  async findOne(id: number) {
    const record = await db.query.theaterGroups.findFirst({
      where: eq(theaterGroupsTable.id, id),
      with: {
        theaters: true,
      },
    });
    if (!record) {
      throw new NotFoundException(`Theater group with id ${id} not found`);
    }
    return record;
  }

  async update(
    id: number,
    updateTheaterGroupDto: UpdateTheaterGroupDto,
    userId: string,
  ) {
    try {
      const [updated] = await db
        .update(theaterGroupsTable)
        .set({ ...updateTheaterGroupDto })
        .where(eq(theaterGroupsTable.id, id))
        .returning();

      if (!updated) {
        throw new NotFoundException(`Theater group with id ${id} not found`);
      }

      await this.audittrailService.log({
        userId,
        controller: 'theater-groups',
        action: 'update',
        details: `Updated theater group id ${id}`,
        isError: false,
      });

      return updated;
    } catch (error) {
      await this.audittrailService.log({
        userId,
        controller: 'theater-groups',
        action: 'update',
        details: `Failed to update theater group id ${id}`,
        isError: true,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number, userId: string) {
    try {
      // Soft delete by setting is_active to false
      const [deleted] = await db
        .update(theaterGroupsTable)
        .set({ isActive: false })
        .where(eq(theaterGroupsTable.id, id))
        .returning();

      if (!deleted) {
        throw new NotFoundException(`Theater group with id ${id} not found`);
      }

      await this.audittrailService.log({
        userId,
        controller: 'theater-groups',
        action: 'delete',
        details: `Soft deleted theater group id ${id}`,
        isError: false,
      });

      return deleted;
    } catch (error) {
      await this.audittrailService.log({
        userId,
        controller: 'theater-groups',
        action: 'delete',
        details: `Failed to delete theater group id ${id}`,
        isError: true,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });
      throw new InternalServerErrorException(error);
    }
  }
}
