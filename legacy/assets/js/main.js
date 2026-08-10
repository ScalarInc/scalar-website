/* ==========================================================================
   HELIOS — site behaviour
   1. Header stick state
   2. Nav overlay
   3. Scroll reveal
   4. Principle accordion
   5. Hero particle globe
   6. Footer year
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ *
   * 1. Header stick state
   * ------------------------------------------------------------------ */
  var header = document.querySelector('[data-header]');

  if (header) {
    var syncHeader = function () {
      header.classList.toggle('is-stuck', window.scrollY > 40);
    };
    syncHeader();
    window.addEventListener('scroll', syncHeader, { passive: true });
  }

  /* ------------------------------------------------------------------ *
   * 2. Nav overlay
   * ------------------------------------------------------------------ */
  var toggle  = document.querySelector('[data-menu-toggle]');
  var overlay = document.querySelector('[data-nav-overlay]');

  if (toggle && overlay) {
    var label = toggle.querySelector('.menu-toggle__label');

    var setMenu = function (open) {
      overlay.classList.toggle('is-open', open);
      document.body.classList.toggle('is-locked', open);
      toggle.setAttribute('aria-expanded', String(open));
      overlay.setAttribute('aria-hidden', String(!open));
      if (label) label.textContent = open ? 'Close' : 'Menu';
    };

    toggle.addEventListener('click', function () {
      setMenu(!overlay.classList.contains('is-open'));
    });

    overlay.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) setMenu(false);
    });
  }

  /* ------------------------------------------------------------------ *
   * 3. Scroll reveal
   * ------------------------------------------------------------------ */
  var revealables = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------ *
   * 4. Principle accordion
   * ------------------------------------------------------------------ */
  var principles = Array.prototype.slice.call(document.querySelectorAll('.principle'));

  principles.forEach(function (item) {
    var btn = item.querySelector('.principle__btn');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var willOpen = !item.classList.contains('is-open');
      principles.forEach(function (other) {
        other.classList.remove('is-open');
        var b = other.querySelector('.principle__btn');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      if (willOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  if (principles.length) {
    principles[0].classList.add('is-open');
    var firstBtn = principles[0].querySelector('.principle__btn');
    if (firstBtn) firstBtn.setAttribute('aria-expanded', 'true');
  }

  /* ------------------------------------------------------------------ *
   * 5. Hero particle globe
   *    A rotating point-cloud sphere ringed by dotted orbits, with
   *    crosshair markers reporting their angular position.
   * ------------------------------------------------------------------ */
  var canvas = document.querySelector('[data-globe]');

  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var w = 0, h = 0, dpr = 1;
    var cx = 0, cy = 0, radius = 0;

    /* -- point cloud: fibonacci sphere ------------------------------- */
    var POINTS = 1500;
    var cloud = [];
    var golden = Math.PI * (3 - Math.sqrt(5));

    for (var i = 0; i < POINTS; i++) {
      var y = 1 - (i / (POINTS - 1)) * 2;
      var r = Math.sqrt(Math.max(0, 1 - y * y));
      var theta = golden * i;
      cloud.push({
        x: Math.cos(theta) * r,
        y: y,
        z: Math.sin(theta) * r,
        // a few points read warm, echoing the accent colour
        warm: Math.random() < 0.06
      });
    }

    /* -- orbit rings -------------------------------------------------- */
    var RINGS = [
      { rx: 1.42, ry: 1.42, dots: 150, tilt: -0.10, speed:  0.00022, alpha: 0.55 },
      { rx: 1.80, ry: 1.80, dots: 190, tilt:  0.06, speed: -0.00016, alpha: 0.45 },
      { rx: 2.22, ry: 2.22, dots: 235, tilt: -0.04, speed:  0.00012, alpha: 0.34 },
      { rx: 2.66, ry: 2.66, dots: 280, tilt:  0.09, speed: -0.00009, alpha: 0.24 }
    ];

    /* -- crosshair markers --------------------------------------------
     * Markers oscillate within a narrow arc of the lower hemisphere so the
     * readouts never drift under the headline.
     * ------------------------------------------------------------------ */
    var MARKERS = [
      { ring: 3, base: 0.62, sweep: 0.30, speed: 0.00021 },
      { ring: 2, base: 2.32, sweep: 0.26, speed: 0.00016 },
      { ring: 1, base: 1.38, sweep: 0.34, speed: 0.00012 }
    ];

    var resize = function () {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width  = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = w / 2;
      cy = h / 2;
      radius = Math.min(w, h) * 0.132;
    };

    var drawCross = function (x, y, size, colour) {
      ctx.strokeStyle = colour;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(x - size, y);
      ctx.lineTo(x + size, y);
      ctx.moveTo(x, y - size);
      ctx.lineTo(x, y + size);
      ctx.stroke();
    };

    var spin = 0;
    var last = 0;

    var frame = function (now) {
      var dt = last ? Math.min(now - last, 48) : 16;
      last = now;
      spin += dt * 0.00016;

      ctx.clearRect(0, 0, w, h);

      /* rings */
      for (var ri = 0; ri < RINGS.length; ri++) {
        var ring = RINGS[ri];
        var rr = radius * ring.rx;
        var phase = now * ring.speed;

        for (var di = 0; di < ring.dots; di++) {
          var a = (di / ring.dots) * Math.PI * 2 + phase;
          var px = cx + Math.cos(a) * rr;
          var py = cy + Math.sin(a) * rr * (1 + ring.tilt * 0.12);

          // subtle density variation so the ring reads hand-plotted
          var flicker = 0.6 + 0.4 * Math.sin(a * 7 + ri);
          ctx.fillStyle = 'rgba(255,255,255,' + (ring.alpha * flicker * 0.75).toFixed(3) + ')';
          ctx.fillRect(px, py, 1.5, 1.5);
        }
      }

      /* markers — omitted on narrow viewports, where the stacked headline
         occupies the space the readouts would sit in */
      for (var mi = 0; w >= 860 && mi < MARKERS.length; mi++) {
        var m = MARKERS[mi];
        var mr = radius * RINGS[m.ring].rx;
        var ma = m.base + Math.sin(now * m.speed) * m.sweep;
        var mx = cx + Math.cos(ma) * mr;
        var my = cy + Math.sin(ma) * mr;

        drawCross(mx, my, 7, 'rgba(201,140,196,.9)');

        var deg = ((ma * 180 / Math.PI) % 360 + 360) % 360;
        var rad = ((ma % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

        ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
        ctx.fillStyle = 'rgba(255,255,255,.42)';
        ctx.textAlign = 'left';
        ctx.fillText(deg.toFixed(1) + '°', mx + 16, my - 2);
        ctx.fillText(rad.toFixed(3) + ' rad', mx + 16, my + 12);
      }

      /* sphere point cloud */
      var sin = Math.sin(spin), cos = Math.cos(spin);
      var tiltS = Math.sin(0.42), tiltC = Math.cos(0.42);

      for (var pi = 0; pi < cloud.length; pi++) {
        var p = cloud[pi];

        // rotate around Y, then tilt around X
        var x1 =  p.x * cos + p.z * sin;
        var z1 = -p.x * sin + p.z * cos;
        var y2 =  p.y * tiltC - z1 * tiltS;
        var z2 =  p.y * tiltS + z1 * tiltC;

        // perspective
        var persp = 1 / (1.9 - z2 * 0.42);
        var sx = cx + x1 * radius * persp * 2.05;
        var sy = cy + y2 * radius * persp * 2.05;

        // depth shading — steep falloff so the cloud reads as a shell with a
        // lit front hemisphere rather than a flat disc
        var depth = (z2 + 1) / 2;            // 0 back → 1 front
        var lit   = Math.pow(depth, 2.3);
        var alpha = 0.03 + lit * 0.92;
        var size  = 0.75 + lit * 1.35;

        ctx.fillStyle = p.warm
          ? 'rgba(201,140,196,' + (alpha * 0.8).toFixed(3) + ')'
          : 'rgba(255,255,255,' + alpha.toFixed(3) + ')';
        ctx.fillRect(sx, sy, size, size);
      }

      requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener('resize', resize);

    if (reduceMotion) {
      // draw a single static composition
      frame(0);
    } else {
      requestAnimationFrame(frame);
    }
  }

  /* ------------------------------------------------------------------ *
   * 6. Footer year
   * ------------------------------------------------------------------ */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ------------------------------------------------------------------ *
   * 7. Contact form (demo only — no backend)
   * ------------------------------------------------------------------ */
  var form = document.querySelector('[data-demo-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('[data-form-note]');
      if (note) note.textContent = 'Demo form — no message was sent. Wire this up to your own endpoint.';
    });
  }
})();
