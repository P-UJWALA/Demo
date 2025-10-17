const mongoose = require('mongoose');

const fishBatchSchema = new mongoose.Schema({
  batchId: { type: String, required: true, unique: true }, // e.g. UUID or contract id
  producer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productType: String,
  weightKg: Number,
  harvestDate: Date,
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  offchainData: {
    images: [String], // URLs or IPFS hashes
    certificate: String,
    notes: String
  },
  currentOwner: { type: String }, // address or role id
  txHashes: [String], // blockchain txs for audit
  status: { type: String, default: 'harvested' }, // harvested, in-transit, market, retail, sold
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FishBatch', fishBatchSchema);
