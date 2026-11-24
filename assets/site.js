/* Shared behaviour for index.html and smm.html: mobile menu, section reveal, current-section highlight. No dependencies. */
(function () {
  'use strict';
  var doc = document;

  /* footer year */
  var year = doc.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  /* ---- mobile menu ---- */
  var header = doc.querySelector('.site-header');
  var toggle = doc.querySelector('.nav-toggle');
  var nav = doc.getElementById('site-nav');
  if (header && toggle && nav) {
    var isOpen = false;
    var setOpen = function (open) {
      isOpen = open;
      header.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    toggle.addEventListener('click', function () { setOpen(!isOpen); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) { setOpen(false); toggle.focus(); }
    });
    doc.addEventListener('click', function (e) { if (isOpen && !header.contains(e.target)) setOpen(false); });
    var wide = window.matchMedia('(min-width: 900px)');
    var onWide = function () { if (wide.matches) setOpen(false); };
    if (wide.addEventListener) wide.addEventListener('change', onWide); else if (wide.addListener) wide.addListener(onWide);
  }

  /* ---- reveal: one fade-up per section, as it enters the screen ----
     Only sections that start below the screen are hidden, so nothing visible on load flickers,
     and nothing stays hidden if this script does not run. */
  var reveals = [].slice.call(doc.querySelectorAll('.reveal'));
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reveals.length && 'IntersectionObserver' in window && !reduced) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.remove('is-waiting'); revealIO.unobserve(entry.target); }
      });
    }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });
    reveals.forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight * 0.88) { el.classList.add('is-waiting'); revealIO.observe(el); }
    });
  }

  /* ---- highlight the nav link of the section on screen ---- */
  var spyLinks = [].slice.call(doc.querySelectorAll('[data-spy] a[href^="#"]'));
  if (spyLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    spyLinks.forEach(function (a) {
      var target = doc.getElementById(a.getAttribute('href').slice(1));
      if (target) byId[target.id] = { link: a, target: target };
    });
    var setCurrent = function (id) {
      spyLinks.forEach(function (a) {
        if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    };
    var visible = {};
    var spyIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { visible[entry.target.id] = entry.isIntersecting; });
      var current = '';
      Object.keys(byId).forEach(function (id) { if (visible[id]) current = id; });
      setCurrent(current);
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    Object.keys(byId).forEach(function (id) { spyIO.observe(byId[id].target); });
  }
})();
