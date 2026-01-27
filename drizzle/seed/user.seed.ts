import { seed } from 'drizzle-seed';
import { db } from '../../src/db';
import { user } from '../../src/db/auth-schema';

async function main() {
  await seed(
    db,
    { user },
    {
      count: 1,
    },
  );
}

void main();
