/* =========================================================================
   BEFREE — LANDING PAGE | JavaScript vanilla
   1) Barra de navegação responsiva
   2) Navbar com fundo ao rolar
   3) Scroll-reveal com Intersection Observer
   4) Formulário de contato (visual estático, sem backend)
   ========================================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  /* ---------- 1. Menu mobile ---------- */
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navMenu.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    });

    // Fecha o menu ao clicar em um link
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- 2. Navbar com sombra ao rolar ---------- */
  const onScroll = () => {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 20);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 3. Scroll-reveal (Intersection Observer) ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback: mostra tudo em navegadores sem suporte
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- 4. Formulário de contato (estático) ---------- */
  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("ctaFeedback");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email) {
        feedback.textContent = "Por favor, preencha nome e e-mail.";
        feedback.classList.add("error");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        feedback.textContent = "Informe um e-mail válido.";
        feedback.classList.add("error");
        return;
      }

      feedback.classList.remove("error");
      feedback.textContent = "Obrigado " + (name.split(" ")[0] || "") + "! Sua mensagem foi registrada na demonstração. Em breve entraremos em contato.";
      form.reset();
    });
  }

  /* ---------- 5. Fotos da equipe (fallback visual) ---------- */
  // Se a imagem do desenvolvedor ainda não existir, escondemos o <img>
  // (que exibiria o ícone de imagem quebrada) e mantemos o círculo verde
  // do wrapper .member__avatar como placeholder, preservando o layout.
  document.querySelectorAll(".member__avatar img").forEach((img) => {
    img.addEventListener("error", () => {
      img.closest(".member__avatar").classList.add("onerror");
      img.style.display = "none";
    });
  });
});
