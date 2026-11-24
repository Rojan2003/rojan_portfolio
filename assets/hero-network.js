/*
  Home hero background: a slow 3D network of connected nodes, drawn with Three.js from a CDN.
  It is laid out like a loose left-to-right workflow, with small pulses travelling along the connections.

  It stays out of the way:
  - nothing is downloaded when the visitor prefers reduced motion, has data saver on, or has no WebGL
    (the static SVG picture in the page stays instead);
  - Three.js is only fetched after the page has loaded;
  - fewer nodes and a lower frame rate on phones;
  - the animation stops when the tab is hidden or the hero is scrolled off screen.
*/
(function () {
  'use strict';

  var host = document.querySelector('[data-hero-net]');
  if (!host) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var conn = navigator.connection || {};
  if (reduce.matches || conn.saveData) return;

  try {
    var probe = document.createElement('canvas');
    var gl = probe.getContext('webgl2') || probe.getContext('webgl');
    if (!gl) return;
    var lose = gl.getExtension('WEBGL_lose_context');
    if (lose) lose.loseContext();
  } catch (e) { return; }

  /* exact version pinned; a second CDN is tried if the first cannot be reached */
  var THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js';
  var THREE_BACKUP_URL = 'https://unpkg.com/three@0.170.0/build/three.module.min.js';

  function load() {
    import(THREE_URL)
      .catch(function () { return import(THREE_BACKUP_URL); })
      .then(start)
      .catch(function () { /* keep the static picture */ });
  }
  function whenIdle() {
    if ('requestIdleCallback' in window) window.requestIdleCallback(load, { timeout: 2500 });
    else window.setTimeout(load, 400);
  }
  if (document.readyState === 'complete') whenIdle();
  else window.addEventListener('load', whenIdle, { once: true });

  /* small seeded random generator, so the network looks the same on every visit */
  function makeRandom(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function dotTexture(THREE, soft) {
    var c = document.createElement('canvas');
    c.width = c.height = 64;
    var ctx = c.getContext('2d');
    var g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(soft ? 0.25 : 0.55, 'rgba(255,255,255,' + (soft ? 0.55 : 1) + ')');
    g.addColorStop(soft ? 1 : 0.75, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }

  function start(THREE) {
    var width = host.clientWidth, height = host.clientHeight;
    if (!width || !height) return;

    var small = window.matchMedia('(max-width: 760px)').matches;
    var rand = makeRandom(20261124);

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !small, powerPreference: 'low-power' });
    } catch (e) { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2));
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 0);
    var canvas = renderer.domElement;
    canvas.setAttribute('aria-hidden', 'true');
    host.appendChild(canvas);

    var CAM_Z = 42, FOV = 48;
    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0b1324, 32, 74);
    var camera = new THREE.PerspectiveCamera(FOV, width / height, 1, 140);
    camera.position.set(0, 0, CAM_Z);
    var graph = new THREE.Group();
    scene.add(graph);

    /* ---- layout: columns of steps, each wired to one or two steps in the next column ---- */
    var viewH = 2 * CAM_Z * Math.tan(FOV * Math.PI / 360);
    var viewW = viewH * (width / height);
    var cols = small ? 5 : 10;
    var spanX = small ? Math.max(viewW * 1.5, 30) : Math.max(viewW * 1.1, 56);
    var spanY = viewH * (small ? 1.0 : 0.86);

    var nodes = [];      // { x, y, z, hub, ph: [3 phases], sp: [3 speeds], amp }
    var columns = [];
    for (var c = 0; c < cols; c++) {
      var rows = small ? 5 + (c % 2) : 3 + Math.floor(rand() * 4);
      var col = [];
      for (var r = 0; r < rows; r++) {
        nodes.push({
          x: -spanX / 2 + c * (spanX / (cols - 1)) + (rand() - 0.5) * (spanX / cols) * 0.7,
          y: spanY / 2 - (r + 0.5) * (spanY / rows) + (rand() - 0.5) * (spanY / rows) * 0.8,
          z: (rand() - 0.5) * 18,
          hub: rand() < 0.2,
          ph: [rand() * 6.28, rand() * 6.28, rand() * 6.28],
          sp: [0.16 + rand() * 0.2, 0.14 + rand() * 0.2, 0.12 + rand() * 0.18],
          amp: 0.5 + rand() * 0.9
        });
        col.push(nodes.length - 1);
      }
      columns.push(col);
    }

    var edges = [];      // [fromIndex, toIndex]
    var out = nodes.map(function () { return []; });   // edge indexes leaving each node
    function link(a, b) { out[a].push(edges.length); edges.push([a, b]); }
    for (c = 0; c < cols - 1; c++) {
      var next = columns[c + 1], reached = {};
      columns[c].forEach(function (a) {
        var order = next.slice().sort(function (p, q) { return Math.abs(nodes[p].y - nodes[a].y) - Math.abs(nodes[q].y - nodes[a].y); });
        link(a, order[0]); reached[order[0]] = true;
        if (order[1] !== undefined && rand() < 0.45) { link(a, order[1]); reached[order[1]] = true; }
      });
      next.forEach(function (b) {
        if (reached[b]) return;
        var from = columns[c].slice().sort(function (p, q) { return Math.abs(nodes[p].y - nodes[b].y) - Math.abs(nodes[q].y - nodes[b].y); })[0];
        link(from, b);
      });
    }

    /* ---- geometry ---- */
    var N = nodes.length, E = edges.length;
    var live = new Float32Array(N * 3);            // current node positions, updated every frame
    var plain = [], hubs = [];
    nodes.forEach(function (n, i) { (n.hub ? hubs : plain).push(i); });

    function pointCloud(count, o) {
      var geo = new THREE.BufferGeometry();
      var attr = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
      attr.setUsage(THREE.DynamicDrawUsage);
      geo.setAttribute('position', attr);
      var mat = new THREE.PointsMaterial({
        size: o.size, map: o.map, color: o.color, transparent: true, opacity: o.opacity,
        depthWrite: false, sizeAttenuation: true, fog: o.fog !== false,
        blending: o.additive ? THREE.AdditiveBlending : THREE.NormalBlending
      });
      var points = new THREE.Points(geo, mat);
      points.frustumCulled = false;
      graph.add(points);
      return attr;
    }
    var crisp = dotTexture(THREE, false), glow = dotTexture(THREE, true);
    var plainAttr = pointCloud(plain.length, { size: small ? 1.05 : 0.95, color: 0x14d8c4, opacity: 0.95, map: crisp });
    var haloAttr = pointCloud(hubs.length, { size: small ? 5 : 4.4, color: 0x14d8c4, opacity: 0.3, map: glow, additive: true, fog: false });
    var hubAttr = pointCloud(hubs.length, { size: small ? 1.9 : 1.7, color: 0xc9fbf5, opacity: 1, map: crisp });

    var lineGeo = new THREE.BufferGeometry();
    var lineAttr = new THREE.BufferAttribute(new Float32Array(E * 6), 3);
    lineAttr.setUsage(THREE.DynamicDrawUsage);
    lineGeo.setAttribute('position', lineAttr);
    var lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
      color: 0x38c8d8, transparent: true, opacity: small ? 0.34 : 0.42, depthWrite: false, fog: true
    }));
    lines.frustumCulled = false;
    graph.add(lines);

    /* pulses: small lights that run along the connections, left to right, then start again */
    var P = small ? 5 : 12;
    var pulses = [];
    function firstEdge() { var a = columns[0][Math.floor(rand() * columns[0].length)]; return out[a][Math.floor(rand() * out[a].length)]; }
    for (var p = 0; p < P; p++) pulses.push({ edge: Math.floor(rand() * E), t: rand(), speed: 0.16 + rand() * 0.16 });
    var pulseGlowAttr = pointCloud(P, { size: small ? 4.4 : 3.8, color: 0x3ee6d5, opacity: 0.6, map: glow, additive: true, fog: false });
    var pulseAttr = pointCloud(P, { size: small ? 1.2 : 1.05, color: 0xffffff, opacity: 1, map: crisp, fog: false });

    /* a few far, faint points for depth */
    var far = [];
    for (var f = 0; f < (small ? 10 : 34); f++) far.push((rand() - 0.5) * spanX * 1.3, (rand() - 0.5) * spanY * 1.3, -12 - rand() * 22);
    var farGeo = new THREE.BufferGeometry();
    farGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(far), 3));
    var farPoints = new THREE.Points(farGeo, new THREE.PointsMaterial({
      size: 0.5, map: crisp, color: 0x6f9dff, transparent: true, opacity: 0.6, depthWrite: false, sizeAttenuation: true, fog: true
    }));
    graph.add(farPoints);

    /* ---- pointer: the whole network leans a little toward the mouse ---- */
    var pointer = { x: 0, y: 0 };
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      window.addEventListener('pointermove', function (e) {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      }, { passive: true });
    }

    /* ---- frame ---- */
    var time = rand() * 40, last = 0, raf = 0, running = false, inView = true, skip = false;
    var rotX = 0, rotY = 0;

    function update(dt) {
      time += dt;
      var i, n, a, b, o;
      for (i = 0; i < N; i++) {
        n = nodes[i]; o = i * 3;
        live[o] = n.x + Math.sin(time * n.sp[0] + n.ph[0]) * n.amp;
        live[o + 1] = n.y + Math.cos(time * n.sp[1] + n.ph[1]) * n.amp;
        live[o + 2] = n.z + Math.sin(time * n.sp[2] + n.ph[2]) * n.amp * 1.6;
      }
      for (i = 0; i < plain.length; i++) { o = plain[i] * 3; plainAttr.setXYZ(i, live[o], live[o + 1], live[o + 2]); }
      for (i = 0; i < hubs.length; i++) {
        o = hubs[i] * 3;
        hubAttr.setXYZ(i, live[o], live[o + 1], live[o + 2]);
        haloAttr.setXYZ(i, live[o], live[o + 1], live[o + 2]);
      }
      for (i = 0; i < E; i++) {
        a = edges[i][0] * 3; b = edges[i][1] * 3;
        lineAttr.setXYZ(i * 2, live[a], live[a + 1], live[a + 2]);
        lineAttr.setXYZ(i * 2 + 1, live[b], live[b + 1], live[b + 2]);
      }
      for (i = 0; i < P; i++) {
        var pulse = pulses[i];
        pulse.t += dt * pulse.speed;
        if (pulse.t >= 1) {
          var onward = out[edges[pulse.edge][1]];
          pulse.edge = onward.length ? onward[Math.floor(rand() * onward.length)] : firstEdge();
          pulse.t = 0;
        }
        a = edges[pulse.edge][0] * 3; b = edges[pulse.edge][1] * 3;
        var t = pulse.t;
        var px = live[a] + (live[b] - live[a]) * t, py = live[a + 1] + (live[b + 1] - live[a + 1]) * t, pz = live[a + 2] + (live[b + 2] - live[a + 2]) * t;
        pulseAttr.setXYZ(i, px, py, pz);
        pulseGlowAttr.setXYZ(i, px, py, pz);
      }
      plainAttr.needsUpdate = hubAttr.needsUpdate = haloAttr.needsUpdate = lineAttr.needsUpdate = pulseAttr.needsUpdate = pulseGlowAttr.needsUpdate = true;

      var wantY = pointer.x * 0.2 + Math.sin(time * 0.07) * 0.07;
      var wantX = pointer.y * 0.12 + Math.cos(time * 0.05) * 0.03;
      rotY += (wantY - rotY) * 0.04;
      rotX += (wantX - rotX) * 0.04;
      graph.rotation.y = rotY;
      graph.rotation.x = rotX;
    }

    function frame(now) {
      raf = window.requestAnimationFrame(frame);
      if (small) { skip = !skip; if (skip) return; }     // about 30 frames a second on phones
      var dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      update(dt);
      renderer.render(scene, camera);
    }
    function play() {
      if (running || document.hidden || !inView || reduce.matches) return;
      running = true;
      last = performance.now();
      raf = window.requestAnimationFrame(frame);
    }
    function pause() {
      running = false;
      window.cancelAnimationFrame(raf);
    }

    document.addEventListener('visibilitychange', function () { if (document.hidden) pause(); else play(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[entries.length - 1].isIntersecting;
        if (inView) play(); else pause();
      }).observe(host);
    }
    var onReduce = function () {
      if (reduce.matches) { pause(); host.classList.remove('is-live'); }
      else { host.classList.add('is-live'); play(); }
    };
    if (reduce.addEventListener) reduce.addEventListener('change', onReduce);

    function resize() {
      var w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (!running) renderer.render(scene, camera);
    }
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(host);
    else window.addEventListener('resize', resize);

    canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); pause(); host.classList.remove('is-live'); });
    canvas.addEventListener('webglcontextrestored', function () { host.classList.add('is-live'); play(); });

    update(0);
    renderer.render(scene, camera);
    host.classList.add('is-live');
    play();
  }
})();
