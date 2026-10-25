/* Builds the whole page from data/content.js. You shouldn't need to edit this
   file to add or change projects. */
(function () {
  "use strict";
  var SITE = window.SITE || {}, PROJECTS = window.PROJECTS || [];
  var L = SITE.links || {};

  /* ---------- tiny DOM helper ---------- */
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    for (var k in attrs || {}) {
      if (attrs[k] == null || attrs[k] === false) continue;
      if (k === "text") n.textContent = attrs[k];
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  function $(id) { return document.getElementById(id); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* ---------- theme toggle ---------- */
  var saved = store("theme");
  if (saved) document.documentElement.setAttribute("data-theme", saved);
  $("theme").addEventListener("click", function () {
    var cur = document.documentElement.getAttribute("data-theme") ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    store("theme", next);
  });

  /* ---------- hero, about, footer ---------- */
  $("brand").textContent = SITE.name || "";
  var h1 = $("headline");
  (SITE.headline || [SITE.name]).forEach(function (line) { h1.appendChild(el("span", { text: line })); });
  $("intro").textContent = SITE.intro || "";
  var meta = $("meta");
  if (SITE.school) meta.appendChild(el("div", { text: SITE.school.name + ". " + SITE.school.detail }));
  function contactLinks() {
    var out = [];
    if (L.email) out.push(el("a", { href: "mailto:" + L.email, text: L.email }));
    if (L.github) out.push(el("a", { href: L.github, text: "GitHub", target: "_blank", rel: "noopener" }));
    if (L.linkedin) out.push(el("a", { href: L.linkedin, text: "LinkedIn", target: "_blank", rel: "noopener" }));
    if (L.resume) out.push(el("a", { href: L.resume, text: "Resume (PDF)", target: "_blank", rel: "noopener" }));
    return out;
  }
  var row = el("div");
  contactLinks().forEach(function (a, i) { if (i) row.appendChild(document.createTextNode("   /   ")); row.appendChild(a); });
  meta.appendChild(row);

  var dl = $("skills");
  if (SITE.school) { dl.appendChild(el("div", {}, [el("dt", { text: SITE.school.name }), el("dd", { text: SITE.school.detail })])); }
  (SITE.skills || []).forEach(function (s) { dl.appendChild(el("div", {}, [el("dt", { text: s.group }), el("dd", { text: s.items })])); });
  var foot = $("foot");
  foot.appendChild(el("span", { text: "© " + new Date().getFullYear() + " " + (SITE.name || "") }));
  contactLinks().forEach(function (a) { foot.appendChild(a); });

  /* ---------- tabs and routing (#projectId/view/file) ---------- */
  var tabs = $("tabs"), page = $("page"), buttons = [];
  PROJECTS.forEach(function (p, i) {
    var b = el("button", {
      type: "button", role: "tab", id: "tab-" + p.id, "aria-controls": "page",
      onclick: function () { go(p.id, "overview"); },
    }, [el("b", { text: p.tab || p.title }), p.tabNote ? el("small", { text: p.tabNote }) : null]);
    b.className = "tab";
    b.addEventListener("keydown", function (e) {
      var d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!d) return;
      e.preventDefault();
      var j = (i + d + PROJECTS.length) % PROJECTS.length;
      go(PROJECTS[j].id, "overview"); buttons[j].focus();
    });
    tabs.appendChild(b); buttons.push(b);
  });

  function parse() {
    var parts = decodeURIComponent(location.hash.slice(1)).split("/");
    var p = PROJECTS.filter(function (x) { return x.id === parts[0]; })[0];
    return { p: p, view: parts[1] || "overview", file: parts[2] };
  }
  function go(id, view, file) {
    var h = "#" + id + (view && view !== "overview" ? "/" + view : "") + (file ? "/" + file : "");
    if (location.hash !== h) history.replaceState(null, "", h);
    render();
  }
  window.addEventListener("hashchange", render);

  /* ---------- project page ---------- */
  function render() {
    var r = parse();
    if (!r.p) { if (!PROJECTS.length) return; r = { p: PROJECTS[0], view: "overview" }; }
    var p = r.p;
    buttons.forEach(function (b) {
      var on = b.id === "tab-" + p.id;
      b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1;
    });
    page.setAttribute("aria-labelledby", "tab-" + p.id);
    document.title = p.title + ", " + (SITE.name || "");

    var views = [["overview", "Overview"]];
    if ((p.media || []).length) views.push(["gallery", "Gallery (" + p.media.length + ")"]);
    if ((p.code || []).length) views.push(["code", "Code (" + p.code.length + ")"]);
    var view = views.some(function (v) { return v[0] === r.view; }) ? r.view : "overview";

    page.textContent = "";
    var who = [p.role, p.org, p.period].filter(Boolean).join("   /   ");
    page.appendChild(el("header", {}, [
      el("h2", {}, [p.title, p.status ? el("span", { class: "status", text: p.status }) : null]),
      who ? el("div", { class: "who", text: who }) : null,
    ]));

    if (views.length > 1) {
      var bar = el("div", { class: "views", role: "tablist", "aria-label": "Sections" });
      views.forEach(function (v) {
        bar.appendChild(el("button", {
          type: "button", role: "tab", "aria-selected": v[0] === view,
          text: v[1], onclick: function () { go(p.id, v[0]); },
        }));
      });
      page.appendChild(bar);
    }

    if (view === "gallery") page.appendChild(gallery(p));
    else if (view === "code") page.appendChild(code(p, r.file));
    else page.appendChild(overview(p));
  }

  function overview(p) {
    var wrap = el("div", { class: "view" });
    if (p.summary) wrap.appendChild(el("p", { class: "lede", text: p.summary }));
    if (p.note) wrap.appendChild(el("p", { class: "note", text: p.note }));

    var left = el("div"), right = el("div");
    if ((p.built || []).length) {
      left.appendChild(el("h3", { text: "What I built" }));
      left.appendChild(el("ul", { class: "built" }, p.built.map(function (t) { return el("li", { text: t }); })));
    }

    if ((p.parts || []).length) {
      right.appendChild(el("h3", { text: "Hardware" }));
      right.appendChild(el("ul", { class: "parts" }, p.parts.map(function (x) {
        return el("li", {}, [el("b", { text: (x.qty || 1) + "×" }), x.name]);
      })));
    }
    if ((p.stack || []).length) {
      right.appendChild(el("h3", { text: "Stack" }));
      right.appendChild(el("ul", { class: "chips" }, p.stack.map(function (t) { return el("li", { text: t }); })));
    }
    var links = (p.links || []).filter(function (x) { return x.href; });
    if (links.length) {
      right.appendChild(el("h3", { text: "Links" }));
      right.appendChild(el("div", { class: "links" }, links.map(function (x) {
        return el("a", { href: x.href, text: x.label, target: "_blank", rel: "noopener" });
      })));
    }
    wrap.appendChild(el("div", { class: "cols" }, [left, right]));
    if (p.figure) wrap.appendChild(figure(p.figure));
    return wrap;
  }

  /* ---------- figures ---------- */
  function figure(f) {
    var body;
    if (f.kind === "flow") body = flow(f);
    else if (f.kind === "ofdm") body = ofdm();
    else if (f.kind === "image") body = el("img", { src: f.src, alt: f.alt || "", loading: "lazy" });
    if (!body) return null;
    return el("figure", {}, [body, f.caption ? el("figcaption", { text: f.caption }) : null]);
  }

  function flow(f) {
    var row = el("div", { class: "flow", role: "group", "aria-label": "System diagram" });
    (f.stages || []).forEach(function (s) {
      if (s.bridge) { row.appendChild(el("div", { class: "bridge" }, [el("span", { text: s.bridge })])); return; }
      var stage = el("div", { class: "stage" }, [el("b", { text: s.label || "" })]);
      (s.lanes || []).forEach(function (lane) {
        var ln = el("div", { class: "lane" }, [lane.title ? el("i", { text: lane.title }) : null]);
        (lane.items || []).forEach(function (it) {
          if ("link" in it) ln.appendChild(el("div", { class: "arrow", "aria-hidden": "true", text: (it.link || "") + " ↓" }));
          else ln.appendChild(el("div", { class: "box" }, [el("b", { text: it.t }), it.s ? el("small", { text: it.s }) : null]));
        });
        stage.appendChild(ln);
      });
      row.appendChild(stage);
    });
    return row;
  }

  function ofdm() {
    var NS = "http://www.w3.org/2000/svg", W = 760, H = 240, base = 150, A = 100, n = 7, x0 = 40, x1 = W - 40;
    var d = (x1 - x0) / (n + 1);
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H); svg.setAttribute("class", "ofdm");
    svg.setAttribute("role", "img"); svg.setAttribute("aria-label", "Seven overlapping sinc-shaped OFDM subcarriers");
    function add(tag, a) { var n = document.createElementNS(NS, tag); for (var k in a) n.setAttribute(k, a[k]); svg.appendChild(n); return n; }
    add("line", { x1: x0, x2: x1, y1: base, y2: base, stroke: "var(--line)", "stroke-width": 1 });
    for (var k = 1; k <= n; k++) {
      var cx = x0 + k * d, pts = [];
      for (var x = x0; x <= x1; x += 2) {
        var u = (x - cx) / d, s = u === 0 ? 1 : Math.sin(Math.PI * u) / (Math.PI * u);
        pts.push(x.toFixed(1) + "," + (base - A * s).toFixed(1));
      }
      var mid = k === 4;
      add("polyline", { points: pts.join(" "), fill: "none",
        stroke: mid ? "var(--marker)" : "var(--signal)", "stroke-width": mid ? 2.5 : 1.3, opacity: mid ? 1 : .7 });
      add("line", { x1: cx, x2: cx, y1: base + 4, y2: base + 10, stroke: "var(--ink-2)" });
    }
    for (k = 1; k <= n; k++) if (k !== 4) add("circle", { cx: x0 + k * d, cy: base, r: 3.5, fill: "var(--marker)" });
    var t = add("text", { x: x1, y: base + 34, "text-anchor": "end", fill: "var(--ink-2)", "font-family": "var(--mono)", "font-size": 12 });
    t.textContent = "frequency";
    return svg;
  }

  /* ---------- gallery ---------- */
  function gallery(p) {
    var g = el("div", { class: "view gallery" });
    p.media.forEach(function (m) {
      var body;
      if (m.type === "video") body = el("video", { src: m.src, poster: m.poster, controls: "", preload: "metadata", playsinline: "" });
      else if (m.type === "youtube") body = el("div", { class: "yt" }, [el("iframe", {
        src: "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(m.id), title: m.title || m.caption || "Video",
        loading: "lazy", allow: "accelerometer; encrypted-media; picture-in-picture", allowfullscreen: "" })]);
      else body = el("img", { src: m.src, alt: m.alt || m.caption || "", loading: "lazy", onclick: function () { zoom(m.src, m.alt); } });
      g.appendChild(el("figure", {}, [body, m.caption ? el("figcaption", { text: m.caption }) : null]));
    });
    return g;
  }
  var lb = $("lightbox");
  function zoom(src, alt) { var i = lb.querySelector("img"); i.src = src; i.alt = alt || ""; lb.hidden = false; $("lb-close").focus(); }
  function unzoom() { lb.hidden = true; }
  $("lb-close").addEventListener("click", unzoom);
  lb.addEventListener("click", function (e) { if (e.target === lb) unzoom(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !lb.hidden) unzoom(); });

  /* ---------- code viewer ---------- */
  var cache = {};
  function code(p, wanted) {
    var files = p.code, idx = Math.max(0, files.findIndex(function (f) { return f.file === wanted; }));
    var f = files[idx];
    var box = el("div", { class: "view code" });
    var head = el("div", { class: "codehead" }, [el("span", { text: f.file + (f.note ? "   " + f.note : "") })]);
    if (f.href) head.appendChild(el("a", { href: f.href, target: "_blank", rel: "noopener", text: "View on GitHub" }));
    box.appendChild(head);
    var list = el("div", { class: "files", role: "tablist", "aria-label": "Files" });
    files.forEach(function (x, i) {
      list.appendChild(el("button", { type: "button", role: "tab", "aria-selected": i === idx,
        onclick: function () { go(p.id, "code", x.file); } }, [x.file, el("small", { text: x.lang || "" })]));
    });
    box.appendChild(list);
    var pre = el("pre", { class: "src", tabindex: "0" }), c = el("code");
    pre.appendChild(c); box.appendChild(pre);

    function show(txt) { c.innerHTML = highlight(txt, f.lang); }
    if (f.text != null) show(f.text);
    else if (cache[f.src]) show(cache[f.src]);
    else {
      c.textContent = "Loading " + f.src + " ...";
      fetch(f.src).then(function (r) { if (!r.ok) throw 0; return r.text(); })
        .then(function (t) { cache[f.src] = t; show(t); })
        .catch(function () {
          c.textContent = "Could not load " + f.src + ".\nIf you opened index.html straight from your disk, run a local server instead:\n  python3 -m http.server\nthen open http://localhost:8000";
        });
    }
    return box;
  }

  var KW = {
    verilog: "module endmodule input output inout wire reg logic assign always always_ff always_comb begin end if else case endcase default for generate endgenerate genvar parameter localparam posedge negedge initial function endfunction integer signed",
    python: "def class return if elif else for while import from as with try except finally raise lambda None True False and or not in is pass break continue yield async await",
    c: "int char float double void unsigned signed long short const static struct enum typedef return if else for while do switch case break continue sizeof bool true false include define uint8_t uint16_t uint32_t int16_t int32_t size_t volatile",
    js: "const let var function return if else for while class new import export from async await true false null undefined this",
    matlab: "function end if elseif else for while switch case otherwise return break continue",
    bash: "if then else fi for do done while case esac function export echo",
  };
  KW.cpp = KW.c + " class public private protected namespace using template typename nullptr auto";
  function highlight(src, lang) {
    var esc = function (s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
    var kw = (KW[lang] || "").split(" ");
    var com = { python: "#[^\\n]*", bash: "#[^\\n]*", matlab: "%[^\\n]*" }[lang] || "\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/";
    var str = lang === "verilog" ? "\"(?:\\\\.|[^\"\\\\])*\"" : "\"(?:\\\\.|[^\"\\\\])*\"|'(?:\\\\.|[^'\\\\])*'";
    var re = new RegExp("(" + com + ")|(" + str + ")|(\\b\\d+'[sS]?[bBdDhHoO][0-9a-fA-FxXzZ_]+|\\b0x[0-9a-fA-F]+|\\b\\d[\\d_]*(?:\\.\\d+)?)|(`\\w+|[A-Za-z_]\\w*)", "g");
    if (lang === "text" || !lang) return esc(src);
    var out = "", last = 0, m;
    while ((m = re.exec(src))) {
      out += esc(src.slice(last, m.index));
      var t = esc(m[0]);
      if (m[1]) out += '<span class="c">' + t + "</span>";
      else if (m[2]) out += '<span class="s">' + t + "</span>";
      else if (m[3]) out += '<span class="n">' + t + "</span>";
      else if (m[4][0] === "`") out += '<span class="d">' + t + "</span>";
      else if (kw.indexOf(m[4]) >= 0) out += '<span class="k">' + t + "</span>";
      else out += t;
      last = re.lastIndex;
    }
    return out + esc(src.slice(last));
  }

  /* ---------- hero spectrum (decorative) ---------- */
  (function () {
    var cv = $("spectrum"); if (!cv || !cv.getContext) return;
    var ctx = cv.getContext("2d"), t = 0, still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    function size() { var r = cv.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1); cv.width = r.width * dpr; cv.height = r.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    function col(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }
    function draw() {
      var w = cv.clientWidth, h = cv.clientHeight; ctx.clearRect(0, 0, w, h);
      var line = col("--line"), sig = col("--signal");
      ctx.strokeStyle = line; ctx.lineWidth = 1;
      for (var gx = 0; gx < w; gx += 80) { ctx.beginPath(); ctx.moveTo(gx + .5, 0); ctx.lineTo(gx + .5, h); ctx.stroke(); }
      for (var gy = 0; gy < h; gy += 80) { ctx.beginPath(); ctx.moveTo(0, gy + .5); ctx.lineTo(w, gy + .5); ctx.stroke(); }
      var chirp = .55 + .3 * ((t * .004) % 1);
      ctx.strokeStyle = sig; ctx.lineWidth = 1.5; ctx.beginPath();
      for (var x = 0; x <= w; x += 3) {
        var f = x / w, v = .06 + .04 * Math.random();
        v += .55 * Math.exp(-Math.pow((f - .18) / .006, 2));                              // carrier
        if (f > .3 && f < .48) v += .32 + .03 * Math.sin(f * 900);                      // OFDM block
        v += .45 * Math.exp(-Math.pow((f - chirp) / .01, 2));                            // chirp
        var y = h * .97 - v * h * .35;
        x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
    }
    function loop() { t++; if (t % 3 === 0) draw(); if (!still && !document.hidden) requestAnimationFrame(loop); }
    size(); addEventListener("resize", function () { size(); draw(); });
    document.addEventListener("visibilitychange", function () { if (!document.hidden && !still) loop(); });
    still ? draw() : loop();
  })();

  render();
})();
