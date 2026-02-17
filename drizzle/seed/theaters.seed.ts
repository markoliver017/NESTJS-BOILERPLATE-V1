import { db } from '../../src/db';
import { theaters } from '../../src/db/theaters-schema';
import { theaterGroups } from '../../src/db/theater-groups-schema';
import { taxRules } from '../../src/db/tax-rules-schema';

async function main() {
  console.log('Seeding theaters...');

  // Fetch prerequisites
  const group = await db.query.theaterGroups.findFirst();
  const taxRule = await db.query.taxRules.findFirst();

  if (!group || !taxRule) {
    console.error(
      'Error: Theater Group or Tax Rule not found. Seed them first.',
    );
    process.exit(1);
  }

  await db.insert(theaters).values([
    {
      theaterGroupId: group.id,
      taxRuleId: taxRule.id,
      name: 'Sample Theater 1',
      address: '123 Cinema St',
      city: 'Metro City',
      province: 'Metro Manila',
      latitude: '14.599512',
      longitude: '120.984222',
      isActive: true,
    },
    {
      theaterGroupId: group.id,
      taxRuleId: taxRule.id,
      name: 'Sample Theater 2',
      address: '456 Movie Blvd',
      city: 'Quezon City',
      province: 'Metro Manila',
      latitude: '14.676041',
      longitude: '121.043701',
      isActive: true,
    },
  ]);

  console.log('✓ Theaters seeded successfully');
}

void main();
