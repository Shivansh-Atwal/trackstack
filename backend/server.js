require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

const app = express();
const port = process.env.PORT || 8080;

// Config: Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Config: MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/trackstack';
mongoose
  .connect(mongoUri, { autoIndex: true })
  .then(() => console.log('MongoDB connected'))
  .catch((e) => console.error('MongoDB connection error', e));


const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '10mb' }));

const songsRouter = require('./routes/songs');


const authRouter = require('./routes/auth');


app.get('/api/health', (_, res) => res.json({ ok: true }));

app.use('/api/auth', authRouter);
app.use('/api', songsRouter);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});