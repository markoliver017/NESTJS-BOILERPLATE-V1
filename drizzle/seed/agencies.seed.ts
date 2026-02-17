import { db } from '../../src/db';
import { agencies } from '../../src/db/agencies-schema';

async function main() {
  console.log('Seeding agencies...');

  await db.insert(agencies).values([
    {
      name: 'First Production Checkers Agency',
      contactPerson: 'John Doe',
      email: 'john.doe@fpc-agency.com',
      phone: '+63 917 123 4567',
    },
    {
      name: 'Metro Manila Cinema Checkers',
      contactPerson: 'Jane Smith',
      email: 'jane.smith@mmcc.com',
      phone: '+63 917 234 5678',
    },
    {
      name: 'Nationwide Box Office Services',
      contactPerson: 'Mike Johnson',
      email: 'mike.johnson@nbos.com',
      phone: '+63 917 345 6789',
    },
  ]);

  console.log('✓ Agencies seeded successfully');
}

void main();
