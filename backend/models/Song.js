const mongoose = require('mongoose');

const songSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: false },
    title: { type: String, default: 'Untitled' },
    lyrics: { type: String, default: '' },
    beatUrl: { type: String, default: null },
    beatPublicId: { type: String, default: null },
    recordingUrl: { type: String, default: null },
    recordingPublicId: { type: String, default: null },
    status: { type: String, enum: ['public', 'private'], default: 'private' },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

module.exports = mongoose.model('Song', songSchema);

