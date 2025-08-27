import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const dataDir = path.join(__dirname, 'data');

  // Map filenames → Prisma model
  const modelMap: Record<string, keyof PrismaClient> = {
    'ai-logs': 'aiLog',
    // mentors: 'mentor',
    // mentees: 'mentee',
    // admins: 'admin',
    // 'auth-credentials': 'authCredentials',

    // communities: 'community',
    // 'community-members': 'communityMember',
    // 'community-posts': 'communityPost',
    // 'community-post-votes': 'communityPostVote',

    // questions: 'question',
    // answers: 'answer',

    // tags: 'tag',
    // 'question-tag': 'questionTag',
    // articles: 'article',
    // 'article-tags': 'articleTag',
    // 'article-votes': 'articleVote',

    // connections: 'connection',
    // conversations: 'conversation',
    // messages: 'message',

    // badges: 'badge',
    // 'user-badges': 'userBadge',
    // 'reputation-history': 'reputationHistory',

    // bookmarks: 'bookmark',
  };

  for (const [file, model] of Object.entries(modelMap)) {
    const filePath = path.join(dataDir, `${file}.json`);

    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const records = JSON.parse(raw);

      if (records.length > 0) {
        console.log(`🌱 Seeding ${records.length} records into ${String(model)}...`);

        // @ts-ignore dynamic access
        await prisma[model].createMany({
          data: records,
          skipDuplicates: true
        });
      }
    } else {
      console.warn(`⚠️ No data file found for ${file}`);
    }
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
