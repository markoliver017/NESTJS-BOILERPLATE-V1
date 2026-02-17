import { db } from '../../src/db';
import { inArray } from 'drizzle-orm';
import { user } from '../../src/db/auth-schema';
import { account } from '../../src/db/auth-schema';
import * as crypto from 'crypto';
import { hashPassword } from 'better-auth/crypto';

/**
 * User Seeder for Role-Based Access Control Testing
 * Creates test users for each role: checker, agency_admin, production_viewer, system_admin
 */

async function main() {
  console.log('🌱 Seeding users with roles...\n');

  const users = [
    {
      id: crypto.randomUUID(),
      name: 'System Admin',
      email: 'admin@fpc.com',
      emailVerified: true,
      role: 'system_admin' as const,
      password: 'Admin@123',
    },
    {
      id: crypto.randomUUID(),
      name: 'Agency Supervisor',
      email: 'supervisor@fpc.com',
      emailVerified: true,
      role: 'agency_admin' as const,
      password: 'Supervisor@123',
    },
    {
      id: crypto.randomUUID(),
      name: 'Cinema Checker',
      email: 'checker@fpc.com',
      emailVerified: true,
      role: 'checker' as const,
      password: 'Checker@123',
    },
    {
      id: crypto.randomUUID(),
      name: 'Production Viewer',
      email: 'viewer@starcinema.com',
      emailVerified: true,
      role: 'production_viewer' as const,
      password: 'Viewer@123',
    },
  ];

  try {
    // Delete existing users by email first
    const emails = users.map((u) => u.email);
    console.log(`Deleting existing users with emails: ${emails.join(', ')}`);
    await db.delete(user).where(inArray(user.email, emails));

    for (const userData of users) {
      // Insert user
      await db.insert(user).values({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        emailVerified: userData.emailVerified,
        role: userData.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Insert account with password (for better-auth email/password provider)
      await db.insert(account).values({
        id: crypto.randomUUID(),
        accountId: userData.email,
        providerId: 'credential',
        userId: userData.id,
        password: await hashPassword(userData.password),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(
        `✓ Created ${userData.role}: ${userData.email} (password: ${userData.password})`,
      );
    }

    console.log('\n✅ All users seeded successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    users.forEach((u) => {
      console.log(
        `${u.role.padEnd(20)} | ${u.email.padEnd(30)} | ${u.password}`,
      );
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

void main();
