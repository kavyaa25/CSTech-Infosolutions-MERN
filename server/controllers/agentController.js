const Agent = require('../models/Agent');

/**
 * Create a new agent
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const createAgent = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Validate input
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if agent already exists
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({ message: 'Agent with this email already exists' });
    }

    // Create new agent
    const agent = new Agent({
      name,
      email,
      mobile,
      password
    });

    await agent.save();

    res.status(201).json({
      message: 'Agent created successfully',
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        mobile: agent.mobile
      }
    });
  } catch (error) {
    console.error('Create agent error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors 
      });
    }
    
    res.status(500).json({ message: 'Server error while creating agent' });
  }
};

/**
 * Get all agents
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find().select('-password');
    res.json({ agents });
  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({ message: 'Server error while fetching agents' });
  }
};

/**
 * Update agent
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const updateAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobile, password } = req.body;

    const agent = await Agent.findById(id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    // Update fields
    if (name) agent.name = name;
    if (email) agent.email = email;
    if (mobile) agent.mobile = mobile;
    if (password) agent.password = password;

    await agent.save();

    res.json({
      message: 'Agent updated successfully',
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        mobile: agent.mobile
      }
    });
  } catch (error) {
    console.error('Update agent error:', error);
    res.status(500).json({ message: 'Server error while updating agent' });
  }
};

/**
 * Delete agent
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;

    const agent = await Agent.findById(id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    await Agent.findByIdAndDelete(id);

    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    console.error('Delete agent error:', error);
    res.status(500).json({ message: 'Server error while deleting agent' });
  }
};

module.exports = {
  createAgent,
  getAllAgents,
  updateAgent,
  deleteAgent
};
