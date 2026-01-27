# Mail Service Usage Guide

This guide explains how to use the `MailModule` to send emails from any part of your NestJS application.

---

## 1. Environment Configuration

First, ensure your `.env` file contains the necessary SMTP credentials. You can copy these from `.env.example`:

```env
# .env
APP_NAME=YourAppName

# SMTP Configuration
SMTP_SERVICE=your_smtp_service # e.g., 'gmail', 'sendgrid', etc.
SMTP_SECURE=false # Use true for port 465, false for others (like 587)
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM_NAME="Your App Name"
SMTP_FROM_EMAIL=noreply@yourapp.com
```

These variables are validated on application startup. If any are missing, the application will fail to launch.

---

## 2. Module Setup

To use the `MailService` in any of your feature modules, simply import the `MailModule`.

```ts
// src/your-feature/your-feature.module.ts
import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { YourFeatureService } from './your-feature.service';

@Module({
  imports: [MailModule], // Import MailModule here
  providers: [YourFeatureService],
  // ... other module properties
})
export class YourFeatureModule {}
```

---

## 3. Service: Inject and Send Email

Inject the `MailService` into any service where you need to send an email and call the `sendMail` method.

```ts
// src/your-feature/your-feature.service.ts
import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

@Injectable()
export class YourFeatureService {
  constructor(private readonly mailService: MailService) {}

  async sendWelcomeEmail(to: string) {
    const subject = 'Welcome to Our Application!';
    const text = 'Thank you for joining us.';
    const html = '<b>Thank you for joining us.</b>';

    try {
      await this.mailService.sendMail(to, subject, text, html);
      console.log('Welcome email sent successfully.');
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
  }
}
```

### `sendMail` Method Signature

```ts
async sendMail(
  to: string,
  subject: string,
  text: string,
  html: string,
): Promise<SentMessageInfo>
```

---

## 4. Testing the Mail Service

A test endpoint is available to verify your SMTP configuration.

- **Endpoint**: `POST /mail/test`
- **Body**:
  ```json
  {
    "to": "recipient@example.com"
  }
  ```

If your configuration is correct, the specified recipient will receive a test email.

---

This completes the setup and usage guide for the `MailModule`. The service is now ready to be used throughout your application.
