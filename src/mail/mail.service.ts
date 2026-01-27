import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: this.configService.get<string>('SMTP_SERVICE'),
      secure: this.configService.get<boolean>('SMTP_SECURE'),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    text: string,
    html: string,
  ): Promise<SentMessageInfo> {
    const mailOptions = {
      from: `"${this.configService.get<string>(
        'SMTP_FROM_NAME',
      )}" <${this.configService.get<string>('SMTP_FROM_EMAIL')}>`,
      to,
      subject,
      text,
      html,
    };

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const info: SentMessageInfo =
        await this.transporter.sendMail(mailOptions);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.log('Message sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email: ', error);
      throw error;
    }
  }
}
