const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  upload,
  uploadAndDistribute,
  getDistributedLists,
  deleteListItem
} = require('../controllers/listController');

const router = express.Router();

// All list routes are protected
router.use(authMiddleware);

// Upload and distribute CSV file
router.post('/upload', upload.single('file'), uploadAndDistribute);

// Get distributed lists for all agents
router.get('/agents', getDistributedLists);

// Delete a specific list item
router.delete('/items/:id', deleteListItem);

module.exports = router;
