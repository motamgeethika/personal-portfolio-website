const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const contactController = require('../controllers/contactController');

// Project Routes
router.get('/projects', projectController.getAllProjects);
router.get('/projects/:id', projectController.getProjectById);
router.post('/projects', projectController.createProject);
router.put('/projects/:id', projectController.updateProject);
router.delete('/projects/:id', projectController.deleteProject);
router.get('/stats', projectController.getStats);

// Contact Message Routes
router.post('/contact', contactController.submitContact);
router.get('/contact', contactController.getMessages);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'SQLite'
  });
});

module.exports = router;
