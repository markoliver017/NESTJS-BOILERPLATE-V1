import { drizzle } from 'drizzle-orm/node-postgres';
import * as dotenv from 'dotenv';
import * as appSchema from './schema';
import * as authSchema from './auth-schema';

dotenv.config({ path: '.env' });

const schema = { ...appSchema, ...authSchema };

export const db = drizzle(process.env.DATABASE_URL!, {
  schema,
});
