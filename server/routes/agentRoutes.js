const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  createAgent,
  getAllAgents,
  updateAgent,
  deleteAgent
} = require('../controllers/agentController');

const router = express.Router();

// All agent routes are protected
router.use(authMiddleware);

// Create agent
router.post('/add', createAgent);

// Get all agents
router.get('/', getAllAgents);

// Update agent
router.put('/:id', updateAgent);

// Delete agent
router.delete('/:id', deleteAgent);

module.exports = router;


