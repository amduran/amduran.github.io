(function(){
  'use strict';

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('site-theme', theme); } catch (e) {}
    const icon = document.querySelector('.theme-toggle i');
    if (icon) {
      icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  function initTheme() {
    let saved = 'light';
    try { saved = localStorage.getItem('site-theme') || 'light'; } catch (e) {}
    setTheme(saved);
    const toggle = document.querySelector('.theme-toggle');
    if (toggle && !toggle.dataset.themeBound) {
      toggle.dataset.themeBound = 'true';
      toggle.addEventListener('click', function(){
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        setTheme(current === 'dark' ? 'light' : 'dark');
      });
    }
  }

  function initMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.getElementById('main-menu');
    const body = document.body;
    const activeLink = document.querySelector('.main-menu .' + body.className);

    if (activeLink) activeLink.classList.add('is-active');

    if (toggle && menu) {
      toggle.addEventListener('click', function(){
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        menu.classList.toggle('is-open');
      });
    }
  }

  function initMap() {
    try {
      const mapNode = document.getElementById('map');
      if (mapNode) {
        const map = L.map('map').setView([37.867727, -4.790526], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        L.marker([37.867727, -4.790526]).addTo(map)
          .bindPopup('Universidad Loyola Andalucía')
          .openPopup();
      }
    } catch (e) {
      console.warn('map not loaded');
    }
  }

  function quartileScore(value) {
    const scores = { 'Q1D1': 5, 'Q1': 4, 'Q2': 3, 'Q3': 2, 'Q4': 1, 'NONE': 0 };
    return scores[String(value || 'NONE').toUpperCase()] || 0;
  }

  function initPublicationFilters() {
    const search = document.getElementById('publication-search');
    const year = document.getElementById('publication-year');
    const type = document.getElementById('publication-type');
    const quartile = document.getElementById('publication-quartile');
    const sort = document.getElementById('publication-sort');
    const count = document.getElementById('publication-count');
    const apply = document.getElementById('publication-apply');
    const clear = document.getElementById('publication-clear');
    const empty = document.getElementById('publication-empty');
    const listing = document.getElementById('publication-listing');
    const items = Array.from(document.querySelectorAll('.filterable-item'));
    if (!search || !year || !type || !quartile || !sort || !items.length || !listing) return;

    function sortItems() {
      const mode = sort.value;
      const sorted = items.slice().sort(function(a, b){
        const yearA = parseInt(a.dataset.year || '0', 10);
        const yearB = parseInt(b.dataset.year || '0', 10);
        const titleA = (a.dataset.title || '').toLowerCase();
        const titleB = (b.dataset.title || '').toLowerCase();
        const qA = quartileScore(a.dataset.impactRank || a.dataset.quartile);
        const qB = quartileScore(b.dataset.impactRank || b.dataset.quartile);

        if (mode === 'oldest') {
          return yearA - yearB || titleA.localeCompare(titleB);
        }
        if (mode === 'impact') {
          return qB - qA || yearB - yearA || titleA.localeCompare(titleB);
        }
        if (mode === 'title') {
          return titleA.localeCompare(titleB) || yearB - yearA;
        }
        return yearB - yearA || qB - qA || titleA.localeCompare(titleB);
      });

      sorted.forEach(function(item){ listing.appendChild(item); });
    }

    function applyFilters() {
      const q = search.value.trim().toLowerCase();
      const y = year.value;
      const t = type.value;
      const qu = quartile.value;
      let visible = 0;

      items.forEach(function(item){
        const matchesSearch = !q || (item.dataset.search || '').includes(q);
        const matchesYear = y === 'all' || item.dataset.year === y;
        const matchesType = t === 'all' || item.dataset.type === t;
        const matchesQuartile = qu === 'all' || (item.dataset.quartile || 'none').toUpperCase() === qu.toUpperCase();
        const show = matchesSearch && matchesYear && matchesType && matchesQuartile;
        item.hidden = !show;
        if (show) visible += 1;
      });

      sortItems();
      if (count) count.textContent = visible;
      if (empty) empty.hidden = visible !== 0;
    }

    if (listing.dataset.filtersBound) return;
    listing.dataset.filtersBound = 'true';

    if (apply) apply.addEventListener('click', applyFilters);
    if (clear) {
      clear.addEventListener('click', function(){
        search.value = '';
        year.value = 'all';
        type.value = 'all';
        quartile.value = 'all';
        sort.value = 'recent';
        applyFilters();
      });
    }

    [search, year, type, quartile, sort].forEach(function(el){
      el.addEventListener('input', applyFilters);
      el.addEventListener('change', applyFilters);
    });

    applyFilters();
  }

  document.addEventListener('DOMContentLoaded', function(){
    initTheme();
    initMenu();
    initMap();
    initPublicationFilters();
  });
})();
