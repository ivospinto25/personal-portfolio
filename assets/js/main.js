/* Ivo Pinto — Portfólio · interações (sem dependências) */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Tema claro/escuro ---------- */
  function storedTheme() {
    try { return localStorage.getItem("theme"); } catch (e) { return null; }
  }
  function currentTheme() {
    var t = root.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.setAttribute("aria-label", theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro");
      btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    });
  }
  applyTheme(storedTheme() || currentTheme());
  document.querySelectorAll(".theme-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem("theme", next); } catch (e) { /* armazenamento indisponível */ }
    });
  });

  /* ---------- Menu móvel ---------- */
  var nav = document.querySelector(".nav");
  var menuBtn = document.querySelector(".menu-toggle");
  if (nav && menuBtn) {
    var setMenu = function (open) {
      nav.classList.toggle("is-open", open);
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    };
    menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
    nav.querySelectorAll(".nav__links a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); menuBtn.focus(); }
    });
  }

  /* ---------- Header e barra de progresso ---------- */
  var header = document.querySelector(".site-header");
  var progress = document.querySelector(".progress");
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- Animações de entrada ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Secção ativa (navegação e índice do case study) ---------- */
  function trackActive(links) {
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    links.forEach(function (a) {
      var id = decodeURIComponent(a.hash.slice(1));
      var target = id && document.getElementById(id);
      if (target) map[id] = { link: a, el: target };
    });
    var ids = Object.keys(map);
    if (!ids.length) return;
    var visible = {};
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
      var active = null;
      for (var i = 0; i < ids.length; i++) { if (visible[ids[i]]) { active = ids[i]; break; } }
      if (!active) return;
      ids.forEach(function (id) {
        if (id === active) map[id].link.setAttribute("aria-current", "true");
        else map[id].link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    ids.forEach(function (id) { spy.observe(map[id].el); });
  }
  trackActive(Array.prototype.slice.call(document.querySelectorAll(".toc a")));
  trackActive(Array.prototype.slice.call(document.querySelectorAll('.nav__links a[href^="#"]')));

  /* ---------- Separadores (ex.: perfis da arquitetura de informação) ---------- */
  document.querySelectorAll("[data-tabs]").forEach(function (box) {
    var tabs = Array.prototype.slice.call(box.querySelectorAll('[role="tab"]'));
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(tab, false); });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === "Home") next = tabs[0];
        if (e.key === "End") next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); select(next, true); }
      });
    });
    select(tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0] || tabs[0], false);
  });

  /* ---------- Comparador antes/depois ---------- */
  document.querySelectorAll(".compare__stage").forEach(function (stage) {
    var range = stage.querySelector(".compare__range");
    var dragging = false;
    function set(pct) {
      pct = Math.max(0, Math.min(100, pct));
      stage.style.setProperty("--pos", pct + "%");
      range.value = Math.round(pct);
      range.setAttribute("aria-valuetext", Math.round(pct) + "% antes, " + (100 - Math.round(pct)) + "% depois");
    }
    function fromPointer(e) {
      var r = stage.getBoundingClientRect();
      set(((e.clientX - r.left) / r.width) * 100);
    }
    stage.addEventListener("pointerdown", function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      dragging = true;
      stage.setPointerCapture(e.pointerId);
      fromPointer(e);
    });
    stage.addEventListener("pointermove", function (e) { if (dragging) fromPointer(e); });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (ev) {
      stage.addEventListener(ev, function () { dragging = false; });
    });
    range.addEventListener("input", function () { set(Number(range.value)); });
    set(Number(range.value));
  });

  /* ---------- Formulário de contacto (abre o cliente de email) ---------- */
  var form = document.querySelector(".form[data-email]");
  if (form) {
    var status = form.querySelector(".form__status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var to = form.getAttribute("data-email");
      if (!to) {
        status.textContent = "O email de contacto ainda não está configurado.";
        return;
      }
      var name = form.elements.nome.value.trim();
      var email = form.elements.email.value.trim();
      var msg = form.elements.mensagem.value.trim();
      var subject = "Contacto pelo portfólio — " + name;
      var body = msg + "\n\n— " + name + " (" + email + ")";
      window.location.href = "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      status.textContent = "A abrir o teu cliente de email…";
    });
  }

  /* ---------- Ano no rodapé ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
