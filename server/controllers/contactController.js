const db = require('../config/db');

// POST /api/contact - Handle contact form submission
exports.submitContact = (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'Please provide name, email, and message.'
    });
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid email address.'
    });
  }

  const query = `
    INSERT INTO contact_messages (name, email, subject, message)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [name.trim(), email.trim(), (subject || 'General Inquiry').trim(), message.trim()], function (err) {
    if (err) {
      console.error('Error saving contact message:', err.message);
      return res.status(500).json({
        success: false,
        error: 'Failed to record message in database.'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received and saved.',
      data: {
        id: this.lastID,
        name,
        email,
        subject: subject || 'General Inquiry'
      }
    });
  });
};

// GET /api/contact - Retrieve all contact messages (Admin/Inspection)
exports.getMessages = (req, res) => {
  db.all('SELECT * FROM contact_messages ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, count: rows.length, data: rows });
  });
};
