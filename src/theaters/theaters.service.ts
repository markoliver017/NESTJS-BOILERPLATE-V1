import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';
import { db } from '../db';
import { eq, ilike, or, sql } from 'drizzle-orm';
import { theaters } from '../db/theaters-schema';
import { AudittrailService } from '../audittrail/audittrail.service';

@Injectable()
export class TheatersService {
  constructor(private readonly audittrailService: AudittrailService) {}

  async create(createTheaterDto: CreateTheaterDto, userId: string) {
    try {
      const [newRecord] = await db
        .insert(theaters)
        .values({
          ...createTheaterDto,
          latitude: createTheaterDto.latitude.toString(),
          longitude: createTheaterDto.longitude.toString(),
        })
        .returning();

      await this.audittrailService.log({
        userId,
        controller: 'theaters',
        action: 'create',
        details: `Created theater: ${newRecord.name}`,
        isError: false,
      });

      return newRecord;
    } catch (error) {
      await this.audittrailService.log({
        userId,
        controller: 'theaters',
        action: 'create',
        details: `Failed to create theater`,
        isError: true,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findAll(q?: string, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const searchFilter = q
      ? or(
          ilike(theaters.name, `%${q}%`),
          ilike(theaters.city, `%${q}%`),
          ilike(theaters.province, `%${q}%`),
        )
      : undefined;

    const data = await db.query.theaters.findMany({
      where: searchFilter,
      limit,
      offset,
      with: {
        theaterGroup: true,
        taxRule: true,
      },
      orderBy: (theaters, { desc }) => [desc(theaters.createdAt)],
    });

    const [totalResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(theaters)
      .where(searchFilter);

    const total = Number(totalResult?.count || 0);

    return { data, total };
  }

  async findOne(id: number) {
    const record = await db.query.theaters.findFirst({
      where: eq(theaters.id, id),
      with: {
        theaterGroup: true,
        taxRule: true,
      },
    });
    if (!record) {
      throw new NotFoundException(`Theater with id ${id} not found`);
    }
    return record;
  }

  async update(id: number, updateTheaterDto: UpdateTheaterDto, userId: string) {
    try {
      const [updated] = await db
        .update(theaters)
        .set({
          ...updateTheaterDto,
          latitude: updateTheaterDto.latitude?.toString(),
          longitude: updateTheaterDto.longitude?.toString(),
        })
        .where(eq(theaters.id, id))
        .returning();

      await this.audittrailService.log({
        userId,
        controller: 'theaters',
        action: 'update',
        details: `Updated theater id ${id}`,
        isError: false,
      });

      return updated;
    } catch (error) {
      await this.audittrailService.log({
        userId,
        controller: 'theaters',
        action: 'update',
        details: `Failed to update theater id ${id}`,
        isError: true,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number, userId: string) {
    try {
      // Soft delete by setting isActive to false
      const [deleted] = await db
        .update(theaters)
        .set({ isActive: false })
        .where(eq(theaters.id, id))
        .returning();

      await this.audittrailService.log({
        userId,
        controller: 'theaters',
        action: 'delete',
        details: `Deactivated theater id ${id}`,
        isError: false,
      });

      return deleted;
    } catch (error) {
      await this.audittrailService.log({
        userId,
        controller: 'theaters',
        action: 'delete',
        details: `Failed to deactivate theater id ${id}`,
        isError: true,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });
      throw new InternalServerErrorException(error);
    }
  }
}
