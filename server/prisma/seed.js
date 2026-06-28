const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // ========================
  // 1. Create Admin User
  // ========================
  const hashedPassword = await bcrypt.hash('admin123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@posyandu.id' },
    update: {},
    create: {
      name: 'Administrator',
      email: 'admin@posyandu.id',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // ========================
  // 2. Create Cadre User
  // ========================
  const cadrePassword = await bcrypt.hash('kader123', 12);

  const cadre = await prisma.user.upsert({
    where: { email: 'kader@posyandu.id' },
    update: {},
    create: {
      name: 'Kader Posyandu',
      email: 'kader@posyandu.id',
      password: cadrePassword,
      role: 'CADRE',
    },
  });
  console.log('✅ Cadre user created:', cadre.email);

  // ========================
  // 3. Create Categories
  // ========================
  const categories = [
    { name: 'Kesehatan Ibu', slug: 'kesehatan-ibu' },
    { name: 'Kesehatan Anak', slug: 'kesehatan-anak' },
    { name: 'Gizi & Nutrisi', slug: 'gizi-nutrisi' },
    { name: 'Imunisasi', slug: 'imunisasi' },
    { name: 'KB & Reproduksi', slug: 'kb-reproduksi' },
    { name: 'Kegiatan Posyandu', slug: 'kegiatan-posyandu' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`✅ ${categories.length} categories created`);

  // ========================
  // 4. Create Tags
  // ========================
  const tags = [
    { name: 'Balita', slug: 'balita' },
    { name: 'Ibu Hamil', slug: 'ibu-hamil' },
    { name: 'Vaksinasi', slug: 'vaksinasi' },
    { name: 'MPASI', slug: 'mpasi' },
    { name: 'Tumbuh Kembang', slug: 'tumbuh-kembang' },
    { name: 'Posyandu', slug: 'posyandu' },
    { name: 'Kesehatan', slug: 'kesehatan' },
    { name: 'Tips Sehat', slug: 'tips-sehat' },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
  }
  console.log(`✅ ${tags.length} tags created`);

  // ========================
  // 5. Create Programs
  // ========================
  const programs = [
    {
      title: 'Penimbangan Balita',
      description:
        'Program penimbangan rutin setiap bulan untuk memantau tumbuh kembang balita. Kegiatan ini meliputi pengukuran berat badan, tinggi badan, dan lingkar kepala anak usia 0-5 tahun. Data yang diperoleh dicatat dalam Kartu Menuju Sehat (KMS) untuk memantau pertumbuhan anak secara berkala.',
    },
    {
      title: 'Imunisasi Dasar',
      description:
        'Pemberian imunisasi dasar lengkap untuk bayi dan balita sesuai jadwal yang ditetapkan oleh Kementerian Kesehatan. Meliputi vaksin BCG, DPT-HB-Hib, Polio, Campak, dan vaksin lainnya. Program ini bertujuan melindungi anak dari penyakit-penyakit yang dapat dicegah dengan imunisasi.',
    },
    {
      title: 'Pemberian Vitamin A',
      description:
        'Program pemberian suplemen Vitamin A setiap bulan Februari dan Agustus untuk bayi usia 6-11 bulan (kapsul biru) dan balita usia 12-59 bulan (kapsul merah). Vitamin A penting untuk kesehatan mata, pertumbuhan, dan daya tahan tubuh anak.',
    },
    {
      title: 'Pemeriksaan Ibu Hamil',
      description:
        'Layanan pemeriksaan kehamilan rutin yang mencakup pengecekan tekanan darah, berat badan, tinggi fundus, detak jantung janin, dan pemberian tablet tambah darah. Ibu hamil disarankan melakukan pemeriksaan minimal 6 kali selama kehamilan.',
    },
    {
      title: 'Penyuluhan Gizi',
      description:
        'Kegiatan edukasi dan penyuluhan tentang gizi seimbang, MPASI, serta pola makan sehat untuk ibu dan anak. Program ini juga mencakup demonstrasi pembuatan makanan bergizi dari bahan-bahan lokal yang mudah didapat dan terjangkau.',
    },
    {
      title: 'Program KB',
      description:
        'Pelayanan konsultasi dan edukasi Keluarga Berencana (KB) untuk pasangan usia subur. Memberikan informasi tentang berbagai metode kontrasepsi yang tersedia, manfaat, dan efek sampingnya agar pasangan dapat membuat keputusan yang tepat.',
    },
  ];

  for (const program of programs) {
    const existing = await prisma.program.findFirst({
      where: { title: program.title },
    });
    if (!existing) {
      await prisma.program.create({ data: program });
    }
  }
  console.log(`✅ ${programs.length} programs created`);

  // ========================
  // 6. Create Schedules
  // ========================
  const now = new Date();
  const schedules = [
    {
      activityName: 'Posyandu Rutin Bulanan',
      description: 'Kegiatan posyandu rutin meliputi penimbangan balita, imunisasi, dan penyuluhan kesehatan.',
      date: new Date(now.getFullYear(), now.getMonth() + 1, 10),
      time: '08:00 - 12:00',
      location: 'Balai RT 03/RW 05',
    },
    {
      activityName: 'Pemberian Vitamin A',
      description: 'Pemberian suplemen Vitamin A untuk balita usia 6-59 bulan.',
      date: new Date(now.getFullYear(), now.getMonth() + 1, 15),
      time: '08:00 - 11:00',
      location: 'Posyandu Melati',
    },
    {
      activityName: 'Penyuluhan MPASI',
      description: 'Demo masak dan penyuluhan tentang Makanan Pendamping ASI untuk ibu-ibu.',
      date: new Date(now.getFullYear(), now.getMonth() + 1, 20),
      time: '09:00 - 11:30',
      location: 'Aula Kelurahan',
    },
    {
      activityName: 'Pemeriksaan Ibu Hamil',
      description: 'Pemeriksaan kehamilan rutin oleh bidan dan pemberian tablet tambah darah.',
      date: new Date(now.getFullYear(), now.getMonth() + 1, 25),
      time: '08:00 - 12:00',
      location: 'Puskesmas Kecamatan',
    },
  ];

  for (const schedule of schedules) {
    const existing = await prisma.schedule.findFirst({
      where: { activityName: schedule.activityName },
    });
    if (!existing) {
      await prisma.schedule.create({ data: schedule });
    }
  }
  console.log(`✅ ${schedules.length} schedules created`);

  // ========================
  // 7. Create Sample Articles
  // ========================
  const kesehatanAnak = await prisma.category.findUnique({
    where: { slug: 'kesehatan-anak' },
  });

  const giziNutrisi = await prisma.category.findUnique({
    where: { slug: 'gizi-nutrisi' },
  });

  const imunisasi = await prisma.category.findUnique({
    where: { slug: 'imunisasi' },
  });

  const balitaTag = await prisma.tag.findUnique({ where: { slug: 'balita' } });
  const kesehatanTag = await prisma.tag.findUnique({ where: { slug: 'kesehatan' } });
  const mpasiTag = await prisma.tag.findUnique({ where: { slug: 'mpasi' } });
  const vaksinasiTag = await prisma.tag.findUnique({ where: { slug: 'vaksinasi' } });
  const tumbuhKembangTag = await prisma.tag.findUnique({ where: { slug: 'tumbuh-kembang' } });

  const articles = [
    {
      title: 'Pentingnya Imunisasi Dasar Lengkap untuk Bayi',
      slug: 'pentingnya-imunisasi-dasar-lengkap-untuk-bayi',
      content: `<h2>Mengapa Imunisasi Penting?</h2>
<p>Imunisasi merupakan salah satu cara paling efektif untuk melindungi bayi dan anak dari berbagai penyakit berbahaya. Dengan mendapatkan imunisasi dasar lengkap, sistem kekebalan tubuh anak akan terbentuk dengan baik.</p>
<h3>Jadwal Imunisasi Dasar</h3>
<p>Berikut jadwal imunisasi dasar yang harus diberikan kepada bayi:</p>
<ul>
<li><strong>Hepatitis B:</strong> Diberikan saat lahir (0-24 jam)</li>
<li><strong>BCG:</strong> Diberikan pada usia 1 bulan</li>
<li><strong>DPT-HB-Hib:</strong> Diberikan pada usia 2, 3, dan 4 bulan</li>
<li><strong>Polio:</strong> Diberikan pada usia 1, 2, 3, dan 4 bulan</li>
<li><strong>Campak:</strong> Diberikan pada usia 9 bulan</li>
</ul>
<h3>Efek Samping</h3>
<p>Efek samping imunisasi umumnya ringan seperti demam ringan atau bengkak di area suntikan. Hal ini merupakan reaksi normal dan akan hilang dalam beberapa hari.</p>`,
      excerpt: 'Imunisasi dasar lengkap sangat penting untuk melindungi bayi dari berbagai penyakit berbahaya. Ketahui jadwal dan manfaatnya.',
      status: 'PUBLISHED',
      publishDate: new Date(),
      categoryId: imunisasi?.id,
      authorId: admin.id,
      seoTitle: 'Pentingnya Imunisasi Dasar Lengkap untuk Bayi | Posyandu Melati',
      seoDescription: 'Ketahui pentingnya imunisasi dasar lengkap untuk bayi, jadwal pemberian, dan efek samping yang mungkin terjadi.',
      tagIds: [vaksinasiTag?.id, kesehatanTag?.id, balitaTag?.id].filter(Boolean),
    },
    {
      title: 'Panduan MPASI untuk Bayi Usia 6 Bulan',
      slug: 'panduan-mpasi-untuk-bayi-usia-6-bulan',
      content: `<h2>Kapan Memulai MPASI?</h2>
<p>Makanan Pendamping ASI (MPASI) mulai diberikan saat bayi berusia 6 bulan. Pada usia ini, ASI saja sudah tidak cukup untuk memenuhi kebutuhan nutrisi bayi yang semakin meningkat.</p>
<h3>Tanda Bayi Siap MPASI</h3>
<ul>
<li>Bayi sudah bisa duduk dengan bantuan</li>
<li>Kontrol kepala dan leher sudah baik</li>
<li>Menunjukkan ketertarikan pada makanan</li>
<li>Refleks menjulurkan lidah sudah berkurang</li>
</ul>
<h3>Menu MPASI Pertama</h3>
<p>Mulailah dengan tekstur halus (puree) dan berikan satu jenis makanan terlebih dahulu selama 2-3 hari untuk melihat reaksi alergi. Contoh menu:</p>
<ul>
<li>Puree pisang</li>
<li>Puree alpukat</li>
<li>Bubur beras merah</li>
<li>Puree labu kuning</li>
</ul>`,
      excerpt: 'Panduan lengkap memulai MPASI untuk bayi usia 6 bulan. Ketahui tanda bayi siap MPASI dan contoh menu yang tepat.',
      status: 'PUBLISHED',
      publishDate: new Date(),
      categoryId: giziNutrisi?.id,
      authorId: admin.id,
      seoTitle: 'Panduan MPASI Bayi 6 Bulan | Posyandu Melati',
      seoDescription: 'Panduan lengkap memulai MPASI untuk bayi usia 6 bulan beserta contoh menu dan tips pemberian.',
      tagIds: [mpasiTag?.id, balitaTag?.id, kesehatanTag?.id].filter(Boolean),
    },
    {
      title: 'Memantau Tumbuh Kembang Anak dengan KMS',
      slug: 'memantau-tumbuh-kembang-anak-dengan-kms',
      content: `<h2>Apa itu KMS?</h2>
<p>Kartu Menuju Sehat (KMS) adalah kartu yang memuat grafik pertumbuhan anak berdasarkan umur dan berat badan. KMS digunakan untuk memantau pertumbuhan anak setiap bulan di Posyandu.</p>
<h3>Cara Membaca KMS</h3>
<p>KMS memiliki beberapa zona warna yang menunjukkan status pertumbuhan anak:</p>
<ul>
<li><strong>Zona Hijau:</strong> Pertumbuhan normal</li>
<li><strong>Zona Kuning:</strong> Perlu perhatian khusus</li>
<li><strong>Di Bawah Garis Merah:</strong> Perlu penanganan segera</li>
</ul>
<h3>Kapan Harus ke Posyandu?</h3>
<p>Bawa anak ke Posyandu setiap bulan untuk ditimbang dan dicatat perkembangannya. Hal ini penting untuk deteksi dini masalah pertumbuhan dan gizi anak.</p>`,
      excerpt: 'KMS merupakan alat penting untuk memantau tumbuh kembang anak. Pelajari cara membaca dan memahami KMS.',
      status: 'PUBLISHED',
      publishDate: new Date(),
      categoryId: kesehatanAnak?.id,
      authorId: admin.id,
      seoTitle: 'Memantau Tumbuh Kembang Anak dengan KMS | Posyandu Melati',
      seoDescription: 'Pelajari cara menggunakan Kartu Menuju Sehat (KMS) untuk memantau tumbuh kembang anak di Posyandu.',
      tagIds: [tumbuhKembangTag?.id, balitaTag?.id, kesehatanTag?.id].filter(Boolean),
    },
  ];

  for (const article of articles) {
    const { tagIds, ...articleData } = article;
    const existing = await prisma.article.findUnique({
      where: { slug: article.slug },
    });
    if (!existing) {
      const created = await prisma.article.create({ data: articleData });
      // Connect tags
      if (tagIds && tagIds.length > 0) {
        for (const tagId of tagIds) {
          await prisma.articleTag.create({
            data: { articleId: created.id, tagId },
          });
        }
      }
    }
  }
  console.log(`✅ ${articles.length} sample articles created`);

  // ========================
  // 8. Create Website Settings
  // ========================
  const settings = [
    { key: 'site_name', value: 'Posyandu Melati' },
    { key: 'site_description', value: 'Pos Pelayanan Terpadu (Posyandu) Melati melayani kesehatan ibu, bayi, dan balita di wilayah RW 05.' },
    { key: 'site_logo', value: '' },
    { key: 'address', value: 'Jl. Melati No. 10, RT 03/RW 05, Kelurahan Sukamaju, Kecamatan Sehat Sejahtera' },
    { key: 'phone', value: '(021) 1234-5678' },
    { key: 'email', value: 'posyandumelati@gmail.com' },
    { key: 'whatsapp', value: '6281234567890' },
    { key: 'operating_hours', value: 'Setiap Selasa, 08:00 - 12:00 WIB' },
    { key: 'google_maps_embed', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2!2d106.8!3d-6.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMDAuMCJTIDEwNsKwNDgnMDAuMCJF!5e0!3m2!1sid!2sid!4v1234567890' },
    { key: 'facebook', value: 'https://facebook.com/posyandumelati' },
    { key: 'instagram', value: 'https://instagram.com/posyandumelati' },
    { key: 'tiktok', value: '' },
    { key: 'youtube', value: '' },
    { key: 'footer_text', value: '© 2026 Posyandu Melati. Seluruh hak cipta dilindungi.' },
    { key: 'vision', value: 'Menjadi Posyandu terdepan dalam pelayanan kesehatan ibu dan anak yang berkualitas, terjangkau, dan berbasis masyarakat.' },
    { key: 'mission', value: 'Memberikan pelayanan kesehatan dasar yang berkualitas bagi ibu, bayi, dan balita.\nMeningkatkan pengetahuan masyarakat tentang kesehatan melalui penyuluhan rutin.\nMendorong partisipasi aktif masyarakat dalam kegiatan kesehatan.\nMelakukan deteksi dini gangguan pertumbuhan dan gizi pada anak.\nMembangun kerjasama dengan puskesmas dan instansi terkait.' },
    { key: 'history', value: 'Posyandu Melati berdiri sejak tahun 2005 atas inisiatif ibu-ibu PKK dan kader kesehatan di wilayah RW 05. Awalnya kegiatan dilakukan secara sederhana di halaman rumah warga, kemudian berkembang menjadi pos pelayanan tetap yang melayani lebih dari 200 balita dan ibu hamil setiap bulannya. Dengan dukungan Puskesmas setempat dan partisipasi aktif masyarakat, Posyandu Melati terus meningkatkan kualitas layanan kesehatan untuk mewujudkan generasi sehat dan cerdas.' },
    { key: 'goals', value: 'Menurunkan angka kematian bayi dan balita di wilayah kerja.\nMeningkatkan status gizi balita melalui pemantauan pertumbuhan rutin.\nMencapai cakupan imunisasi dasar lengkap 100%.\nMeningkatkan kesadaran masyarakat tentang pentingnya kesehatan ibu dan anak.' },
  ];

  for (const setting of settings) {
    await prisma.websiteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log(`✅ ${settings.length} website settings created`);

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📋 Login credentials:');
  console.log('   Admin: admin@posyandu.id / admin123');
  console.log('   Kader: kader@posyandu.id / kader123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
