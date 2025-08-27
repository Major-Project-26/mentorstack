const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetSequences() {
  try {
    console.log('🔧 Resetting database sequences...');
    
    // Reset all sequences to match the highest ID in each table
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Community"', 'id'), COALESCE(MAX(id), 1)) FROM "Community"`;
    console.log('✅ Community sequence reset');
    
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"CommunityMember"', 'id'), COALESCE(MAX(id), 1)) FROM "CommunityMember"`;
    console.log('✅ CommunityMember sequence reset');
    
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"CommunityPost"', 'id'), COALESCE(MAX(id), 1)) FROM "CommunityPost"`;
    console.log('✅ CommunityPost sequence reset');
    
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"CommunityPostVote"', 'id'), COALESCE(MAX(id), 1)) FROM "CommunityPostVote"`;
    console.log('✅ CommunityPostVote sequence reset');
    
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Question"', 'id'), COALESCE(MAX(id), 1)) FROM "Question"`;
    console.log('✅ Question sequence reset');
    
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Answer"', 'id'), COALESCE(MAX(id), 1)) FROM "Answer"`;
    console.log('✅ Answer sequence reset');
    
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"QuestionVote"', 'id'), COALESCE(MAX(id), 1)) FROM "QuestionVote"`;
    console.log('✅ QuestionVote sequence reset');
    
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"AnswerVote"', 'id'), COALESCE(MAX(id), 1)) FROM "AnswerVote"`;
    console.log('✅ AnswerVote sequence reset');
    
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Article"', 'id'), COALESCE(MAX(id), 1)) FROM "Article"`;
    console.log('✅ Article sequence reset');
    
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"ArticleVote"', 'id'), COALESCE(MAX(id), 1)) FROM "ArticleVote"`;
    console.log('✅ ArticleVote sequence reset');
    
    console.log('🎉 All database sequences reset successfully!');
    console.log('🚀 Community creation and voting should now work properly');
  } catch (error) {
    console.error('❌ Error resetting sequences:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetSequences();
