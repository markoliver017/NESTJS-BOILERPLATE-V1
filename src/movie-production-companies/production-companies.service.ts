import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductionCompanyDto } from './dto/create-production-company.dto';
import { UpdateProductionCompanyDto } from './dto/update-production-company.dto';
import { db } from 'src/db';
import { eq, ilike, or } from 'drizzle-orm';
import { movieProductionCompanies } from 'src/db/movie-production-companies-schema';
import { AudittrailService } from '../audittrail/audittrail.service';

@Injectable()
export class ProductionCompaniesService {
  constructor(private readonly audittrailService: AudittrailService) {}

  async create(createDto: CreateProductionCompanyDto, userId: string) {
    try {
      const [newRecord] = await db
        .insert(movieProductionCompanies)
        .values({ ...createDto })
        .returning();

      await this.audittrailService.log({
        userId,
        controller: 'production-companies',
        action: 'create',
        details: `Created production company: ${newRecord.name}`,
        isError: false,
      });

      return newRecord;
    } catch (error) {
      await this.audittrailService.log({
        userId,
        controller: 'production-companies',
        action: 'create',
        details: `Failed to create production company`,
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
          ilike(movieProductionCompanies.name, `%${q}%`),
          ilike(movieProductionCompanies.shortCode, `%${q}%`),
        )
      : undefined;

    const data = await db.query.movieProductionCompanies.findMany({
      where,
      limit,
      offset,
      orderBy: (companies, { desc }) => [desc(companies.createdAt)],
    });

    // Count query
    const [countResult] = await db
      .select({ count: db.$count(movieProductionCompanies, where) })
      .from(movieProductionCompanies);

    const total = countResult?.count || 0;

    return { data, total };
  }

  async findOne(id: number) {
    const record = await db.query.movieProductionCompanies.findFirst({
      where: eq(movieProductionCompanies.id, id),
    });

    if (!record) {
      throw new NotFoundException(`Production Company with id ${id} not found`);
    }

    return record;
  }

  async update(
    id: number,
    updateDto: UpdateProductionCompanyDto,
    userId: string,
  ) {
    try {
      const [updated] = await db
        .update(movieProductionCompanies)
        .set({ ...updateDto })
        .where(eq(movieProductionCompanies.id, id))
        .returning();

      await this.audittrailService.log({
        userId,
        controller: 'production-companies',
        action: 'update',
        details: `Updated production company id ${id}`,
        isError: false,
      });

      return updated;
    } catch (error) {
      await this.audittrailService.log({
        userId,
        controller: 'production-companies',
        action: 'update',
        details: `Failed to update production company id ${id}`,
        isError: true,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number, userId: string) {
    try {
      // Soft delete: set isActive to false
      const [deleted] = await db
        .update(movieProductionCompanies)
        .set({ isActive: false })
        .where(eq(movieProductionCompanies.id, id))
        .returning();

      await this.audittrailService.log({
        userId,
        controller: 'production-companies',
        action: 'delete',
        details: `Soft deleted production company id ${id}`,
        isError: false,
      });

      return deleted;
    } catch (error) {
      await this.audittrailService.log({
        userId,
        controller: 'production-companies',
        action: 'delete',
        details: `Failed to delete production company id ${id}`,
        isError: true,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });
      throw new InternalServerErrorException(error);
    }
  }
}
