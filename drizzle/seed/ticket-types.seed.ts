import { db } from '../../src/db';
import { ticketTypes } from '../../src/db/ticket-types-schema';

async function main() {
  console.log('Seeding ticket types...');

  // Note: You need to have cinemas seeded first
  const [firstCinema] = await db.query.cinemas.findMany({ limit: 1 });

  if (!firstCinema) {
    console.error('Please seed cinemas first!');
    return;
  }

  await db.insert(ticketTypes).values([
    {
      cinemaId: firstCinema.id,
      name: 'Adult',
      basePrice: '350.00',
      discountAmount: '0.00',
      isTaxable: true,
    },
    {
      cinemaId: firstCinema.id,
      name: 'Student',
      basePrice: '350.00',
      discountAmount: '50.00',
      isTaxable: true,
    },
    {
      cinemaId: firstCinema.id,
      name: 'Senior Citizen',
      basePrice: '350.00',
      discountAmount: '70.00',
      isTaxable: true,
    },
    {
      cinemaId: firstCinema.id,
      name: 'PWD',
      basePrice: '350.00',
      discountAmount: '70.00',
      isTaxable: true,
    },
    {
      cinemaId: firstCinema.id,
      name: 'Child',
      basePrice: '300.00',
      discountAmount: '0.00',
      isTaxable: true,
    },
  ]);

  console.log('✓ Ticket types seeded successfully');
}

void main();
