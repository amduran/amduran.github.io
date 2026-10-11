(function () {
  'use strict';

  var root = document.documentElement;
  var darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  /* ---------- Theme ---------- */
  function effectiveTheme() {
    var explicit = root.getAttribute('data-theme');
    if (explicit === 'dark' || explicit === 'light') return explicit;
    return darkQuery && darkQuery.matches ? 'dark' : 'light';
  }

  function initTheme() {
    var toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('site-theme', next); } catch (e) {}
    });
  }

  /* ---------- Mobile navigation ---------- */
  function initMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.getElementById('site-nav');
    if (!toggle || !nav) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    document.addEventListener('click', function (event) {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      if (nav.contains(event.target) || toggle.contains(event.target)) return;
      setOpen(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 960) setOpen(false);
    });
  }

  /* ---------- Publication filters ---------- */
  function quartileScore(value) {
    var scores = { Q1D1: 5, Q1: 4, Q2: 3, Q3: 2, Q4: 1, NONE: 0 };
    return scores[String(value || 'NONE').toUpperCase()] || 0;
  }

  function initPublicationFilters() {
    var form = document.getElementById('publication-filters');
    var search = document.getElementById('publication-search');
    var year = document.getElementById('publication-year');
    var type = document.getElementById('publication-type');
    var quartile = document.getElementById('publication-quartile');
    var sort = document.getElementById('publication-sort');
    var count = document.getElementById('publication-count');
    var clear = document.getElementById('publication-clear');
    var empty = document.getElementById('publication-empty');
    var listing = document.getElementById('publication-listing');
    if (!search || !year || !type || !quartile || !sort || !listing) return;
    var items = Array.prototype.slice.call(listing.querySelectorAll('.filterable-item'));
    if (!items.length) return;

    var controls = { q: search, year: year, type: type, quartile: quartile, sort: sort };
    var defaults = { q: '', year: 'all', type: 'all', quartile: 'all', sort: 'recent' };

    function readUrl() {
      var params = new URLSearchParams(window.location.search);
      Object.keys(controls).forEach(function (key) {
        var value = params.get(key);
        if (value === null) return;
        var el = controls[key];
        if (el.tagName === 'SELECT') {
          var exists = Array.prototype.some.call(el.options, function (o) { return o.value === value; });
          if (exists) el.value = value;
        } else {
          el.value = value;
        }
      });
    }

    function writeUrl() {
      if (!window.history || !window.history.replaceState) return;
      var params = new URLSearchParams();
      Object.keys(controls).forEach(function (key) {
        var value = controls[key].value.trim();
        if (value && value !== defaults[key]) params.set(key, value);
      });
      var query = params.toString();
      window.history.replaceState(null, '', window.location.pathname + (query ? '?' + query : '') + window.location.hash);
    }

    function sortItems() {
      var mode = sort.value;
      items.slice().sort(function (a, b) {
        var yearA = parseInt(a.dataset.year || '0', 10);
        var yearB = parseInt(b.dataset.year || '0', 10);
        var titleA = a.dataset.title || '';
        var titleB = b.dataset.title || '';
        var qA = quartileScore(a.dataset.impactRank || a.dataset.quartile);
        var qB = quartileScore(b.dataset.impactRank || b.dataset.quartile);
        if (mode === 'oldest') return yearA - yearB || titleA.localeCompare(titleB);
        if (mode === 'impact') return qB - qA || yearB - yearA || titleA.localeCompare(titleB);
        if (mode === 'title') return titleA.localeCompare(titleB) || yearB - yearA;
        return yearB - yearA;
      }).forEach(function (item) { listing.appendChild(item); });
    }

    function normalise(value) {
      return String(value || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    }

    function applyFilters() {
      var terms = normalise(search.value.trim()).split(/\s+/).filter(Boolean);
      var y = year.value;
      var ty = type.value;
      var qu = quartile.value.toUpperCase();
      var visible = 0;

      items.forEach(function (item) {
        var haystack = item.dataset.searchNormalised;
        if (haystack === undefined) {
          haystack = normalise(item.dataset.search);
          item.dataset.searchNormalised = haystack;
        }
        var show = terms.every(function (term) { return haystack.indexOf(term) !== -1; }) &&
          (y === 'all' || item.dataset.year === y) &&
          (ty === 'all' || item.dataset.type === ty) &&
          (qu === 'ALL' || (item.dataset.quartile || 'none').toUpperCase() === qu);
        item.hidden = !show;
        if (show) visible += 1;
      });

      sortItems();
      if (count) count.textContent = String(visible);
      if (empty) empty.hidden = visible !== 0;
      writeUrl();
    }

    if (form) form.addEventListener('submit', function (event) { event.preventDefault(); applyFilters(); });
    if (clear) {
      clear.addEventListener('click', function () {
        Object.keys(controls).forEach(function (key) { controls[key].value = defaults[key]; });
        applyFilters();
        search.focus();
      });
    }
    search.addEventListener('input', applyFilters);
    [year, type, quartile, sort].forEach(function (el) { el.addEventListener('change', applyFilters); });

    readUrl();
    applyFilters();
  }

  /* ---------- Copy BibTeX ---------- */
  function initCopyButtons() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-copy-target]'), function (button) {
      var target = document.getElementById(button.getAttribute('data-copy-target'));
      var label = button.querySelector('span');
      if (!target || !label) return;
      var original = label.textContent;
      var timer = null;

      function done() {
        label.textContent = button.getAttribute('data-copied-label') || original;
        button.classList.add('is-copied');
        clearTimeout(timer);
        timer = setTimeout(function () {
          label.textContent = original;
          button.classList.remove('is-copied');
        }, 2000);
      }

      function fallback() {
        var range = document.createRange();
        range.selectNodeContents(target);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        try { if (document.execCommand('copy')) done(); } catch (e) {}
      }

      button.addEventListener('click', function () {
        var text = target.textContent || '';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, fallback);
        } else {
          fallback();
        }
      });
    });
  }

  function init() {
    initTheme();
    initMenu();
    initPublicationFilters();
    initCopyButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
