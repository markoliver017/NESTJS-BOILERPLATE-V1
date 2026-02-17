import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';
import { db } from 'src/db';
import { eq, sql } from 'drizzle-orm';
import { agencies } from 'src/db/agencies-schema';
import { AudittrailService } from '../audittrail/audittrail.service';

@Injectable()
export class AgenciesService {
  constructor(private readonly audittrailService: AudittrailService) {}

  async create(createAgencyDto: CreateAgencyDto, userId: string) {
    try {
      const [newAgency] = await db
        .insert(agencies)
        .values({ ...createAgencyDto })
        .returning();

      await this.audittrailService.log({
        userId,
        controller: 'agencies',
        action: 'create',
        details: `Created agency: ${newAgency.name}`,
        isError: false,
      });

      return newAgency;
    } catch (error) {
      await this.audittrailService.log({
        userId,
        controller: 'agencies',
        action: 'create',
        details: `Failed to create agency`,
        isError: true,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findAll(query?: string, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const whereClause = query
      ? sql`(${agencies.name} ILIKE ${`%${query}%`} OR ${agencies.contactPerson} ILIKE ${`%${query}%`} OR ${agencies.email} ILIKE ${`%${query}%`})`
      : undefined;

    const [total] = await db
      .select({ count: sql<number>`cast(count(${agencies.id}) as int)` })
      .from(agencies)
      .where(whereClause);

    const data = await db.query.agencies.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: (agencies, { desc }) => [desc(agencies.createdAt)],
    });

    return { data, total: total.count };
  }

  async findOne(id: number) {
    const agency = await db.query.agencies.findFirst({
      where: eq(agencies.id, id),
      with: {
        checkers: true,
      },
    });

    if (!agency) {
      throw new NotFoundException(`Agency with id ${id} not found`);
    }

    return agency;
  }

  async update(id: number, updateAgencyDto: UpdateAgencyDto, userId: string) {
    try {
      const [updated] = await db
        .update(agencies)
        .set({ ...updateAgencyDto })
        .where(eq(agencies.id, id))
        .returning();

      if (!updated) {
        throw new NotFoundException(`Agency with id ${id} not found`);
      }

      await this.audittrailService.log({
        userId,
        controller: 'agencies',
        action: 'update',
        details: `Updated agency id ${id}`,
        isError: false,
      });

      return updated;
    } catch (error) {
      await this.audittrailService.log({
        userId,
        controller: 'agencies',
        action: 'update',
        details: `Failed to update agency id ${id}`,
        isError: true,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number, userId: string) {
    try {
      const [deleted] = await db
        .delete(agencies)
        .where(eq(agencies.id, id))
        .returning();

      if (!deleted) {
        throw new NotFoundException(`Agency with id ${id} not found`);
      }

      await this.audittrailService.log({
        userId,
        controller: 'agencies',
        action: 'delete',
        details: `Deleted agency id ${id}`,
        isError: false,
      });

      return deleted;
    } catch (error) {
      await this.audittrailService.log({
        userId,
        controller: 'agencies',
        action: 'delete',
        details: `Failed to delete agency id ${id}`,
        isError: true,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });
      throw new InternalServerErrorException(error);
    }
  }
}
