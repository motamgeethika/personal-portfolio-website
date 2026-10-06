const db = require('../config/db');

// GET /api/projects - Get all projects with optional category filter
exports.getAllProjects = (req, res) => {
  const { category, search } = req.query;
  let query = 'SELECT * FROM projects WHERE 1=1';
  const params = [];

  if (category && category !== 'All') {
    query += ' AND category = ?';
    params.push(category);
  }

  if (search) {
    query += ' AND (title LIKE ? OR description LIKE ? OR tags LIKE ?)';
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  query += ' ORDER BY featured DESC, created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching projects:', err.message);
      return res.status(500).json({ success: false, error: 'Database error fetching projects.' });
    }
    res.json({ success: true, count: rows.length, data: rows });
  });
};

// GET /api/projects/:id - Get a single project
exports.getProjectById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM projects WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (!row) {
      return res.status(404).json({ success: false, error: 'Project not found.' });
    }
    res.json({ success: true, data: row });
  });
};

// POST /api/projects - Create a new project
exports.createProject = (req, res) => {
  const { title, description, category, tags, image_url, github_url, live_url, featured } = req.body;

  if (!title || !description) {
    return res.status(400).json({ success: false, error: 'Title and description are required.' });
  }

  const query = `
    INSERT INTO projects (title, description, category, tags, image_url, github_url, live_url, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const fallbackImage = image_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60';
  const isFeatured = featured ? 1 : 0;
  const projectCategory = category || 'Full Stack';
  const projectTags = tags || 'JavaScript, HTML5, CSS3';

  db.run(
    query,
    [title, description, projectCategory, projectTags, fallbackImage, github_url || '', live_url || '', isFeatured],
    function (err) {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      res.status(201).json({
        success: true,
        message: 'Project created successfully.',
        data: {
          id: this.lastID,
          title,
          description,
          category: projectCategory,
          tags: projectTags,
          image_url: fallbackImage,
          github_url,
          live_url,
          featured: isFeatured
        }
      });
    }
  );
};

// PUT /api/projects/:id - Update an existing project
exports.updateProject = (req, res) => {
  const { id } = req.params;
  const { title, description, category, tags, image_url, github_url, live_url, featured } = req.body;

  const query = `
    UPDATE projects
    SET title = COALESCE(?, title),
        description = COALESCE(?, description),
        category = COALESCE(?, category),
        tags = COALESCE(?, tags),
        image_url = COALESCE(?, image_url),
        github_url = COALESCE(?, github_url),
        live_url = COALESCE(?, live_url),
        featured = COALESCE(?, featured)
    WHERE id = ?
  `;

  db.run(
    query,
    [title, description, category, tags, image_url, github_url, live_url, featured, id],
    function (err) {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ success: false, error: 'Project not found.' });
      }
      res.json({ success: true, message: 'Project updated successfully.' });
    }
  );
};

// DELETE /api/projects/:id - Delete a project
exports.deleteProject = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM projects WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ success: false, error: 'Project not found.' });
    }
    res.json({ success: true, message: 'Project deleted successfully.' });
  });
};

// GET /api/stats - Portfolio statistics
exports.getStats = (req, res) => {
  db.all(
    `SELECT 
      (SELECT COUNT(*) FROM projects) as total_projects,
      (SELECT COUNT(*) FROM contact_messages) as total_messages,
      (SELECT COUNT(DISTINCT category) FROM projects) as total_categories`,
    (err, rows) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      res.json({ success: true, data: rows[0] });
    }
  );
};
