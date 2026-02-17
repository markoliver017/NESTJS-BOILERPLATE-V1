import { drizzle } from 'drizzle-orm/node-postgres';
import * as dotenv from 'dotenv';
// Core schemas (no dependencies or circular dependencies handled internally)
import * as appSchema from './app-schema';
import * as authSchema from './auth-schema';
import * as auditSchema from './audit-schema';
import * as enums from './enums';

// Base entities (Level 0)
import * as agenciesSchema from './agencies-schema';
import * as taxRulesSchema from './tax-rules-schema';
import * as theaterGroupsSchema from './theater-groups-schema';
import * as movieProductionCompaniesSchema from './movie-production-companies-schema';
import * as cinemaFormatsSchema from './cinema-formats-schema';
import * as culturalTaxesSchema from './cultural-taxes-schema';

// Dependent entities (Level 1)
import * as theatersSchema from './theaters-schema'; // Depends on theaterGroups
import * as moviesSchema from './movies-schema'; // Depends on movieProductionCompanies
import * as checkersSchema from './checkers-schema'; // Depends on agencies, user
import * as productionReportSchedulesSchema from './production-report-schedules-schema'; // Depends on movieProductionCompanies

// Dependent entities (Level 2)
import * as cinemasSchema from './cinemas-schema'; // Depends on theaters, taxRules
import * as checkerProductionCompaniesSchema from './checker-production-companies-schema'; // Depends on checkers, movieProductionCompanies

// Dependent entities (Level 3)
import * as ticketTypesSchema from './ticket-types-schema'; // Depends on cinemas, culturalTaxes
import * as checkerAttendanceSchema from './checker-attendance-schema'; // Depends on cinemas, user
import * as cinemaFormatMapSchema from './cinema-format-map-schema'; // Depends on cinemas, cinemaFormats
import * as movieFormatMapSchema from './movie-format-map-schema'; // Depends on movies, cinemaFormats
import * as cinemaProductionTaxRulesSchema from './cinema-production-tax-rules-schema'; // Depends on cinemas, movieProductionCompanies, taxRules

// Dependent entities (Level 4)
import * as hourlyReportsSchema from './hourly-reports-schema'; // Depends on cinemas, movies, user
import * as dailySummariesSchema from './daily-summaries-schema'; // Depends on cinemas, movies, user

dotenv.config({ path: '.env' });

const schema = {
  ...enums,
  ...appSchema,
  ...authSchema,
  ...auditSchema,
  ...agenciesSchema,
  ...taxRulesSchema,
  ...theaterGroupsSchema,
  ...movieProductionCompaniesSchema,
  ...cinemaFormatsSchema,
  ...culturalTaxesSchema,
  ...theatersSchema,
  ...moviesSchema,
  ...checkersSchema,
  ...productionReportSchedulesSchema,
  ...cinemasSchema,
  ...checkerProductionCompaniesSchema,
  ...ticketTypesSchema,
  ...checkerAttendanceSchema,
  ...cinemaFormatMapSchema,
  ...movieFormatMapSchema,
  ...cinemaProductionTaxRulesSchema,
  ...hourlyReportsSchema,
  ...hourlyReportsSchema,
  ...dailySummariesSchema,
  ...cinemaFormatsSchema,
  ...cinemaFormatMapSchema,
};

export const db = drizzle(process.env.DATABASE_URL!, {
  schema,
});
