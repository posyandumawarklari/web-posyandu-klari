require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function check() {
  const email = 'admin@posyandu.id';
  const user = await prisma.user.findUnique({ where: { email } });
  console.log('User password in DB:', user.password);
  
  const pw1 = 'password123';
  const pw2 = 'admin123';
  
  console.log('Matches password123?', await bcrypt.compare(pw1, user.password));
  console.log('Matches admin123?', await bcrypt.compare(pw2, user.password));
  
  process.exit(0);
}

check();
