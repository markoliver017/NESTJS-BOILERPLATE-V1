import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../src/db/index'; // your drizzle instance
import { admin } from 'better-auth/plugins';
import { sendEmail } from './email-helpers';
import { buildPCMCEmailHtml } from './email-templates/verification-email';

const APP_NAME = process.env.APP_NAME || 'APP NAME';

export const auth = betterAuth({
  baseURL: process.env.APP_URL || 'http://localhost:3000',
  trustedOrigins: [
    process.env.APP_URL || 'http://localhost:3000',
    'http://localhost:5173',
  ],
  database: drizzleAdapter(db, {
    provider: 'pg', // or "mysql", "sqlite"
  }),
  plugins: [
    admin(), // This enables role-based logic
  ],

  socialProviders: {
    google: {
      prompt: 'select_account',
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      disableImplicitSignUp: true,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const html = buildPCMCEmailHtml(
        APP_NAME,
        'Reset Your Password',
        `Hello ${user.name},<br/><br/>We received a request to reset the password for your ${APP_NAME} account. If you did not make this request, please ignore this email.`,
        'Reset Password',
        url,
        'For security, this link is valid for 1 hour only.',
      );
      await sendEmail({
        to: user.email,
        subject: `Reset your password - ${APP_NAME}`,
        text: `Click the link to reset your password: ${url}`,
        html,
      });
    },
    // onPasswordReset: ({ user }, request) => {
    //   // your logic here
    //   console.log(request);
    //   console.log(`Password for user ${user.email} has been reset.`);
    // },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      console.log('sendVerificationEmail url', url);
      const fallbackUrl = `${process.env.APP_URL}/auth/verify-email`;
      const verificationUrl = url || fallbackUrl;
      const name = user.name?.trim() || 'there';
      const subject = `Verify your ${APP_NAME} email`;
      const text = `Hi ${name},\n\nConfirm your email by visiting: ${verificationUrl}\n\nIf you did not create an account, you can ignore this message.`;
      const html = buildPCMCEmailHtml(
        APP_NAME,
        'Confirm your email',
        `Hi ${name},<br /><br />Thanks for creating an account with ${APP_NAME}. Click the button below to verify your email address and finish setting up your account.`,
        'Verify email',
        verificationUrl,
      );

      const res = await sendEmail({
        to: user.email,
        subject,
        text,
        html,
      });
      if (!res.success) {
        console.log(res.error);
        // await logError(
        //   'LvDJVJ8cCiKA3D7KFtizq2vDxKnLuSw7',
        //   'auth',
        //   'send_verification_email',
        //   `${user.email} - ${res.error || 'Failed to send verification email'}`,
        // );
      }
    },
  },
  //   session: {
  //       cookieCache: {
  //           enabled: true,
  //           maxAge: 5 * 60, // Cache duration in seconds (5 minutes)
  //       },
  //       expiresIn: 60 * 60 * 12, // 16 hours
  //       cookieOptions: {
  //           sameSite: "lax", // Changed from 'strict' (default)
  //           secure: true,
  //           httpOnly: true,
  //           path: "/",
  //       },
  //   },
  //   plugins: [
  //       customSession(async ({ user, session }) => {
  //           // Fetch user with role information
  //           const userWithRole = await db.query.user.findFirst({
  //               where: eq(userTable.id, user.id),
  //               with: {
  //                   role: true,
  //               },
  //           });

  //           return {
  //               ...session,
  //               user: {
  //                   ...user,
  //                   roleId: userWithRole?.roleId,
  //                   roleName: userWithRole?.role?.name,
  //                   roleLevel: userWithRole?.role?.level,
  //               },
  //           };
  //       }),
  //   ],
});
