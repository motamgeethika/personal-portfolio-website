require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api', apiRoutes);

// Fallback route for SPA or root
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Portfolio Server running at http://localhost:${PORT}`);
  console.log(`📁 Static files served from /public`);
  console.log(`📡 REST API available at http://localhost:${PORT}/api`);
  console.log(`===============================================`);
});

module.exports = app;
