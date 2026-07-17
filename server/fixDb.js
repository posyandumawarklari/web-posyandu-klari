const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixArticles() {
  const articles = await prisma.article.findMany();
  let count = 0;

  for (const article of articles) {
    if (!article.content) continue;

    let newContent = article.content
      .replace(/<p><\/p>/g, '<p><br></p>')
      .replace(/<p class="[^"]*"><\/p>/g, '<p><br></p>')
      .replace(/&nbsp;/g, ' ');

    if (newContent !== article.content) {
      await prisma.article.update({
        where: { id: article.id },
        data: { content: newContent }
      });
      count++;
    }
  }

  console.log(`Successfully fixed ${count} articles.`);
}

fixArticles().catch(console.error).finally(() => prisma.$disconnect());
