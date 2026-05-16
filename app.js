// DataSphere — app.js

/* ---- Navbar scroll effect ---- */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

/* ---- Mobile hamburger ---- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
}

/* ---- Hero search ---- */
function doSearch() {
  const val = document.getElementById('heroSearch')?.value?.trim();
  if (val) {
    window.location.href = `search.html?q=${encodeURIComponent(val)}`;
  }
}

const heroSearchInput = document.getElementById('heroSearch');
if (heroSearchInput) {
  heroSearchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') doSearch();
  });
}

/* ---- Search page logic ---- */
const CONTENT_DATA = [
  // Tutorials
  { type: 'tutorial', level: 'beginner', topic: 'algorithms', title: 'Big-O Notation: A Gentle Introduction', desc: 'Learn to measure the efficiency of algorithms — time complexity, space complexity, and asymptotic notation.', time: '45 min', path: 'tutorials.html' },
  { type: 'tutorial', level: 'beginner', topic: 'webdev', title: 'HTML & CSS Fundamentals', desc: 'Build your first webpage from scratch. Covers document structure, selectors, box model, and layouts.', time: '2 hr', path: 'tutorials.html' },
  { type: 'tutorial', level: 'intermediate', topic: 'algorithms', title: 'Graph Algorithms: BFS and DFS', desc: 'Traverse and search graphs with breadth-first and depth-first techniques. Includes problem walkthroughs.', time: '1.5 hr', path: 'tutorials.html' },
  { type: 'tutorial', level: 'intermediate', topic: 'webdev', title: 'React Hooks Deep Dive', desc: 'Master useState, useEffect, useContext, and custom hooks with real-world patterns.', time: '2.5 hr', path: 'tutorials.html' },
  { type: 'tutorial', level: 'intermediate', topic: 'databases', title: 'SQL Joins Explained Visually', desc: 'Inner, outer, left, right, and cross joins — visualised with Venn diagrams and live examples.', time: '1 hr', path: 'tutorials.html' },
  { type: 'tutorial', level: 'advanced', topic: 'systems', title: 'Writing a Lock-Free Queue in C++', desc: 'Understand atomic operations, memory ordering, and ABA problems through a practical implementation.', time: '3 hr', path: 'tutorials.html' },
  { type: 'tutorial', level: 'advanced', topic: 'ml', title: 'Implementing a Transformer from Scratch', desc: 'Build multi-head attention, positional encodings, and the full encoder-decoder stack in PyTorch.', time: '5 hr', path: 'tutorials.html' },
  { type: 'tutorial', level: 'beginner', topic: 'ml', title: 'Introduction to Python for Data Science', desc: 'NumPy, Pandas, and Matplotlib basics — everything you need to start working with data.', time: '2 hr', path: 'tutorials.html' },
  // Articles
  { type: 'article', level: 'advanced', topic: 'ml', title: 'Attention Mechanisms: From Theory to Transformers', desc: 'A deep dive into how attention is computed, why it works, and the architectural decisions behind modern LLMs.', time: '15 min read', path: 'articles.html' },
  { type: 'article', level: 'intermediate', topic: 'systems', title: 'The Anatomy of a TCP Connection', desc: 'Everything from the three-way handshake to TIME_WAIT — demystified with annotated packet traces.', time: '12 min read', path: 'articles.html' },
  { type: 'article', level: 'intermediate', topic: 'databases', title: "Why Your Postgres Queries Are Slow (and How to Fix Them)", desc: 'EXPLAIN ANALYZE, index selection, join strategies, and vacuuming — the practical performance guide.', time: '18 min read', path: 'articles.html' },
  { type: 'article', level: 'beginner', topic: 'algorithms', title: 'Recursion Demystified: Thinking in Subproblems', desc: 'A clear, visual introduction to recursion — no mysterious call stacks, just elegant problem decomposition.', time: '8 min read', path: 'articles.html' },
  { type: 'article', level: 'intermediate', topic: 'ml', title: 'How Vector Databases Work', desc: 'The architecture behind semantic search, HNSW indexing, and embedding stores like Pinecone and Qdrant.', time: '10 min read', path: 'articles.html' },
  { type: 'article', level: 'advanced', topic: 'security', title: 'Modern TLS: Every Handshake Byte Explained', desc: 'Walk through a TLS 1.3 handshake packet-by-packet and understand the cryptographic guarantees.', time: '20 min read', path: 'articles.html' },
  // Videos
  { type: 'video', level: 'beginner', topic: 'algorithms', title: 'Sorting Algorithms Visualised', desc: 'Bubble, merge, quick, and heap sort — animated side by side with complexity comparisons.', time: '22 min', path: 'videos.html' },
  { type: 'video', level: 'intermediate', topic: 'webdev', title: 'Building REST APIs with FastAPI', desc: 'A 2-hour hands-on project from zero to a deployed, documented API with auth.', time: '2 hr 10 min', path: 'videos.html' },
  { type: 'video', level: 'advanced', topic: 'systems', title: 'Distributed Systems Concepts', desc: 'CAP theorem, consensus algorithms, Raft, Paxos, and eventual consistency — explained clearly.', time: '1 hr 45 min', path: 'videos.html' },
  { type: 'video', level: 'beginner', topic: 'webdev', title: 'JavaScript Crash Course 2025', desc: 'Variables, functions, objects, DOM manipulation, and async/await — for absolute beginners.', time: '3 hr', path: 'videos.html' },
  // Books
  { type: 'book', level: 'advanced', topic: 'databases', title: 'Designing Data-Intensive Applications', desc: "Martin Kleppmann's masterwork on distributed systems, storage engines, and data reliability.", time: 'Martin Kleppmann', path: 'books.html' },
  { type: 'book', level: 'intermediate', topic: 'algorithms', title: 'Introduction to Algorithms (CLRS)', desc: 'The definitive algorithms textbook used in university courses worldwide. Dense but comprehensive.', time: 'Cormen, Leiserson, Rivest, Stein', path: 'books.html' },
  { type: 'book', level: 'beginner', topic: 'webdev', title: "You Don't Know JS", desc: "Kyle Simpson's series that goes deep into JavaScript's quirks and the language's real behaviour.", time: 'Kyle Simpson', path: 'books.html' },
  { type: 'book', level: 'intermediate', topic: 'ml', title: 'Hands-On Machine Learning', desc: 'Practical introduction to scikit-learn, Keras, and TensorFlow with real projects.', time: 'Aurélien Géron', path: 'books.html' },
];

function highlightQuery(text, query) {
  if (!query) return text;
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(re, '<em>$1</em>');
}

function renderSearchResults(query, typeFilter, levelFilter) {
  const resultsContainer = document.getElementById('searchResultsList');
  const resultsHeader = document.getElementById('resultsHeader');
  if (!resultsContainer) return;

  const q = (query || '').toLowerCase().trim();
  let filtered = CONTENT_DATA.filter(item => {
    const matchQuery = !q ||
      item.title.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.topic.toLowerCase().includes(q);
    const matchType = !typeFilter || typeFilter === 'all' || item.type === typeFilter;
    const matchLevel = !levelFilter || levelFilter === 'all' || item.level === levelFilter;
    return matchQuery && matchType && matchLevel;
  });

  if (resultsHeader) {
    resultsHeader.textContent = q
      ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${query}"`
      : `${filtered.length} resource${filtered.length !== 1 ? 's' : ''}`;
  }

  if (filtered.length === 0) {
    resultsContainer.innerHTML = `
      <div class="no-results">
        <p>No results found for "${query}"</p>
        <p style="font-size:14px;margin-top:8px;">Try different keywords or browse by topic above.</p>
      </div>`;
    return;
  }

  const typeBadgeMap = {
    tutorial: 'tutorial-badge',
    article: 'article-badge',
    video: 'video-badge',
    book: 'book-badge',
  };
  const levelBadgeMap = {
    beginner: 'beginner',
    intermediate: 'intermediate',
    advanced: 'advanced',
  };

  resultsContainer.innerHTML = filtered.map(item => `
    <div class="search-result-item">
      <div class="search-result-type">
        <span class="featured-type ${typeBadgeMap[item.type]}">${item.type}</span>
        <span class="tag-sm ${levelBadgeMap[item.level]}">${item.level}</span>
      </div>
      <h3><a href="${item.path}">${highlightQuery(item.title, query)}</a></h3>
      <p>${highlightQuery(item.desc, query)}</p>
    </div>
  `).join('');
}

// Init search page
if (document.getElementById('searchResultsList')) {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q') || '';
  const searchInput = document.getElementById('searchInput');
  if (searchInput && q) searchInput.value = q;

  let activeType = 'all', activeLevel = 'all';

  renderSearchResults(q, activeType, activeLevel);

  // Filter buttons
  document.querySelectorAll('.search-filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const filterGroup = this.dataset.filterGroup;
      const val = this.dataset.filterVal;
      document.querySelectorAll(`.search-filter-btn[data-filter-group="${filterGroup}"]`).forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      if (filterGroup === 'type') activeType = val;
      if (filterGroup === 'level') activeLevel = val;
      const q2 = searchInput?.value?.trim() || '';
      renderSearchResults(q2, activeType, activeLevel);
    });
  });

  // Live search
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      renderSearchResults(this.value.trim(), activeType, activeLevel);
      const url = new URL(window.location);
      if (this.value.trim()) {
        url.searchParams.set('q', this.value.trim());
      } else {
        url.searchParams.delete('q');
      }
      window.history.replaceState({}, '', url);
    });
  }

  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => renderSearchResults(searchInput.value.trim(), activeType, activeLevel));
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') renderSearchResults(searchInput.value.trim(), activeType, activeLevel);
    });
  }
}

/* ---- Tutorials page filter ---- */
if (document.getElementById('tutorialsGrid')) {
  const params = new URLSearchParams(window.location.search);
  const topicParam = params.get('topic');
  const levelParam = params.get('level');

  // Highlight matching sidebar link
  if (topicParam) {
    document.querySelectorAll(`.sidebar-group a[href*="topic=${topicParam}"]`).forEach(a => a.classList.add('active'));
  }
  if (levelParam) {
    document.querySelectorAll(`.sidebar-group a[href*="level=${levelParam}"]`).forEach(a => a.classList.add('active'));
  }

  // Filter button active state
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const group = this.dataset.group;
      document.querySelectorAll(`.filter-btn[data-group="${group}"]`).forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });
}
