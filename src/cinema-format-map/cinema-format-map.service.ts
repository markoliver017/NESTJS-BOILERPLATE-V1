import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCinemaFormatMapDto } from './dto/create-cinema-format-map.dto';
import { UpdateCinemaFormatMapDto } from './dto/update-cinema-format-map.dto';
import { db } from 'src/db';
import { and, eq, ne } from 'drizzle-orm';
import { cinemaFormatMap as cinemaFormatMapTable } from 'src/db/cinema-format-map-schema';
import { AudittrailService } from '../audittrail/audittrail.service';

@Injectable()
export class CinemaFormatMapService {
  constructor(private readonly audittrailService: AudittrailService) {}

  async create(
    createCinemaFormatMapDto: CreateCinemaFormatMapDto,
    userId: string,
  ) {
    // Check if mapping already exists
    const existing = await db.query.cinemaFormatMap.findFirst({
      where: and(
        eq(cinemaFormatMapTable.cinemaId, createCinemaFormatMapDto.cinemaId),
        eq(
          cinemaFormatMapTable.cinemaFormatId,
          createCinemaFormatMapDto.cinemaFormatId,
        ),
      ),
    });

    if (existing) {
      throw new BadRequestException(
        'This format is already assigned to the cinema',
      );
    }

    // If isPrimary is true, ensure no other format is primary for this cinema
    if (createCinemaFormatMapDto.isPrimary) {
      await this.ensureSinglePrimary(
        createCinemaFormatMapDto.cinemaId,
        null, // No ID to exclude (create mode)
        userId,
      );
    }

    try {
      const [newRecord] = await db
        .insert(cinemaFormatMapTable)
        .values({ ...createCinemaFormatMapDto })
        .returning();

      await this.audittrailService.log({
        userId,
        controller: 'cinema-format-map',
        action: 'create',
        details: `Assigned format ${newRecord.cinemaFormatId} to cinema ${newRecord.cinemaId}`,
        isError: false,
      });

      return newRecord;
    } catch (error) {
      await this.audittrailService.log({
        userId,
        controller: 'cinema-format-map',
        action: 'create',
        details: `Failed to assign format to cinema`,
        isError: true,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findAll(cinemaId: number) {
    const data = await db.query.cinemaFormatMap.findMany({
      where: eq(cinemaFormatMapTable.cinemaId, cinemaId),
      with: {
        cinemaFormat: true,
        cinema: true,
      },
    });

    return { data, total: data.length };
  }

  async findOne(id: number) {
    const record = await db.query.cinemaFormatMap.findFirst({
      where: eq(cinemaFormatMapTable.id, id),
      with: {
        cinemaFormat: true,
        cinema: true,
      },
    });
    if (!record) {
      throw new NotFoundException(`Cinema Format Map with id ${id} not found`);
    }
    return record;
  }

  async update(
    id: number,
    updateCinemaFormatMapDto: UpdateCinemaFormatMapDto,
    userId: string,
  ) {
    const existing = await this.findOne(id);

    // If setting to primary, ensure others are not primary
    if (updateCinemaFormatMapDto.isPrimary === true && !existing.isPrimary) {
      await this.ensureSinglePrimary(existing.cinemaId, id, userId);
    }

    try {
      const [updated] = await db
        .update(cinemaFormatMapTable)
        .set({ ...updateCinemaFormatMapDto })
        .where(eq(cinemaFormatMapTable.id, id))
        .returning();

      await this.audittrailService.log({
        userId,
        controller: 'cinema-format-map',
        action: 'update',
        details: `Updated assignment id ${id}`,
        isError: false,
      });

      return updated;
    } catch (error) {
      await this.audittrailService.log({
        userId,
        controller: 'cinema-format-map',
        action: 'update',
        details: `Failed to update assignment id ${id}`,
        isError: true,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number, userId: string) {
    try {
      const [deleted] = await db
        .delete(cinemaFormatMapTable)
        .where(eq(cinemaFormatMapTable.id, id))
        .returning();

      await this.audittrailService.log({
        userId,
        controller: 'cinema-format-map',
        action: 'delete',
        details: `Deleted assignment id ${id}`,
        isError: false,
      });

      return deleted;
    } catch (error) {
      await this.audittrailService.log({
        userId,
        controller: 'cinema-format-map',
        action: 'delete',
        details: `Failed to delete assignment id ${id}`,
        isError: true,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });
      throw new InternalServerErrorException(error);
    }
  }

  // Use this to unset other primaries if creating/updating one to be primary
  private async ensureSinglePrimary(
    cinemaId: number,
    excludeId: number | null,
    userId: string,
  ) {
    // Option 1: Error if another primary exists (strict)
    // Option 2: Auto-unset others (user friendly) -> Choosing Option 2

    const whereClause = excludeId
      ? and(
          eq(cinemaFormatMapTable.cinemaId, cinemaId),
          eq(cinemaFormatMapTable.isPrimary, true),
          ne(cinemaFormatMapTable.id, excludeId),
        )
      : and(
          eq(cinemaFormatMapTable.cinemaId, cinemaId),
          eq(cinemaFormatMapTable.isPrimary, true),
        );

    await db
      .update(cinemaFormatMapTable)
      .set({ isPrimary: false })
      .where(whereClause);
  }
}
