const express = require('express');
const router = express.Router();
const auth = require('./middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const {
  registerBatch,
  updateBatch,
  transferOwnership,
  getBatch
} = require('../controllers/fishController');

// register batch (with images)
router.post('/register', auth, upload.array('images', 5), registerBatch);
router.put('/:batchId', auth, upload.array('images', 5), updateBatch);
router.post('/:batchId/transfer', auth, transferOwnership);
router.get('/:batchId', getBatch);

module.exports = router;
