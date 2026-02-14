require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'ai4ap';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let db;

MongoClient.connect(MONGO_URL).then(client => {
  db = client.db(DB_NAME);
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection failed:', err.message);
  process.exit(1);
});

// POST /api/contact — insert form data
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, linkedin } = req.body;

  if (!name || !email || !phone || !linkedin) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    await db.collection('contacts').insertOne({
      name,
      email,
      phone,
      linkedin,
      createdAt: new Date(),
    });
    res.json({ success: true });
  } catch (err) {
    console.error('DB insert error:', err.message);
    res.status(500).json({ error: 'Failed to save. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
