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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
