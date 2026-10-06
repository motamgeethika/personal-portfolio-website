const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    initDb();
  }
});

function initDb() {
  db.serialize(() => {
    // Projects table
    db.run(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'Full Stack',
        tags TEXT NOT NULL,
        image_url TEXT NOT NULL,
        github_url TEXT,
        live_url TEXT,
        featured INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Contact Messages table
    db.run(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Reset and seed projects with Geethika's authentic work
    db.run(`DELETE FROM projects`, (err) => {
      if (err) {
        console.error('Error resetting projects:', err);
        return;
      }

      console.log('Seeding portfolio with Motam Geethika genuine projects...');
      const authenticProjects = [
        {
          title: 'Full-Stack Web Platform - Thiranex Internship',
          description: 'Production-ready full-stack web application engineered during my Full Stack Development Internship at Thiranex, featuring RESTful API routing, SQLite database persistence, and responsive UI architecture.',
          category: 'Full Stack',
          tags: 'Node.js, Express.js, SQLite, REST API, JavaScript, HTML5/CSS3',
          image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60',
          github_url: 'https://github.com',
          live_url: 'http://localhost:3000',
          featured: 1
        },
        {
          title: 'Deloitte Forensic Data Analytics Simulation',
          description: 'Actionable data analysis and forensic technology exploration completed with Deloitte via Forage, uncovering operational patterns and evaluating risk data with structured analytical methodologies.',
          category: 'AI/ML',
          tags: 'Data Analysis, Forensic Technology, Python, Business Intelligence',
          image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
          github_url: 'https://github.com',
          live_url: 'https://www.linkedin.com/in/motam-geethika-941120377',
          featured: 1
        },
        {
          title: 'AWS Cloud & Machine Learning Foundations App',
          description: 'Cloud computing exploration integrating core concepts from AWS Foundations: Machine Learning Basics, focusing on model concepts, data processing, and cloud deployment pipelines.',
          category: 'AI/ML',
          tags: 'AWS Cloud, Machine Learning, Python, Cloud Computing',
          image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
          github_url: 'https://github.com',
          live_url: 'https://www.linkedin.com/in/motam-geethika-941120377',
          featured: 1
        },
        {
          title: 'Personal Portfolio & Database Management System',
          description: 'Complete full-stack personal portfolio application built with Node.js, Express, and SQLite. Features real-time contact logging, live database project filtering, and theme switching.',
          category: 'Full Stack',
          tags: 'Node.js, Express, SQLite, Vanilla JS, CSS3 Variables',
          image_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=60',
          github_url: 'https://github.com',
          live_url: 'http://localhost:3000',
          featured: 0
        },
        {
          title: 'AI Pioneers Machine Learning Internship — YuvaIntern',
          description: 'Actively completing a 12-week Machine Learning internship at YuvaIntern (Henry Harvin Education / NSDC), building and deploying ML models using Python, Scikit-learn, and TensorFlow. Covering supervised & unsupervised learning, feature engineering, model evaluation, and deployment fundamentals with real-world datasets.',
          category: 'AI/ML',
          tags: 'Python, Scikit-learn, TensorFlow, NumPy, Pandas, ML Models, Data Preprocessing',
          image_url: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&auto=format&fit=crop&q=60',
          github_url: 'https://github.com',
          live_url: 'https://www.linkedin.com/in/motam-geethika-941120377',
          featured: 1
        },
        {
          title: 'AI & Emerging Technology Knowledge Showcase',
          description: 'Interactive technology explorer based on insights gained from the CampusUnite AI & Technology Challenge 2026, highlighting modern generative systems and intelligent automation.',
          category: 'Frontend',
          tags: 'JavaScript, Emerging Tech, AI Concepts, Responsive Design',
          image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60',
          github_url: 'https://github.com',
          live_url: 'https://www.linkedin.com/in/motam-geethika-941120377',
          featured: 0
        }
      ];

      const stmt = db.prepare(`
        INSERT INTO projects (title, description, category, tags, image_url, github_url, live_url, featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      authenticProjects.forEach((proj) => {
        stmt.run(
          proj.title,
          proj.description,
          proj.category,
          proj.tags,
          proj.image_url,
          proj.github_url,
          proj.live_url,
          proj.featured
        );
      });

      stmt.finalize();
      console.log('Seeded authentic projects successfully.');
    });
  });
}

module.exports = db;
