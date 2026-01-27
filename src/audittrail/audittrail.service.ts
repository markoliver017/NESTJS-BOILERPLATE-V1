import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAudittrailDto } from './dto/create-audittrail.dto';
import { FindAudittrailDto } from './dto/find-audittrail.dto';
import { UpdateAudittrailDto } from './dto/update-audittrail.dto';
import { db } from 'src/db';
import { auditTrails } from 'src/db/schema';
import { and, asc, desc, eq } from 'drizzle-orm';

@Injectable()
export class AudittrailService {
  async log(createAudittrailDto: CreateAudittrailDto) {
    return await this.create(createAudittrailDto);
  }

  async create(createAudittrailDto: CreateAudittrailDto) {
    try {
      const [newAuditTrail] = await db
        .insert(auditTrails)
        .values({
          userId: createAudittrailDto.userId,
          controller: createAudittrailDto.controller,
          action: createAudittrailDto.action,
          isError: createAudittrailDto.isError,
          details: createAudittrailDto.details,
          ipAddress: createAudittrailDto.ipAddress,
          userAgent: createAudittrailDto.userAgent,
          stackTrace: createAudittrailDto.stackTrace,
        })
        .returning();

      return newAuditTrail;
    } catch (error) {
      console.log('Create AuditTrail Error: ', error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async findAll(query?: FindAudittrailDto) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 20;
    const offset = (page - 1) * limit;

    const where = and(
      query?.userId ? eq(auditTrails.userId, query.userId) : undefined,
      query?.controller
        ? eq(auditTrails.controller, query.controller)
        : undefined,
      query?.action ? eq(auditTrails.action, query.action) : undefined,
      typeof query?.isError === 'boolean'
        ? eq(auditTrails.isError, query.isError)
        : undefined,
    );

    const sortBy = query?.sortBy ?? 'createdAt';
    const sortOrder = query?.sortOrder ?? 'desc';
    const orderByExpr =
      sortBy === 'id'
        ? sortOrder === 'asc'
          ? asc(auditTrails.id)
          : desc(auditTrails.id)
        : sortOrder === 'asc'
          ? asc(auditTrails.createdAt)
          : desc(auditTrails.createdAt);

    const baseQuery = db
      .select()
      .from(auditTrails)
      .orderBy(orderByExpr)
      .limit(limit)
      .offset(offset);

    if (where) {
      return await baseQuery.where(where);
    }

    return await baseQuery;
  }

  async findOne(id: number) {
    const auditTrail = await db.query.auditTrails.findFirst({
      where: eq(auditTrails.id, id),
    });

    if (!auditTrail) {
      throw new NotFoundException('Audit trail not found');
    }

    return auditTrail;
  }

  update(id: number, updateAudittrailDto: UpdateAudittrailDto) {
    void id;
    void updateAudittrailDto;
    throw new BadRequestException('Audit trail entries are immutable');
  }

  remove(id: number) {
    void id;
    throw new BadRequestException('Audit trail entries are immutable');
  }
}
