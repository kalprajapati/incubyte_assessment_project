const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

router.use('/auth', authRoutes);

module.exports = router;
