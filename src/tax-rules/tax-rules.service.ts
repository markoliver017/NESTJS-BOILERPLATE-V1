import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaxRuleDto } from './dto/create-tax-rule.dto';
import { UpdateTaxRuleDto } from './dto/update-tax-rule.dto';
import { db } from '../db';
import { eq, ilike, sql } from 'drizzle-orm';
import { taxRules } from '../db/tax-rules-schema';
import { AudittrailService } from '../audittrail/audittrail.service';

@Injectable()
export class TaxRulesService {
  constructor(private readonly audittrailService: AudittrailService) {}

  async create(createTaxRuleDto: CreateTaxRuleDto, userId: string) {
    try {
      const [newRecord] = await db
        .insert(taxRules)
        .values({ ...createTaxRuleDto })
        .returning();

      await this.audittrailService.log({
        userId,
        controller: 'tax-rules',
        action: 'create',
        details: `Created tax rule: ${newRecord.name}`,
        isError: false,
      });

      return newRecord;
    } catch (error) {
      await this.audittrailService.log({
        userId,
        controller: 'tax-rules',
        action: 'create',
        details: `Failed to create tax rule`,
        isError: true,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findAll(q?: string, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const searchFilter = q ? ilike(taxRules.name, `%${q}%`) : undefined;

    const data = await db.query.taxRules.findMany({
      where: searchFilter,
      limit,
      offset,
      orderBy: (taxRules, { desc }) => [desc(taxRules.createdAt)],
    });

    const [totalResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(taxRules)
      .where(searchFilter);

    const total = Number(totalResult?.count || 0);

    return { data, total };
  }

  async findOne(id: number) {
    const record = await db.query.taxRules.findFirst({
      where: eq(taxRules.id, id),
    });
    if (!record) {
      throw new NotFoundException(`Tax Rule with id ${id} not found`);
    }
    return record;
  }

  async update(id: number, updateTaxRuleDto: UpdateTaxRuleDto, userId: string) {
    try {
      const [updated] = await db
        .update(taxRules)
        .set({ ...updateTaxRuleDto })
        .where(eq(taxRules.id, id))
        .returning();

      await this.audittrailService.log({
        userId,
        controller: 'tax-rules',
        action: 'update',
        details: `Updated tax rule id ${id}`,
        isError: false,
      });

      return updated;
    } catch (error) {
      await this.audittrailService.log({
        userId,
        controller: 'tax-rules',
        action: 'update',
        details: `Failed to update tax rule id ${id}`,
        isError: true,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number, userId: string) {
    try {
      const [deleted] = await db
        .delete(taxRules)
        .where(eq(taxRules.id, id))
        .returning();

      await this.audittrailService.log({
        userId,
        controller: 'tax-rules',
        action: 'delete',
        details: `Deleted tax rule id ${id}`,
        isError: false,
      });

      return deleted;
    } catch (error) {
      await this.audittrailService.log({
        userId,
        controller: 'tax-rules',
        action: 'delete',
        details: `Failed to delete tax rule id ${id}`,
        isError: true,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });
      throw new InternalServerErrorException(error);
    }
  }
}
