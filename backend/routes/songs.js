const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const Song = require('../models/Song');

const router = express.Router();

// Multer memory storage for direct Cloudinary upload
const upload = multer({ storage: multer.memoryStorage() });

function tryGetUserId(req) {
  if (req.user?.id) return req.user.id;
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    return decoded.sub || null;
  } catch {
    return null;
  }
}

function uploadToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'video' },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    );
    stream.end(buffer);
  });
}

// List songs (scoped by user if token present)
router.get('/songs', async (req, res) => {
  const userId = tryGetUserId(req);
  const query = userId ? { userId } : {};
  const list = await Song.find(query).sort({ updatedAt: -1, createdAt: -1 }).lean();
  res.json(list);
});

// List public songs
router.get('/songs/public', async (req, res) => {
  const list = await Song.find({ status: 'public' }).populate('userId', 'name').sort({ updatedAt: -1, createdAt: -1 }).lean();
  res.json(list);
});

// Create song
router.post('/songs', async (req, res) => {
  const userId = tryGetUserId(req);
  const { title = 'Untitled', lyrics = '', beatUrl = null, recordingUrl = null, beatPublicId = null, recordingPublicId = null, status = 'private' } = req.body || {};
  const created = await Song.create({ title, lyrics, beatUrl, recordingUrl, beatPublicId, recordingPublicId, userId, status });
  res.status(201).json(created);
});

// Read song
router.get('/songs/:id', async (req, res) => {
  const song = await Song.findById(req.params.id).lean();
  if (!song) return res.status(404).json({ error: 'Not found' });
  return res.json(song);
});

// Update song
router.put('/songs/:id', async (req, res) => {
  const existing = await Song.findById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  const { title, lyrics, beatUrl, recordingUrl, beatPublicId, recordingPublicId, status } = req.body || {};

  // If clearing beat or recording, delete from Cloudinary
  if (beatUrl === null && existing.beatPublicId) {
    try { await cloudinary.uploader.destroy(existing.beatPublicId, { resource_type: 'video' }); } catch {}
    existing.beatUrl = null;
    existing.beatPublicId = null;
  }
  if (recordingUrl === null && existing.recordingPublicId) {
    try { await cloudinary.uploader.destroy(existing.recordingPublicId, { resource_type: 'video' }); } catch {}
    existing.recordingUrl = null;
    existing.recordingPublicId = null;
  }

  if (typeof title !== 'undefined') existing.title = title;
  if (typeof lyrics !== 'undefined') existing.lyrics = lyrics;
  if (typeof beatUrl === 'string') existing.beatUrl = beatUrl;
  if (typeof recordingUrl === 'string') existing.recordingUrl = recordingUrl;
  if (typeof beatPublicId === 'string') existing.beatPublicId = beatPublicId;
  if (typeof recordingPublicId === 'string') existing.recordingPublicId = recordingPublicId;
  if (typeof status === 'string') existing.status = status;

  await existing.save();
  return res.json(existing);
});

// Delete song
router.delete('/songs/:id', async (req, res) => {
  const existing = await Song.findById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  try {
    if (existing.beatPublicId) await cloudinary.uploader.destroy(existing.beatPublicId, { resource_type: 'video' });
    if (existing.recordingPublicId) await cloudinary.uploader.destroy(existing.recordingPublicId, { resource_type: 'video' });
  } catch {}
  await existing.deleteOne();
  res.status(204).end();
});

// Uploads
router.post('/upload/beat', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  try {
    const result = await uploadToCloudinary(req.file.buffer, 'trackstack/beats');
    return res.status(201).json({ url: result.secure_url, publicId: result.public_id });
  } catch (e) {
    return res.status(500).json({ error: 'Upload failed' });
  }
});

router.post('/upload/recording', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  try {
    const result = await uploadToCloudinary(req.file.buffer, 'trackstack/recordings');
    return res.status(201).json({ url: result.secure_url, publicId: result.public_id });
  } catch (e) {
    return res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;

