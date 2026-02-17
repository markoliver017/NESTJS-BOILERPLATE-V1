import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCinemaFormatDto } from './dto/create-cinema-format.dto';
import { UpdateCinemaFormatDto } from './dto/update-cinema-format.dto';
import { db } from 'src/db';
import { eq, or, ilike, count } from 'drizzle-orm';
import { cinemaFormats as cinemaFormatsTable } from 'src/db/cinema-formats-schema';
import { AudittrailService } from '../audittrail/audittrail.service';

@Injectable()
export class CinemaFormatsService {
  constructor(private readonly audittrailService: AudittrailService) {}

  async create(createCinemaFormatDto: CreateCinemaFormatDto, userId: string) {
    try {
      const [newRecord] = await db
        .insert(cinemaFormatsTable)
        .values({ ...createCinemaFormatDto })
        .returning();

      await this.audittrailService.log({
        userId,
        controller: 'cinema-formats',
        action: 'create',
        details: `Created cinema format: ${newRecord.code}`,
        isError: false,
      });

      return newRecord;
    } catch (error) {
      await this.audittrailService.log({
        userId,
        controller: 'cinema-formats',
        action: 'create',
        details: `Failed to create cinema format`,
        isError: true,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findAll(q?: string, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const where = q
      ? or(
          ilike(cinemaFormatsTable.code, `%${q}%`),
          ilike(cinemaFormatsTable.label, `%${q}%`),
        )
      : undefined;

    const data = await db.query.cinemaFormats.findMany({
      where,
      limit,
      offset,
      orderBy: (cinemaFormats, { desc }) => [desc(cinemaFormats.createdAt)],
    });

    const [totalRecord] = await db
      .select({ count: count() })
      .from(cinemaFormatsTable)
      .where(where);

    return { data, total: totalRecord.count };
  }

  async findOne(id: number) {
    const record = await db.query.cinemaFormats.findFirst({
      where: eq(cinemaFormatsTable.id, id),
    });
    if (!record) {
      throw new NotFoundException(`Cinema format with id ${id} not found`);
    }
    return record;
  }

  async update(
    id: number,
    updateCinemaFormatDto: UpdateCinemaFormatDto,
    userId: string,
  ) {
    try {
      const [updated] = await db
        .update(cinemaFormatsTable)
        .set({ ...updateCinemaFormatDto })
        .where(eq(cinemaFormatsTable.id, id))
        .returning();

      await this.audittrailService.log({
        userId,
        controller: 'cinema-formats',
        action: 'update',
        details: `Updated cinema format id ${id}`,
        isError: false,
      });

      return updated;
    } catch (error) {
      await this.audittrailService.log({
        userId,
        controller: 'cinema-formats',
        action: 'update',
        details: `Failed to update cinema format id ${id}`,
        isError: true,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number, userId: string) {
    try {
      const [deleted] = await db
        .delete(cinemaFormatsTable)
        .where(eq(cinemaFormatsTable.id, id))
        .returning();

      await this.audittrailService.log({
        userId,
        controller: 'cinema-formats',
        action: 'delete',
        details: `Deleted cinema format id ${id}`,
        isError: false,
      });

      return deleted;
    } catch (error) {
      await this.audittrailService.log({
        userId,
        controller: 'cinema-formats',
        action: 'delete',
        details: `Failed to delete cinema format id ${id}`,
        isError: true,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });
      throw new InternalServerErrorException(error);
    }
  }
}
