import { db } from '../../src/db';
import { taxRules } from '../../src/db/tax-rules-schema';

async function main() {
  console.log('Seeding tax rules...');

  await db.insert(taxRules).values([
    {
      name: 'Standard 12% VAT',
      formulaType: 'gross_based',
      taxRate: '12.00',
      divisor: '1.12',
      description: 'Standard Philippine VAT computation: (Gross × 12%) / 1.12',
    },
    {
      name: 'Amusement Tax 10%',
      formulaType: 'gross_based',
      taxRate: '10.00',
      divisor: '1.10',
      description: 'Local amusement tax: (Gross × 10%) / 1.10',
    },
    {
      name: 'Combined VAT + Amusement 20%',
      formulaType: 'gross_based',
      taxRate: '20.00',
      divisor: '1.20',
      description: 'Combined VAT and amusement tax',
    },
  ]);

  console.log('✓ Tax rules seeded successfully');
}

void main();
