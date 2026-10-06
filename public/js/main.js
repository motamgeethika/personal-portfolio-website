/**
 * Motam Geethika Portfolio — Core Frontend Logic
 * Typed animation, stats counter, skill bars, CRUD, theme toggle, navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global State
  let allProjects = [];
  let currentCategory = 'All';
  let searchQuery = '';

  // DOM Elements
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const themeToggle = document.getElementById('themeToggle');
  const projectsGrid = document.getElementById('projectsGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectSearchInput = document.getElementById('projectSearch');
  const contactForm = document.getElementById('contactForm');
  const contactStatus = document.getElementById('contactStatus');
  const addProjectModal = document.getElementById('addProjectModal');
  const openAddProjectBtn = document.getElementById('openAddProjectBtn');
  const closeAddProjectBtn = document.getElementById('closeAddProjectBtn');
  const addProjectForm = document.getElementById('addProjectForm');
  const toastContainer = document.getElementById('toastContainer');
  const currentYearSpan = document.getElementById('currentYear');

  // Set Current Year
  if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

  /* ==========================================================================
     Typed Text Animation
     ========================================================================== */
  const typedEl = document.getElementById('typedText');
  const typedPhrases = [
    'Full-Stack Web Apps',
    'RESTful APIs',
    'AI-Powered Systems',
    'Data-Driven Solutions',
    'Beautiful Interfaces',
    'Scalable Backends',
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeEffect() {
    if (!typedEl) return;
    const current = typedPhrases[phraseIndex];

    if (isDeleting) {
      typedEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typedEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 85;
    }

    if (!isDeleting && charIndex === current.length) {
      typingSpeed = 2000; // pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % typedPhrases.length;
      typingSpeed = 400;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  setTimeout(typeEffect, 500);

  /* ==========================================================================
     Theme Switcher
     ========================================================================== */
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle?.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    updateThemeIcon(newTheme);
    showToast(`Switched to ${newTheme} mode`, 'info');
  });

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if (icon) icon.className = theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  }

  /* ==========================================================================
     Navigation & Scrollspy
     ========================================================================== */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Scrollspy
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 130;
      const sectionId = section.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-link').forEach((l) => l.classList.remove('active'));
        matchingLink?.classList.add('active');
      }
    });
  });

  // Mobile Menu
  navToggle?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
    const icon = navToggle.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-xmark');
    }
  });

  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks?.classList.remove('open');
      const icon = navToggle?.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-xmark');
      }
    });
  });

  /* ==========================================================================
     Stats Counter Animation
     ========================================================================== */
  function animateCounter(el, target, suffix = '') {
    let count = 0;
    const duration = 1800;
    const step = Math.ceil(target / (duration / 30));

    const timer = setInterval(() => {
      count += step;
      if (count >= target) {
        count = target;
        clearInterval(timer);
      }
      el.textContent = count;
    }, 30);
  }

  // Use IntersectionObserver to trigger on scroll into view
  const statsSection = document.getElementById('stats');
  let statsAnimated = false;

  if (statsSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            document.querySelectorAll('.stats-number[data-target]').forEach((el) => {
              const target = parseInt(el.getAttribute('data-target'), 10);
              animateCounter(el, target);
            });
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(statsSection);
  }

  /* ==========================================================================
     Skill Bars Animation (triggered on About section view)
     ========================================================================== */
  let skillsAnimated = false;

  function animateSkillBars() {
    document.querySelectorAll('.skill-fill').forEach((bar) => {
      const width = bar.getAttribute('data-width');
      if (width) {
        bar.style.width = width + '%';
      }
    });
  }

  // Trigger bars when About section becomes visible, or when Skills tab is clicked
  const aboutSection = document.getElementById('about');
  if (aboutSection) {
    const aboutObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !skillsAnimated) {
            skillsAnimated = true;
            // small delay for visual effect
            setTimeout(animateSkillBars, 300);
          }
        });
      },
      { threshold: 0.1 }
    );
    aboutObserver.observe(aboutSection);
  }

  /* ==========================================================================
     About Section Interactive Tabs
     ========================================================================== */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      tabPanels.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
        // Re-animate skill bars if skills tab
        if (targetId === 'tab-skills') {
          setTimeout(animateSkillBars, 100);
        }
      }
    });
  });

  /* ==========================================================================
     Projects API Integration (CRUD & Filters)
     ========================================================================== */
  async function fetchProjects() {
    if (!projectsGrid) return;
    projectsGrid.innerHTML = `
      <div class="loading-indicator">
        <div class="spinner"></div>
        <p>Loading projects from database...</p>
      </div>
    `;

    try {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('API error');
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        allProjects = result.data;
        renderProjects();
      } else {
        throw new Error('Invalid response');
      }
    } catch (err) {
      console.warn('API fetch failed, using fallback data:', err.message);
      allProjects = getFallbackProjects();
      renderProjects();
    }
  }

  function renderProjects() {
    if (!projectsGrid) return;

    let filtered = allProjects.filter((proj) => {
      const matchCat = currentCategory === 'All' || proj.category.toLowerCase() === currentCategory.toLowerCase();
      const matchSearch =
        !searchQuery ||
        proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (proj.tags && proj.tags.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      projectsGrid.innerHTML = `
        <div class="loading-indicator" style="grid-column: 1 / -1;">
          <i class="fa-solid fa-folder-open" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
          <p>No projects found matching "${escapeHtml(searchQuery || currentCategory)}".</p>
        </div>
      `;
      return;
    }

    projectsGrid.innerHTML = filtered
      .map((proj) => {
        const tagsArray = proj.tags ? proj.tags.split(',').map((t) => t.trim()) : [];
        const fallbackImg = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60';
        const imgUrl = proj.image_url || fallbackImg;

        return `
        <article class="project-card" data-id="${proj.id}">
          <div class="project-image-box">
            <img src="${imgUrl}" alt="${escapeHtml(proj.title)}" loading="lazy" onerror="this.src='${fallbackImg}'">
            <span class="project-category-badge">${escapeHtml(proj.category)}</span>
            ${proj.featured ? '<span class="project-featured-badge"><i class="fa-solid fa-star"></i> Featured</span>' : ''}
          </div>
          <div class="project-body">
            <h4 class="project-title">${escapeHtml(proj.title)}</h4>
            <p class="project-description">${escapeHtml(proj.description)}</p>
            <div class="project-tags">
              ${tagsArray.map((tag) => `<span class="tag-item">${escapeHtml(tag)}</span>`).join('')}
            </div>
            <div class="project-footer">
              <div class="project-links">
                ${
                  proj.live_url
                    ? `<a href="${proj.live_url}" target="_blank" rel="noopener noreferrer" class="project-link-btn">
                        <i class="fa-solid fa-arrow-up-right-from-square"></i> Demo
                       </a>`
                    : ''
                }
                ${
                  proj.github_url
                    ? `<a href="${proj.github_url}" target="_blank" rel="noopener noreferrer" class="project-link-btn">
                        <i class="fa-brands fa-github"></i> Source
                       </a>`
                    : ''
                }
              </div>
              <div class="project-actions">
                <button class="btn-icon-action delete-proj-btn" data-id="${proj.id}" title="Delete Project">
                  <i class="fa-regular fa-trash-can"></i>
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
      })
      .join('');

    // Attach Delete handlers
    document.querySelectorAll('.delete-proj-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this project?')) {
          await deleteProject(id);
        }
      });
    });
  }

  async function deleteProject(id) {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Project deleted successfully!', 'success');
        allProjects = allProjects.filter((p) => p.id != id);
        renderProjects();
      } else {
        throw new Error(data.error || 'Failed to delete');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // Filter Buttons
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter');
      renderProjects();
    });
  });

  // Search
  projectSearchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    renderProjects();
  });

  /* ==========================================================================
     Add Project Modal
     ========================================================================== */
  openAddProjectBtn?.addEventListener('click', () => addProjectModal?.classList.add('active'));
  closeAddProjectBtn?.addEventListener('click', () => addProjectModal?.classList.remove('active'));

  addProjectModal?.addEventListener('click', (e) => {
    if (e.target === addProjectModal) addProjectModal.classList.remove('active');
  });

  addProjectForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = addProjectForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
    submitBtn.disabled = true;

    const newProject = {
      title: document.getElementById('projTitle').value,
      category: document.getElementById('projCategory').value,
      description: document.getElementById('projDesc').value,
      tags: document.getElementById('projTags').value,
      image_url: document.getElementById('projImage').value,
      github_url: document.getElementById('projGithub').value,
      live_url: document.getElementById('projDemo').value,
      featured: document.getElementById('projFeatured').checked ? 1 : 0
    };

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      });
      const data = await res.json();

      if (data.success) {
        showToast('Project added to database!', 'success');
        addProjectForm.reset();
        addProjectModal.classList.remove('active');
        fetchProjects();
      } else {
        throw new Error(data.error || 'Failed to save project');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });

  /* ==========================================================================
     Contact Form Submission
     ========================================================================== */
  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane fa-bounce"></i> Sending...';
    submitBtn.disabled = true;
    contactStatus.className = 'form-status';
    contactStatus.textContent = '';

    const payload = {
      name: document.getElementById('contactName').value,
      email: document.getElementById('contactEmail').value,
      subject: document.getElementById('contactSubject').value,
      message: document.getElementById('contactMessage').value
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (data.success) {
        contactStatus.className = 'form-status success';
        contactStatus.textContent = '✨ Message sent! I will get back to you within 24 hours.';
        contactForm.reset();
        showToast('Message sent successfully!', 'success');
      } else {
        throw new Error(data.error || 'Could not send message.');
      }
    } catch (err) {
      contactStatus.className = 'form-status error';
      contactStatus.textContent = `❌ ${err.message}`;
      showToast(err.message, 'error');
    } finally {
      submitBtn.innerHTML = originalBtnContent;
      submitBtn.disabled = false;
    }
  });

  /* ==========================================================================
     Toast Notification System
     ========================================================================== */
  function showToast(message, type = 'info') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const iconMap = {
      success: 'fa-circle-check',
      error: 'fa-circle-exclamation',
      info: 'fa-circle-info'
    };

    toast.innerHTML = `
      <i class="fa-solid ${iconMap[type] || 'fa-bell'}"></i>
      <span>${escapeHtml(message)}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideInRight 0.3s ease reverse forwards';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // XSS prevention
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Fallback projects data
  function getFallbackProjects() {
    return [
      {
        id: 1,
        title: 'Full-Stack Portfolio Platform — Thiranex Internship',
        description: 'Production-ready full-stack web application engineered during my internship at Thiranex, featuring RESTful API routing, SQLite database persistence, and responsive glassmorphism UI.',
        category: 'Full Stack',
        tags: 'Node.js, Express.js, SQLite, REST API, JavaScript, HTML5/CSS3',
        image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60',
        github_url: 'https://github.com',
        live_url: 'http://localhost:3000',
        featured: 1
      },
      {
        id: 2,
        title: 'Deloitte Forensic Data Analytics Simulation',
        description: 'Actionable data analysis and forensic technology exploration completed with Deloitte via Forage, uncovering operational patterns with structured analytical methodologies.',
        category: 'AI/ML',
        tags: 'Data Analysis, Forensic Technology, Python, Business Intelligence',
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
        github_url: 'https://github.com',
        live_url: 'https://www.linkedin.com/in/motam-geethika-941120377',
        featured: 1
      },
      {
        id: 3,
        title: 'AWS Cloud & Machine Learning Foundations',
        description: 'Cloud computing exploration integrating core concepts from AWS Foundations: Machine Learning Basics, covering ML models, data processing, and cloud deployment pipelines.',
        category: 'AI/ML',
        tags: 'AWS Cloud, Machine Learning, Python, Cloud Computing',
        image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
        github_url: 'https://github.com',
        live_url: 'https://www.linkedin.com/in/motam-geethika-941120377',
        featured: 1
      },
      {
        id: 4,
        title: 'Personal Portfolio & Database Management System',
        description: 'Complete full-stack personal portfolio built with Node.js, Express, and SQLite. Features real-time contact logging, live project filtering, theme switching, and CRUD operations.',
        category: 'Full Stack',
        tags: 'Node.js, Express, SQLite, Vanilla JS, CSS Variables',
        image_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=60',
        github_url: 'https://github.com',
        live_url: 'http://localhost:3000',
        featured: 0
      },
      {
        id: 5,
        title: 'AI & Emerging Technology Knowledge Showcase',
        description: 'Interactive technology explorer based on CampusUnite AI & Technology Challenge 2026, highlighting modern generative AI systems and intelligent automation concepts.',
        category: 'Frontend',
        tags: 'JavaScript, Emerging Tech, AI Concepts, Responsive Design',
        image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60',
        github_url: 'https://github.com',
        live_url: 'https://www.linkedin.com/in/motam-geethika-941120377',
        featured: 0
      }
    ];
  }

  // Initialize
  fetchProjects();
});
