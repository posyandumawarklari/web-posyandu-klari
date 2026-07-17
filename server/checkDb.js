const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const article = await prisma.article.findFirst({
    orderBy: { createdAt: 'desc' }
  });
  if (article) {
    console.log("=== LATEST ARTICLE CONTENT ===");
    console.log(article.content);
    console.log("==============================");
  } else {
    console.log("No articles found.");
  }
}

check().catch(console.error).finally(() => prisma.$disconnect());
