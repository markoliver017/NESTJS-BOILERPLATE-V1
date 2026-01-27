import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SentMessageInfo } from 'nodemailer';
import { MailService } from './mail.service';
import { TestMailDto } from './dto/test-mail.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('test')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async testEmail(@Body() testMailDto: TestMailDto): Promise<SentMessageInfo> {
    const { to } = testMailDto;
    const subject = 'Test Email from NestJS';
    const text = 'This is a test email from the NestJS application.';
    const html = '<b>This is a test email from the NestJS application.</b>';

    return this.mailService.sendMail(to, subject, text, html);
  }
}
