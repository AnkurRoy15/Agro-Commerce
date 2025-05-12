const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://agro-admin:ankur990@cluster0.fgo6ymp.mongodb.net/agrocommerce/banners?retryWrites=true&w=majority'; // update if needed
const client = new MongoClient(uri);

const bannerImages = [
  'veg1.png',
  'veg2.png',
  'fruit1.png',
  'grain1.png'
]; // Add all your image names

async function insertBanners() {
  try {
    await client.connect();
    const db = client.db('agrocommerce');
    const banners = db.collection('banners');

    const bannerDocs = bannerImages.map((filename, index) => ({
      title: `banner${index + 1}`,
      image_url: `/uploads/${filename}`,  // relative path for frontend
      target_url: '/agrocommerce/banners',
      is_active: true,
      created_at: new Date()
    }));

    const result = await banners.insertMany(bannerDocs);
    console.log(`Inserted ${result.insertedCount} banners.`);
  } finally {
    await client.close();
  }
}

insertBanners().catch(console.dir);
