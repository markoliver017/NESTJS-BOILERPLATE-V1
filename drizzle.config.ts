import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: [
    './src/db/enums.ts',
    './src/db/agencies-schema.ts',
    './src/db/theater-groups-schema.ts',
    './src/db/theaters-schema.ts',
    './src/db/tax-rules-schema.ts',
    './src/db/cinemas-schema.ts',
    './src/db/movies-schema.ts',
    './src/db/ticket-types-schema.ts',
    './src/db/checker-attendance-schema.ts',
    './src/db/hourly-reports-schema.ts',
    './src/db/daily-summaries-schema.ts',
    './src/db/auth-schema.ts',
    './src/db/audit-schema.ts',
  ],
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
