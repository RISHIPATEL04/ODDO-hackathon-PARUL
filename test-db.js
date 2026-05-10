import mongoose from 'mongoose';

async function test() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/traveloop');
    console.log('Connected successfully!');
    process.exit(0);
  } catch(e) {
    console.error('Connection failed:', e.message);
    process.exit(1);
  }
}

test();
