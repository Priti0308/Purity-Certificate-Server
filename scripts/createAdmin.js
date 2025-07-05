const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const existing = await Admin.findOne({ username: 'admin' });

    if (existing) {
      console.log('⚠️ Admin already exists.');
      return mongoose.disconnect();
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = new Admin({
      username: 'admin',
      password: hashedPassword,
    });

    await admin.save();
    console.log('✅ Admin created successfully.');
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('❌ Error:', err.message);
  });
