require('dotenv').config();
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
    
  // Added missing tables
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Connection"', 'id'), COALESCE(MAX(id), 1)) FROM "Connection"`;
  console.log('✅ Connection sequence reset');

  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Conversation"', 'id'), COALESCE(MAX(id), 1)) FROM "Conversation"`;
  console.log('✅ Conversation sequence reset');

  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Message"', 'id'), COALESCE(MAX(id), 1)) FROM "Message"`;
  console.log('✅ Message sequence reset');

  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"QuestionBookmark"', 'id'), COALESCE(MAX(id), 1)) FROM "QuestionBookmark"`;
  console.log('✅ QuestionBookmark sequence reset');

  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"ArticleBookmark"', 'id'), COALESCE(MAX(id), 1)) FROM "ArticleBookmark"`;
  console.log('✅ ArticleBookmark sequence reset');

  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"CommunityPostBookmark"', 'id'), COALESCE(MAX(id), 1)) FROM "CommunityPostBookmark"`;
  console.log('✅ CommunityPostBookmark sequence reset');

  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"ReputationHistory"', 'id'), COALESCE(MAX(id), 1)) FROM "ReputationHistory"`;
  console.log('✅ ReputationHistory sequence reset');

  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Badge"', 'id'), COALESCE(MAX(id), 1)) FROM "Badge"`;
  console.log('✅ Badge sequence reset');

  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"UserBadge"', 'id'), COALESCE(MAX(id), 1)) FROM "UserBadge"`;
  console.log('✅ UserBadge sequence reset');

  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"AiLog"', 'id'), COALESCE(MAX(id), 1)) FROM "AiLog"`;
  console.log('✅ AiLog sequence reset');
    
  console.log('🎉 All database sequences reset successfully!');
  console.log('🚀 Inserts should now work properly across all core tables');
  } catch (error) {
    console.error('❌ Error resetting sequences:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetSequences();
