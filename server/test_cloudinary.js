const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve('d:\\document\\kkn\\web-posyandu\\server\\.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function checkCloudinary() {
  try {
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary Connection OK:', result);
    return true;
  } catch (error) {
    console.error('❌ Cloudinary Connection Error:', error);
    return false;
  }
}

checkCloudinary();
