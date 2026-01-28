import { ConfigService } from '@nestjs/config';
import { MailService } from '../src/mail/mail.service';

const configService = new ConfigService();
const mailService = new MailService(configService);

export const sendEmail = async (options: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) => {
  try {
    await mailService.sendMail(
      options.to,
      options.subject,
      options.text,
      options.html,
    );
    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: 'Failed to send email' };
  }
};
