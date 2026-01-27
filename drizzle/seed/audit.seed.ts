import { seed } from 'drizzle-seed';
import { db } from '../../src/db';
import { auditTrails } from '../../src/db/schema';

async function main() {
  await seed(db, { auditTrails });
}

void main();
