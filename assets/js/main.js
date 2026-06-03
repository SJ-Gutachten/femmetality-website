/* =================================================================
   FEMMETALITY — Interaktionen
   ----------------------------------------------------------------
   ► BUCHUNGSLINK ÄNDERN: zentral im <head> der index.html bei
     BUCHUNGS_LINK pflegen. Alle Buttons mit data-booking (Nav, Hero,
     Mobile-Menü, CTA-Block) nutzen ihn automatisch — ebenso die
     Erstgespräch-Buttons im Angebote-Abschnitt.
   ================================================================= */

// Greift auf die zentrale Konfiguration aus dem <head> zu; Fallback: Anker zum Kontakt.
const BOOKING_URL = (typeof BUCHUNGS_LINK !== "undefined") ? BUCHUNGS_LINK : "#kontakt";

document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Buchungslinks setzen ------------------------------------ */
  document.querySelectorAll("[data-booking]").forEach((el) => {
    el.setAttribute("href", BOOKING_URL);
    if (/^https?:/i.test(BOOKING_URL)) {
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    }
  });

  /* ---- Jahr im Footer ------------------------------------------ */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Sticky-Nav: Zustand beim Scrollen ----------------------- */
  const nav = document.getElementById("nav");
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobiles Menü -------------------------------------------- */
  const menu = document.getElementById("mobile-menu");
  const toggle = document.getElementById("menu-toggle");
  const closeBtn = document.getElementById("menu-close");

  const backdrop = document.getElementById("menu-backdrop");

  const openMenu = () => {
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };
  const closeMenu = () => {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  toggle?.addEventListener("click", openMenu);
  closeBtn?.addEventListener("click", closeMenu);
  backdrop?.addEventListener("click", closeMenu);
  menu?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("is-open")) closeMenu();
  });

  /* ---- Scroll-Reveal ------------------------------------------- */
  const reveals = Array.from(document.querySelectorAll(".reveal"));
  const revealAll = () => reveals.forEach((el) => el.classList.add("is-visible"));

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealAll();
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -5% 0px" }
    );
    reveals.forEach((el) => io.observe(el));

    // Safety-Net: Inhalte dürfen nie dauerhaft unsichtbar bleiben
    // (falls der Observer aus irgendeinem Grund nicht auslöst).
    window.addEventListener("load", () => {
      setTimeout(() => {
        reveals.forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.top < window.innerHeight) el.classList.add("is-visible");
        });
      }, 600);
    });
    setTimeout(revealAll, 3500);
  }

  /* ---- FAQ-Akkordeon ------------------------------------------- */
  document.querySelectorAll(".faq-trigger").forEach((trigger) => {
    const panel = trigger.nextElementSibling;
    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      // Andere schließen (Single-Open-Akkordeon)
      document.querySelectorAll(".faq-trigger").forEach((t) => {
        if (t !== trigger) {
          t.setAttribute("aria-expanded", "false");
          const p = t.nextElementSibling;
          p.style.maxHeight = null;
          p.style.opacity = 0;
          p.style.paddingBottom = 0;
        }
      });

      if (isOpen) {
        trigger.setAttribute("aria-expanded", "false");
        panel.style.maxHeight = null;
        panel.style.opacity = 0;
        panel.style.paddingBottom = 0;
      } else {
        trigger.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = panel.scrollHeight + "px";
        panel.style.opacity = 1;
      }
    });
  });

  /* ---- Kontaktformular → mailto -------------------------------- */
  const form = document.getElementById("contact-form");
  const note = document.getElementById("form-note");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      note.textContent = "Bitte fülle alle Felder aus.";
      note.style.color = "#A23B3B";
      return;
    }

    const subject = encodeURIComponent(`Anfrage von ${name} — Femmetality`);
    const body = encodeURIComponent(`Name: ${name}\nE-Mail: ${email}\n\n${message}`);
    window.location.href = `mailto:info@femmetality.com?subject=${subject}&body=${body}`;

    note.textContent = "Dein E-Mail-Programm öffnet sich — danke für deine Nachricht!";
    note.style.color = "#2d4a3e";
  });
});
