const mongoose = require('mongoose'); 
const Flat = require('../models/flatmodule');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const flats = [];

// Generating 30 documents: 3 blocks (A, B, C) x 5 floors x 2 flats per floor
const blocks = ['A', 'B', 'C'];
for (const block of blocks) {
  for (let floor = 1; floor <= 5; floor++) {
    for (let num = 1; num <= 2; num++) {
      flats.push({
        flatNumber: floor * 100 + num, // e.g., 101, 102, 201...
        block: block,
        floor: floor,
      });
    }
  }
}

const seedFlats = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB Connected Successfully for flats seeding');

    // Optional: Clear existing flats before seeding
    await Flat.deleteMany({});
    console.log('Existing flats cleared');

    const newFlats = await Flat.insertMany(flats);
    console.log(`Successfully seeded ${newFlats.length} flats.`);
  } catch (error) {
    console.error('Error seeding flats:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedFlats();