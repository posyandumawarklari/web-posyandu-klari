const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const posyanduData = [
  {
    name: 'Mawar 1',
    area: 'Jetis, Klari',
    location: 'Masjid al Iman',
    mapX: '35%',
    mapY: '45%',
    headName: 'Kartina',
    headPhone: '6281393903015',
    cadres: ['Kartina W.', 'Sunarni', 'Siti S.', 'Nur K.', 'Nur H.', 'Sri P.']
  },
  {
    name: 'Mawar 2',
    area: 'Beneran, Klari',
    location: 'Rumah Bp Sarjono (Kadus 1)',
    mapX: '55%',
    mapY: '35%',
    headName: 'Maryatun',
    headPhone: '6282136919382',
    cadres: ['Maryatun', 'Nurkayati', 'Murtiningsih', 'Romtini', 'Sunarni']
  },
  {
    name: 'Mawar 3',
    area: 'Sambi, Klari',
    location: 'Rumah Ibu Trikusmaryati',
    mapX: '70%',
    mapY: '50%',
    headName: 'Tri K.',
    headPhone: '6285229235948',
    cadres: ['Tri K.', 'Harminah', 'Hesti M.', 'Badriyah K.', 'Itasari', 'Rita C.']
  },
  {
    name: 'Mawar 4',
    area: 'Klari Ledok, Klari',
    location: 'Rumah Ibu Yani',
    mapX: '50%',
    mapY: '60%',
    headName: 'Sri M.',
    headPhone: '6285226154625',
    cadres: ['Sri M.', 'Mukini', 'Murni', 'Sri U.', 'Suwarti', 'Nuryati', 'Suyamto']
  },
  {
    name: 'Mawar 5',
    area: 'Klari Wetan, Klari',
    location: 'Rumah Bp Sugiyanto (Kadus 2)',
    mapX: '80%',
    mapY: '65%',
    headName: 'Siti R.',
    headPhone: '6285747169463',
    cadres: ['Siti R.', 'Hengki S.', 'Sukiyati', 'Fitri D.', 'Riska W.']
  },
  {
    name: 'Mawar 6',
    area: 'Blimbing, Klari',
    location: 'Kademangan',
    mapX: '30%',
    mapY: '75%',
    headName: 'Sangadah',
    headPhone: '6285642054236',
    cadres: ['Sangadah', 'Warti', 'Daryanti', 'Putri S.', 'Putri R.']
  }
];

async function main() {
  console.log('Start seeding posyandu posts...');
  for (const p of posyanduData) {
    await prisma.posyanduPost.create({
      data: p
    });
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
