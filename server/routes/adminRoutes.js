const express = require('express');
const { login } = require('../controllers/adminController');

const router = express.Router();

// Admin login route
router.post('/login', login);

module.exports = router;


