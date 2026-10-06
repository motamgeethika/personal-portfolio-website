# Full-Stack Personal Portfolio Website

A modern, production-ready, full-stack personal portfolio website engineered with a clean decoupled architecture: **Node.js + Express REST API**, **SQLite Database** (with support for PostgreSQL/MongoDB), and a **Vanilla HTML5/CSS3/JavaScript frontend** enhanced with dark/light theming, responsive glassmorphic aesthetics, and dynamic database CRUD operations.

---

## 🌟 Highlights & Key Features

- **Frontend**:
  - Responsive, modern UI inspired by the popular *GreatStack* tutorial and elevated with 2026 aesthetics.
  - Interactive multi-tab about section (*Skills*, *Experience & Timeline*, *Education*, *Certifications*).
  - Dynamic Projects showcase with category filtering (*Full Stack*, *Frontend*, *Backend/API*, *AI/ML*) and instant real-time search.
  - Interactive "+ Add Project" modal to add new projects directly to the SQLite database without restarting the server.
  - Delete project capability directly from the UI to demonstrate full CRUD.
  - Built-in Dark / Light theme switcher with `localStorage` persistence.
  - Real-time Contact Form with input validation, animated loading indicators, and instant database submission.
  - Toast notification system for feedback.

- **Backend (Node.js & Express)**:
  - Clean modular MVC architecture (`config`, `controllers`, `routes`).
  - RESTful API endpoints for projects management and contact inquiry collection.
  - Cross-Origin Resource Sharing (CORS) and URL-encoded body parser enabled.
  - Static asset serving for production deployment.

- **Database (SQLite with Auto-Seeding)**:
  - Zero-configuration embedded SQLite database (`database.sqlite`).
  - Automatic table creation and initial seed data upon first startup.
  - Stores all project information (titles, descriptions, tags, live URLs, GitHub repos, and categories) and incoming contact messages.

- **Deployment Ready**:
  - Pre-configured `vercel.json` for Vercel deployment.
  - Pre-configured `Procfile` for Heroku, Railway, or Render.
  - Ready for Netlify (frontend static + serverless functions or proxy).

---

## 📁 Project Architecture

```
personl portfolio website/
├── .env                  # Environment variables
├── .env.example          # Environment sample template
├── .gitignore            # Git ignore rules
├── package.json          # Node.js project manifest & scripts
├── Procfile              # Heroku / Render process runner
├── vercel.json           # Vercel deployment configuration
├── README.md             # Project documentation
├── public/               # Frontend Client
│   ├── index.html        # Semantic HTML5 single-page application
│   ├── css/
│   │   └── style.css     # Modern vanilla CSS design tokens & animations
│   ├── js/
│   │   └── main.js       # Client API fetch, filters, modals, and events
│   └── images/           # Asset images and avatars
└── server/               # Backend Server
    ├── server.js         # Express app entrypoint & middleware
    ├── config/
    │   └── db.js         # SQLite database connection & auto-seeding
    ├── controllers/
    │   ├── projectController.js  # CRUD controller for projects
    │   └── contactController.js  # Controller for contact messages
    └── routes/
        └── api.js        # API route definitions
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
Ensure you have **Node.js** (v18+ recommended) and **npm** installed on your machine.
Check versions:
```bash
node -v
npm -v
```

### 2. Install Dependencies
Dependencies are already configured. If needed:
```bash
npm install
```

### 3. Run the Development Server
To launch the full-stack server:
```bash
npm start
```
or with automatic file reload:
```bash
npm run dev
```

### 4. Open in Browser
Navigate to:
```
http://localhost:3000
```
- Frontend: `http://localhost:3000`
- REST API Root: `http://localhost:3000/api`
- Health Check: `http://localhost:3000/api/health`

---

## 📡 REST API Documentation

### 🔹 Projects API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/projects` | Fetch all projects (Supports `?category=Frontend` and `?search=query`) |
| `GET` | `/api/projects/:id` | Fetch a single project by ID |
| `POST` | `/api/projects` | Create a new project (JSON body: `title`, `description`, `category`, `tags`, `image_url`, `github_url`, `live_url`, `featured`) |
| `PUT` | `/api/projects/:id` | Update an existing project |
| `DELETE` | `/api/projects/:id` | Delete a project by ID |
| `GET` | `/api/stats` | Returns aggregate statistics (total projects, categories, messages) |

#### Example: Add a Project (`POST /api/projects`)
```json
{
  "title": "CloudPulse Monitor",
  "category": "Full Stack",
  "description": "Real-time Kubernetes cluster monitoring agent with Grafana visualizer.",
  "tags": "Node.js, Express, Docker, SQLite",
  "image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
  "github_url": "https://github.com/geethika/cloudpulse",
  "live_url": "https://cloudpulse.vercel.app",
  "featured": 1
}
```

### 🔹 Contact Inquiries API

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/contact` | Submit a contact form message (Saved to database) |
| `GET` | `/api/contact` | List all submitted messages (Admin/inspection endpoint) |

#### Example: Submit Contact Inquiry (`POST /api/contact`)
```json
{
  "name": "Sarah Connor",
  "email": "sarah@example.com",
  "subject": "Full-Stack Opportunity",
  "message": "Hi Geethika, we loved your portfolio and would like to schedule an interview."
}
```

---

## 🌐 Deployment Instructions

### Option 1: Deploy on Vercel
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Run in project directory:
   ```bash
   vercel
   ```
3. Follow the prompts. The included [vercel.json](file:///c:/Users/Motam%20Geethika/OneDrive/Desktop/New%20folder/personl%20portfolio%20website/vercel.json) handles routing both the static `/public` frontend and the serverless `/api` backend.

### Option 2: Deploy on Render / Railway / Heroku
1. Push code to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   git push origin main
   ```
2. On **Render.com** (or **Railway.app**):
   - Choose **New Web Service** and select your GitHub repo.
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Render automatically provisions the environment and sets `PORT`.

### Option 3: Deploy on Netlify
- For static hosting, link repository and set publish directory to `public`.
- If deploying the backend separately, set the API base URL in `public/js/main.js`.

---

## 📄 License
ISC License © 2026 Motam Geethika.
