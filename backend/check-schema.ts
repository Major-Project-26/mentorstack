import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function checkSchema() {
  try {
    // Query the database schema directly to see what columns exist
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Answer' 
      AND table_schema = 'public'
      ORDER BY ordinal_position;
    `;
    
    console.log('Answer table columns:', result);
    
  } catch (error) {
    console.error('Error checking schema:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSchema();
