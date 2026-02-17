import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
import { db } from 'src/db';
import { eq, sql, SQL } from 'drizzle-orm';
import { cinemas as cinemasTable } from 'src/db/cinemas-schema';
import { AudittrailService } from '../audittrail/audittrail.service';

@Injectable()
export class CinemasService {
  constructor(private readonly audittrailService: AudittrailService) {}

  async create(createCinemaDto: CreateCinemaDto, userId: string) {
    try {
      const [newCinema] = await db
        .insert(cinemasTable)
        .values({ ...createCinemaDto })
        .returning();

      await this.audittrailService.log({
        userId,
        controller: 'cinemas',
        action: 'create',
        details: `Created cinema: ${newCinema.name}`,
        isError: false,
      });

      return newCinema;
    } catch (error) {
      await this.audittrailService.log({
        userId,
        controller: 'cinemas',
        action: 'create',
        details: `Failed to create cinema`,
        isError: true,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findAll(q?: string, page = 1, limit = 10, theaterId?: number) {
    const offset = (page - 1) * limit;

    // Build where clause using sql template literals
    let whereClause: SQL | undefined;
    if (q && theaterId) {
      whereClause = sql`${cinemasTable.name} ILIKE ${`%${q}%`} AND ${cinemasTable.theaterId} = ${theaterId}`;
    } else if (q) {
      whereClause = sql`${cinemasTable.name} ILIKE ${`%${q}%`}`;
    } else if (theaterId) {
      whereClause = sql`${cinemasTable.theaterId} = ${theaterId}`;
    } else {
      whereClause = undefined;
    }

    // Count total records
    const [total] = await db
      .select({ count: sql<number>`cast(count(${cinemasTable.id}) as int)` })
      .from(cinemasTable)
      .where(whereClause);

    // Fetch paginated data with relations
    const data = await db.query.cinemas.findMany({
      where: whereClause, // Cast to any to avoid complex SQL type issues, validated by logic above
      limit,
      offset,
      with: {
        theater: {
          with: {
            theaterGroup: true,
          },
        },
      },
      orderBy: (cinemas, { desc }) => [desc(cinemas.createdAt)],
    });

    return {
      data,
      total: total.count,
    };
  }

  async findOne(id: number) {
    const cinema = await db.query.cinemas.findFirst({
      where: eq(cinemasTable.id, id),
      with: {
        theater: {
          with: {
            theaterGroup: true,
          },
        },
      },
    });

    if (!cinema) {
      throw new NotFoundException(`Cinema with id ${id} not found`);
    }

    return cinema;
  }

  async update(id: number, updateCinemaDto: UpdateCinemaDto, userId: string) {
    try {
      const [updated] = await db
        .update(cinemasTable)
        .set({ ...updateCinemaDto })
        .where(eq(cinemasTable.id, id))
        .returning();

      await this.audittrailService.log({
        userId,
        controller: 'cinemas',
        action: 'update',
        details: `Updated cinema id ${id}`,
        isError: false,
      });

      return updated;
    } catch (error) {
      await this.audittrailService.log({
        userId,
        controller: 'cinemas',
        action: 'update',
        details: `Failed to update cinema id ${id}`,
        isError: true,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number, userId: string) {
    try {
      const [deleted] = await db
        .delete(cinemasTable)
        .where(eq(cinemasTable.id, id))
        .returning();

      await this.audittrailService.log({
        userId,
        controller: 'cinemas',
        action: 'delete',
        details: `Deleted cinema id ${id}`,
        isError: false,
      });

      return deleted;
    } catch (error) {
      await this.audittrailService.log({
        userId,
        controller: 'cinemas',
        action: 'delete',
        details: `Failed to delete cinema id ${id}`,
        isError: true,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });
      throw new InternalServerErrorException(error);
    }
  }
}
