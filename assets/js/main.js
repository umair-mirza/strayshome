/* =========================================================
   Strays Home Animal Rescue Foundation — site scripts
   Vanilla JS, no dependencies, GitHub Pages friendly.
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Mobile navigation ---------------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("primary-nav");
    if (!toggle || !nav) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      nav.dataset.open = String(open);
      document.body.style.overflow = open && window.innerWidth <= 1080 ? "hidden" : "";
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1080) setOpen(false);
    });
  }

  /* ---------------- Mark the active nav link ---------------- */
  function initActiveLink() {
    var here = location.pathname.replace(/\/index\.html$/, "/").replace(/\/$/, "/index.html");
    var file = here.split("/").pop() || "index.html";
    document.querySelectorAll(".nav a[href]").forEach(function (a) {
      var target = a.getAttribute("href").split("#")[0].split("/").pop();
      if (target === file) a.setAttribute("aria-current", "page");
    });
  }

  /* ---------------- Reveal on scroll ---------------- */
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.dataset.revealDelay || "0", 10);
        setTimeout(function () { el.classList.add("is-visible"); }, delay);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- Animated counters ---------------- */
  function initCounters() {
    var nodes = document.querySelectorAll("[data-count]");
    if (!nodes.length) return;

    function run(el) {
      var target = parseFloat(el.dataset.count);
      if (reduceMotion) { el.textContent = target.toLocaleString("en-US"); return; }
      var start = performance.now();
      var dur = 1500;
      function frame(now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString("en-US");
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    if (!("IntersectionObserver" in window)) { nodes.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    nodes.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- Copy to clipboard ---------------- */
  function initCopy() {
    document.querySelectorAll("[data-copy]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var text = btn.dataset.copy;
        var done = function () {
          var original = btn.textContent;
          btn.dataset.copied = "true";
          btn.textContent = "Copied!";
          setTimeout(function () {
            btn.dataset.copied = "false";
            btn.textContent = original;
          }, 1800);
        };
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(done).catch(function () { fallback(text, done); });
        } else {
          fallback(text, done);
        }
      });
    });

    function fallback(text, done) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { /* no-op */ }
      document.body.removeChild(ta);
    }
  }

  /* ---------------- Donation amount picker ---------------- */
  function initAmounts() {
    var group = document.querySelector("[data-amounts]");
    if (!group) return;
    group.querySelectorAll(".amount").forEach(function (btn) {
      btn.addEventListener("click", function () {
        group.querySelectorAll(".amount").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        btn.setAttribute("aria-pressed", "true");
        var out = document.querySelector("[data-amount-note]");
        if (out) out.textContent = btn.dataset.impact || "";
      });
    });
  }

  /* ---------------- Back to top ---------------- */
  function initToTop() {
    var btn = document.querySelector(".to-top");
    if (!btn) return;
    var onScroll = function () {
      btn.dataset.show = String(window.scrollY > 700);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------------- Photo placeholders ---------------- */
  var PAW = '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20 27c4 0 7-4 7-9s-3-9-7-9-7 4-7 9 3 9 7 9zm24 0c4 0 7-4 7-9s-3-9-7-9-7 4-7 9 3 9 7 9zM9 44c3 0 5-3 5-7s-2-7-5-7-5 3-5 7 2 7 5 7zm46 0c3 0 5-3 5-7s-2-7-5-7-5 3-5 7 2 7 5 7zM32 31c-8 0-15 8-15 15 0 6 4 9 9 9 3 0 5-1 6-1s3 1 6 1c5 0 9-3 9-9 0-7-7-15-15-15z"/></svg>';

  function placeholder(index, label) {
    var el = document.createElement("div");
    el.className = "ph ph--" + ((index % 8) + 1);
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", label || "Photo coming soon");
    el.innerHTML = PAW + "<span>Photo coming soon</span>";
    return el;
  }

  function makeTile(item, index, tag) {
    var el = document.createElement(tag);
    if (tag === "button") { el.type = "button"; }
    el.dataset.index = String(index);
    if (item.src) {
      var img = document.createElement("img");
      img.src = item.src;
      img.alt = item.alt || "Rescued animal cared for by Strays Home";
      img.loading = "lazy";
      img.decoding = "async";
      img.addEventListener("error", function () {
        img.replaceWith(placeholder(index, item.alt));
      });
      el.appendChild(img);
    } else {
      el.appendChild(placeholder(index, item.alt));
    }
    return el;
  }

  /* ---------------- Gallery data ---------------- */
  var galleryPromise = null;

  // If the first photo can't be loaded the folder hasn't been filled in yet,
  // so we render placeholder tiles everywhere instead of waiting on lazy-load errors.
  function probe(src) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () { resolve(true); };
      img.onerror = function () { resolve(false); };
      img.src = src;
    });
  }

  function loadGallery() {
    if (galleryPromise) return galleryPromise;
    var base = document.documentElement.dataset.base || "";
    galleryPromise = fetch(base + "assets/gallery/manifest.json", { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error("manifest")); })
      .then(function (data) { return Array.isArray(data.photos) ? data.photos : []; })
      .then(function (photos) {
        if (!photos.length) return [];
        return probe(base + photos[0].src).then(function (ok) { return ok ? photos : []; });
      })
      .catch(function () { return []; });
    return galleryPromise;
  }

  function fillSlots(count, photos) {
    var out = [];
    for (var i = 0; i < count; i++) {
      out.push(photos.length ? photos[i % photos.length] : { src: "", alt: "Photo coming soon" });
    }
    return out;
  }

  /* ---------------- Marquee rows (home page) ---------------- */
  function initMarquees(photos) {
    var blocks = document.querySelectorAll("[data-marquee]");
    blocks.forEach(function (block, blockIndex) {
      var perRow = parseInt(block.dataset.count || "8", 10);
      var offset = blockIndex * perRow;
      var track = block.querySelector(".marquee");
      if (!track) return;
      var items = fillSlots(perRow, photos.slice(offset).concat(photos.slice(0, offset)));
      var frag = document.createDocumentFragment();
      // Rendered twice for a seamless -50% loop.
      for (var pass = 0; pass < 2; pass++) {
        items.forEach(function (item, i) {
          var tile = makeTile(item, offset + i, "button");
          tile.className = "marquee__item";
          if (pass === 1) tile.setAttribute("aria-hidden", "true");
          frag.appendChild(tile);
        });
      }
      track.appendChild(frag);
    });
  }

  /* ---------------- Gallery wall (gallery page) ---------------- */
  function initWall(photos) {
    var wall = document.querySelector("[data-wall]");
    if (!wall) return;
    var cols = parseInt(wall.dataset.cols || "4", 10);
    var perCol = parseInt(wall.dataset.perCol || "6", 10);
    var speeds = [46, 58, 52, 64];
    var idx = 0;
    var frag = document.createDocumentFragment();

    for (var c = 0; c < cols; c++) {
      var col = document.createElement("div");
      col.className = "wall__col" + (c % 2 ? " wall__col--down" : "");
      col.style.setProperty("--speed", speeds[c % speeds.length] + "s");
      var items = fillSlots(perCol, photos.slice(idx).concat(photos.slice(0, idx)));
      idx += perCol;
      for (var pass = 0; pass < 2; pass++) {
        items.forEach(function (item, i) {
          var tile = makeTile(item, i, "button");
          tile.className = "wall__item";
          if (pass === 1) tile.setAttribute("aria-hidden", "true");
          col.appendChild(tile);
        });
      }
      frag.appendChild(col);
    }
    wall.appendChild(frag);
  }

  /* ---------------- Hero / frame single images ---------------- */
  function initSpots(photos) {
    document.querySelectorAll("[data-photo-spot]").forEach(function (spot, i) {
      var wanted = parseInt(spot.dataset.photoSpot, 10);
      var index = isNaN(wanted) ? i : wanted;
      if (!photos.length) {
        spot.appendChild(placeholder(index, spot.dataset.alt));
        return;
      }
      var item = photos[index % photos.length];
      var img = document.createElement("img");
      img.src = item.src;
      img.alt = spot.dataset.alt || item.alt || "";
      img.loading = "lazy";
      img.decoding = "async";
      img.addEventListener("error", function () {
        img.replaceWith(placeholder(index, spot.dataset.alt));
      });
      spot.appendChild(img);
    });
  }

  /* ---------------- Lightbox ---------------- */
  function initLightbox(photos) {
    var box = document.querySelector(".lightbox");
    if (!box) return;
    var imgWrap = box.querySelector(".lightbox__inner");
    var cap = box.querySelector(".lightbox__cap");
    var lastFocus = null;

    function open(item) {
      if (!item || !item.src) return;
      imgWrap.querySelectorAll("img").forEach(function (n) { n.remove(); });
      var img = document.createElement("img");
      img.src = item.src;
      img.alt = item.alt || "";
      imgWrap.prepend(img);
      cap.textContent = item.caption || item.alt || "";
      lastFocus = document.activeElement;
      box.hidden = false;
      document.body.style.overflow = "hidden";
      box.querySelector(".lightbox__close").focus();
    }

    function close() {
      box.hidden = true;
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }

    document.addEventListener("click", function (e) {
      var tile = e.target.closest(".marquee__item, .wall__item");
      if (tile) {
        var i = parseInt(tile.dataset.index || "0", 10);
        if (photos.length) open(photos[i % photos.length]);
        return;
      }
      if (e.target.closest(".lightbox__close") || e.target === box) close();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !box.hidden) close();
    });
  }

  /* ---------------- Forms (no backend on GitHub Pages) ---------------- */
  function initForms() {
    document.querySelectorAll("form[data-mailto]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var data = new FormData(form);
        var lines = [];
        data.forEach(function (value, key) {
          if (String(value).trim()) lines.push(key + ": " + value);
        });
        var subject = form.dataset.subject || "Website enquiry";
        var href =
          "mailto:" + form.dataset.mailto +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(lines.join("\n\n"));
        window.location.href = href;
        var note = form.querySelector("[data-form-status]");
        if (note) note.textContent = "Opening your email app… If nothing happens, email us directly at " + form.dataset.mailto + ".";
      });
    });
  }

  /* ---------------- Footer year ---------------- */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ---------------- Boot ---------------- */
  function boot() {
    initNav();
    initActiveLink();
    initReveal();
    initCounters();
    initCopy();
    initAmounts();
    initToTop();
    initForms();
    initYear();

    var needsPhotos = document.querySelector("[data-marquee], [data-wall], [data-photo-spot]");
    if (needsPhotos) {
      loadGallery().then(function (photos) {
        initMarquees(photos);
        initWall(photos);
        initSpots(photos);
        initLightbox(photos);
        initReveal();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
