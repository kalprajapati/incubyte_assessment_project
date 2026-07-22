const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

module.exports = router;
