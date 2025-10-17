const express = require('express');
const router = express.Router();
const { generateQR } = require('../controllers/qrController');

router.get('/generate/:batchId', generateQR);

module.exports = router;
