import { Client } from 'pg';
import 'dotenv/config';

async function check() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const res = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'theaters'");
  console.table(res.rows);
  await client.end();
}
check();
