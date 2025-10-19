const multer = require('multer');
const csv = require('csv-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const Agent = require('../models/Agent');
const ListItem = require('../models/ListItem');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.csv', '.xlsx', '.xls'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV, XLSX, and XLS files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

/**
 * Parse CSV file
 * @param {string} filePath - Path to CSV file
 * @returns {Promise<Array>} Parsed data
 */
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
};

/**
 * Parse Excel file
 * @param {string} filePath - Path to Excel file
 * @returns {Array} Parsed data
 */
const parseExcel = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet);
};

/**
 * Validate CSV data
 * @param {Array} data - Parsed data
 * @returns {object} Validation result
 */
const validateData = (data) => {
  if (!data || data.length === 0) {
    return { valid: false, message: 'File is empty' };
  }

  const requiredFields = ['FirstName', 'Phone', 'Notes'];
  const firstRow = data[0];
  
  for (const field of requiredFields) {
    if (!(field in firstRow)) {
      return { valid: false, message: `Missing required field: ${field}` };
    }
  }

  // Validate phone numbers
  for (let i = 0; i < data.length; i++) {
    const phone = data[i].Phone;
    if (!phone || !/^\d+$/.test(phone.toString())) {
      return { valid: false, message: `Invalid phone number at row ${i + 1}` };
    }
  }

  return { valid: true };
};

/**
 * Distribute items among agents
 * @param {Array} items - Items to distribute
 * @param {Array} agents - Available agents
 * @returns {Array} Distributed items
 */
const distributeItems = (items, agents) => {
  if (agents.length === 0) {
    throw new Error('No agents available for distribution');
  }

  const distributedItems = [];
  const itemsPerAgent = Math.floor(items.length / agents.length);
  const remainingItems = items.length % agents.length;

  let itemIndex = 0;

  for (let i = 0; i < agents.length; i++) {
    const agent = agents[i];
    const itemsForThisAgent = itemsPerAgent + (i < remainingItems ? 1 : 0);

    for (let j = 0; j < itemsForThisAgent; j++) {
      if (itemIndex < items.length) {
        const item = items[itemIndex];
        distributedItems.push({
          firstName: item.FirstName,
          phone: item.Phone,
          notes: item.Notes || '',
          assignedTo: agent._id
        });
        itemIndex++;
      }
    }
  }

  return distributedItems;
};

/**
 * Upload and distribute CSV file
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const uploadAndDistribute = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    
    let parsedData;
    
    // Parse file based on extension
    if (fileExt === '.csv') {
      parsedData = await parseCSV(filePath);
    } else if (fileExt === '.xlsx' || fileExt === '.xls') {
      parsedData = parseExcel(filePath);
    }

    // Validate data
    const validation = validateData(parsedData);
    if (!validation.valid) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: validation.message });
    }

    // Get all agents
    const agents = await Agent.find();
    if (agents.length === 0) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'No agents available for distribution' });
    }

    // Ensure we have at least 5 agents for proper distribution
    if (agents.length < 5) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({ 
        message: `Please add at least 5 agents before uploading. Currently you have ${agents.length} agents.` 
      });
    }

    // Use exactly 5 agents for distribution (as per requirements)
    const agentsForDistribution = agents.slice(0, 5);
    
    // Distribute items
    const distributedItems = distributeItems(parsedData, agentsForDistribution);

    // Save to database
    const savedItems = await ListItem.insertMany(distributedItems);

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    // Group items by agent for response
    const agentItems = {};
    agentsForDistribution.forEach(agent => {
      agentItems[agent._id] = {
        agent: {
          id: agent._id,
          name: agent.name,
          email: agent.email,
          mobile: agent.mobile
        },
        items: []
      };
    });

    savedItems.forEach(item => {
      agentItems[item.assignedTo].items.push({
        id: item._id,
        firstName: item.firstName,
        phone: item.phone,
        notes: item.notes
      });
    });

    res.json({
      message: 'File uploaded and distributed successfully',
      distribution: Object.values(agentItems),
      totalItems: savedItems.length
    });

  } catch (error) {
    console.error('Upload error:', error);
    console.error('Error stack:', error.stack);
    
    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      message: 'Server error during file upload and distribution',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Get distributed lists for all agents
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getDistributedLists = async (req, res) => {
  try {
    const agents = await Agent.find();
    const agentItems = {};

    // Initialize agent items structure
    agents.forEach(agent => {
      agentItems[agent._id] = {
        agent: {
          id: agent._id,
          name: agent.name,
          email: agent.email,
          mobile: agent.mobile
        },
        items: []
      };
    });

    // Get all list items with agent information
    const listItems = await ListItem.find().populate('assignedTo', 'name email mobile');

    // Group items by agent
    listItems.forEach(item => {
      if (item.assignedTo && item.assignedTo._id && agentItems[item.assignedTo._id]) {
        agentItems[item.assignedTo._id].items.push({
          id: item._id,
          firstName: item.firstName,
          phone: item.phone,
          notes: item.notes
        });
      }
    });

    res.json({
      distribution: Object.values(agentItems),
      totalItems: listItems.length
    });

  } catch (error) {
    console.error('Get distributed lists error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error while fetching distributed lists',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Delete a specific list item
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const deleteListItem = async (req, res) => {
  try {
    const { id } = req.params;

    const listItem = await ListItem.findById(id);
    if (!listItem) {
      return res.status(404).json({ message: 'List item not found' });
    }

    await ListItem.findByIdAndDelete(id);

    res.json({ message: 'List item deleted successfully' });

  } catch (error) {
    console.error('Delete list item error:', error);
    res.status(500).json({ message: 'Server error while deleting list item' });
  }
};

module.exports = {
  upload,
  uploadAndDistribute,
  getDistributedLists,
  deleteListItem
};
