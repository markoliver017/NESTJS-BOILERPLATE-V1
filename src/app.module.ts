import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from 'lib/auth';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AudittrailModule } from './audittrail/audittrail.module';
import { validationSchema } from './config/env.validation';
import { MailModule } from './mail/mail.module';
import { UsersModule } from './users/users.module';
import { AgenciesModule } from './agencies/agencies.module';
import { CinemasModule } from './cinemas/cinemas.module';
import { TheaterGroupsModule } from './theater-groups/theater-groups.module';
import { TheatersModule } from './theaters/theaters.module';
import { TaxRulesModule } from './tax-rules/tax-rules.module';
import { CinemaFormatsModule } from './cinema-formats/cinema-formats.module';
import { CinemaFormatMapModule } from './cinema-format-map/cinema-format-map.module';
// const MovieFormatMapModule = ... // Will be implemented in Phase 8

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    AuthModule.forRoot({ auth }),
    UsersModule,
    AudittrailModule,
    MailModule,
    AgenciesModule,
    CinemasModule,
    TheaterGroupsModule,
    TheatersModule,
    TaxRulesModule,
    CinemaFormatsModule,
    CinemaFormatMapModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
