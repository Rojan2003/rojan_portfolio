/* smm.html only: the carousel viewer and the image lightbox. No dependencies. */
(function () {
  'use strict';
  var doc = document;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var ICON_PREV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
  var ICON_NEXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  /* ---------- carousel: the track scrolls sideways with snap, so swiping is native ---------- */
  var carousels = {};
  [].forEach.call(doc.querySelectorAll('[data-carousel]'), function (el) {
    var track = el.querySelector('.carousel-track');
    var slides = [].slice.call(el.querySelectorAll('.carousel-slide'));
    var prev = el.querySelector('.carousel-btn.prev');
    var next = el.querySelector('.carousel-btn.next');
    var dotsBox = el.querySelector('.carousel-dots');
    var count = el.querySelector('.carousel-count');
    if (!track || slides.length < 2) return;
    var index = 0;

    var dots = slides.map(function (_, i) {
      var b = doc.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Go to page ' + (i + 1));
      b.addEventListener('click', function () { go(i); });
      if (dotsBox) dotsBox.appendChild(b);
      return b;
    });

    function paint() {
      dots.forEach(function (d, i) { if (i === index) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
      if (count) count.textContent = 'Page ' + (index + 1) + ' of ' + slides.length;
      if (prev) prev.setAttribute('aria-disabled', index === 0 ? 'true' : 'false');
      if (next) next.setAttribute('aria-disabled', index === slides.length - 1 ? 'true' : 'false');
    }
    function go(i, instant) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: i * track.clientWidth, behavior: (instant || reduced.matches) ? 'auto' : 'smooth' });
    }
    if (prev) prev.addEventListener('click', function () { go(index - 1); });
    if (next) next.addEventListener('click', function () { go(index + 1); });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
    });

    var ticking = false;
    track.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        ticking = false;
        var i = Math.round(track.scrollLeft / track.clientWidth);
        i = Math.max(0, Math.min(slides.length - 1, i));
        if (i !== index) { index = i; paint(); }
      });
    }, { passive: true });

    paint();
    if (el.id) carousels[el.id] = { go: go };
  });

  /* ---------- lightbox: sample images open here with a caption, instead of the raw file ---------- */
  var links = [].slice.call(doc.querySelectorAll('a[data-lightbox]'));
  if (!links.length || typeof window.HTMLDialogElement === 'undefined') return;

  var dlg = doc.createElement('dialog');
  dlg.className = 'lightbox';
  dlg.setAttribute('aria-label', 'Image viewer');
  dlg.innerHTML =
    '<figure class="lb-figure">' +
      '<img class="lb-img" alt="">' +
      '<figcaption class="lb-cap" aria-live="polite"><span class="lb-title"></span><span class="lb-note"></span></figcaption>' +
    '</figure>' +
    '<button type="button" class="lb-btn lb-prev" aria-label="Previous image">' + ICON_PREV + '</button>' +
    '<button type="button" class="lb-btn lb-next" aria-label="Next image">' + ICON_NEXT + '</button>' +
    '<button type="button" class="lb-btn lb-close" aria-label="Close image viewer">' + ICON_CLOSE + '</button>';
  doc.body.appendChild(dlg);

  var img = dlg.querySelector('.lb-img');
  var title = dlg.querySelector('.lb-title');
  var note = dlg.querySelector('.lb-note');
  var btnPrev = dlg.querySelector('.lb-prev');
  var btnNext = dlg.querySelector('.lb-next');
  var btnClose = dlg.querySelector('.lb-close');
  var group = [], at = 0;

  function show(i) {
    at = (i + group.length) % group.length;
    var a = group[at];
    var thumb = a.querySelector('img');
    img.src = a.getAttribute('href');
    img.alt = thumb ? thumb.alt : '';
    title.textContent = a.getAttribute('data-caption') || '';
    var parts = [];
    if (group.length > 1) parts.push((at + 1) + ' of ' + group.length);
    if (a.getAttribute('data-note')) parts.push(a.getAttribute('data-note'));
    note.textContent = parts.join(' · ');
    btnPrev.hidden = btnNext.hidden = group.length < 2;
  }
  function open(a) {
    var name = a.getAttribute('data-lightbox');
    group = links.filter(function (l) { return l.getAttribute('data-lightbox') === name; });
    show(group.indexOf(a));
    dlg.showModal();
    doc.documentElement.classList.add('lb-open');
    btnClose.focus();
  }

  links.forEach(function (a) {
    a.setAttribute('aria-haspopup', 'dialog');
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;   // let people open the file in a new tab if they mean to
      e.preventDefault();
      open(a);
    });
  });

  btnPrev.addEventListener('click', function () { show(at - 1); });
  btnNext.addEventListener('click', function () { show(at + 1); });
  btnClose.addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg || e.target.classList.contains('lb-figure')) dlg.close();   // a click on the dark area closes
  });
  dlg.addEventListener('keydown', function (e) {
    if (group.length < 2) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); show(at + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); show(at - 1); }
  });
  dlg.addEventListener('close', function () {
    doc.documentElement.classList.remove('lb-open');
    /* leave the carousel on the page the visitor was last looking at */
    var last = group[at];
    var host = last && last.closest('[data-carousel]');
    if (host && carousels[host.id]) carousels[host.id].go(at, true);
    if (last && typeof last.focus === 'function') last.focus({ preventScroll: true });
  });

  /* swipe left or right inside the lightbox */
  var startX = null, startY = null;
  dlg.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) { startX = null; return; }
    startX = e.touches[0].clientX; startY = e.touches[0].clientY;
  }, { passive: true });
  dlg.addEventListener('touchend', function (e) {
    if (startX === null || group.length < 2) return;
    var dx = e.changedTouches[0].clientX - startX;
    var dy = e.changedTouches[0].clientY - startY;
    startX = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) show(at + (dx < 0 ? 1 : -1));
  }, { passive: true });
})();
