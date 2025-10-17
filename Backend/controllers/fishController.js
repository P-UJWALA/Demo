const FishBatch = require('../models/FishBatch');
const { registerBatchOnChain, transferOwnershipOnChain, getBatchDetailsOnChain } = require('../utils/web3');
const fs = require('fs');
const path = require('path');
const QR = require('qrcode');

// placeholder: a function to upload files to IPFS/pinata and return hashes/urls.
// For now it returns local file paths. Replace with IPFS client later.
const uploadFiles = async (files) => {
  if (!files) return [];
  return files.map(f => `/uploads/${path.basename(f.path)}`);
};

exports.registerBatch = async (req, res) => {
  try {
    const { batchId, productType, weightKg, harvestDate, location } = req.body;
    if (!batchId) return res.status(400).json({ message: 'batchId required' });

    // handle files
    const filePaths = await uploadFiles(req.files);

    // create DB entry
    const batch = await FishBatch.create({
      batchId,
      producer: req.user._id,
      productType,
      weightKg,
      harvestDate,
      location: location ? JSON.parse(location) : undefined,
      offchainData: { images: filePaths }
    });

    // optional: store metadata on IPFS and then on-chain
    const metadataHash = 'Qm-placeholder'; // TODO: actually pin metadata to IPFS
    let receipt;
    try {
      receipt = await registerBatchOnChain(batchId, req.user._id.toString(), metadataHash);
      batch.txHashes.push(receipt.transactionHash || receipt.hash || JSON.stringify(receipt));
      await batch.save();
    } catch (err) {
      console.warn('Chain registration failed', err.message);
      // still return DB result but notify user chain tx failed
      return res.status(201).json({ batch, chainError: err.message });
    }

    res.status(201).json({ batch, tx: receipt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const updates = req.body;
    if (updates.location) updates.location = JSON.parse(updates.location);
    if (req.files && req.files.length) {
      const filePaths = await uploadFiles(req.files);
      updates['offchainData.images'] = (updates['offchainData.images'] || []).concat(filePaths);
    }
    const batch = await FishBatch.findOneAndUpdate({ batchId }, updates, { new: true });
    if (!batch) return res.status(404).json({ message: 'Batch not found' });
    res.json(batch);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.transferOwnership = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { newOwnerAddress } = req.body;
    if (!newOwnerAddress) return res.status(400).json({ message: 'newOwnerAddress required' });

    const receipt = await transferOwnershipOnChain(batchId, newOwnerAddress);
    const batch = await FishBatch.findOne({ batchId });
    if (batch) {
      batch.currentOwner = newOwnerAddress;
      batch.txHashes.push(receipt.transactionHash || receipt.hash || JSON.stringify(receipt));
      await batch.save();
    }
    res.json({ receipt, batch });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const batch = await FishBatch.findOne({ batchId }).populate('producer', 'name email role');
    if (!batch) return res.status(404).json({ message: 'Batch not found' });
    // get on-chain details too if desired
    let onchain = null;
    try {
      onchain = await getBatchDetailsOnChain(batchId);
    } catch (err) {
      // ignore chain errors, return DB data
    }
    res.json({ batch, onchain });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
