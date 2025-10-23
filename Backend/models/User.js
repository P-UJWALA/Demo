const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['producer','market','retail','consumer','admin'], default: 'producer' },
  blockchainAddress: { type: String }, // ADD: User's blockchain wallet address
  privateKey: { type: String },        // ADD: User's private key (encrypt in production!)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);