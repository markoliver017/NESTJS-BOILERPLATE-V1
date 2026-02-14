import { drizzle } from 'drizzle-orm/node-postgres';
import * as dotenv from 'dotenv';
import * as appSchema from './schema';
import * as authSchema from './auth-schema';
import * as auditSchema from './audit-schema';

dotenv.config({ path: '.env' });

const schema = { ...appSchema, ...authSchema, ...auditSchema };

export const db = drizzle(process.env.DATABASE_URL!, {
  schema,
});
