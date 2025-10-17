const QRCode = require('qrcode');

exports.generateQR = async (req, res) => {
  const { batchId } = req.params;
  if (!batchId) return res.status(400).json({ message: 'batchId required' });
  try {
    // QR encodes a URL to frontend trace page for this batch
    const url = `${process.env.FRONTEND_BASE_URL || 'http://localhost:3000'}/trace/${encodeURIComponent(batchId)}`;
    const qrDataUrl = await QRCode.toDataURL(url);
    res.json({ batchId, qr: qrDataUrl, url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
