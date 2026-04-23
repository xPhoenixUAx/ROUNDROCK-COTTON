document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.querySelector(".site-header");
  const menuOverlay = document.querySelector(".menu-overlay");
  const menuToggle = document.querySelector(".menu-toggle");
  const closeTriggers = document.querySelectorAll("[data-menu-close]");
  const modal = document.querySelector(".contact-modal");
  const contactDrawer = document.querySelector(".contact-drawer");
  const drawerOpenButtons = document.querySelectorAll("[data-drawer-open]");
  const page = body.dataset.page;

  const setActiveNav = () => {
    document.querySelectorAll(".desktop-nav a, .menu-overlay__nav a").forEach((link) => {
      const href = link.getAttribute("href");
      const match =
        (page === "home" && href === "index.html") ||
        (page === "services" && href === "services.html") ||
        (page === "service-detail" && href === "service-detail.html") ||
        (page === "about" && href === "about.html") ||
        (page === "contact" && href === "contact.html") ||
        (page === "privacy" && href === "privacy.html") ||
        (page === "terms" && href === "terms.html");

      if (match) {
        link.classList.add("is-active");
      }
    });
  };

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  const openMenu = () => {
    if (!menuOverlay || !menuToggle) return;
    body.classList.add("menu-open");
    menuOverlay.classList.add("is-open");
    menuOverlay.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");
  };

  const closeMenu = () => {
    if (!menuOverlay || !menuToggle) return;
    body.classList.remove("menu-open");
    menuOverlay.classList.remove("is-open");
    menuOverlay.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  const initMenu = () => {
    if (!menuOverlay || !menuToggle) return;

    closeTriggers.forEach((trigger) => trigger.addEventListener("click", closeMenu));
    menuOverlay.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  };

  const initContactDrawer = () => {
    if (!contactDrawer) return;

    const closeButtons = contactDrawer.querySelectorAll("[data-drawer-close]");

    const openDrawer = () => {
      body.classList.add("drawer-open");
      contactDrawer.classList.add("is-open");
      contactDrawer.setAttribute("aria-hidden", "false");
      menuToggle?.setAttribute("aria-expanded", "true");
    };

    const closeDrawer = () => {
      body.classList.remove("drawer-open");
      contactDrawer.classList.remove("is-open");
      contactDrawer.setAttribute("aria-hidden", "true");
      menuToggle?.setAttribute("aria-expanded", "false");
    };

    menuToggle?.addEventListener("click", () => {
      if (body.classList.contains("menu-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    drawerOpenButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        if (body.classList.contains("drawer-open")) {
          closeDrawer();
          return;
        }
        openDrawer();
      });
    });

    closeButtons.forEach((button) => button.addEventListener("click", closeDrawer));

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        closeDrawer();
      }
    });

    window.addEventListener("resize", () => {
      if (body.classList.contains("drawer-open")) {
        closeDrawer();
      }
      if (window.innerWidth > 1024) {
        closeMenu();
      }
    });
  };

  const initModal = () => {
    if (!modal) return;

    const openButtons = document.querySelectorAll("[data-modal-open]");
    const closeButtons = modal.querySelectorAll("[data-modal-close]");
    const modalPanel = modal.querySelector(".contact-modal__panel");

    const openModal = () => {
      body.classList.add("modal-open");
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
    };

    const closeModal = () => {
      body.classList.remove("modal-open");
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
    };

    openButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        openModal();
      });
    });

    closeButtons.forEach((button) => {
      button.addEventListener("click", closeModal);
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    });

    modalPanel?.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    const params = new URLSearchParams(window.location.search);
    if (params.get("status")) {
      openModal();
    }
  };

  const initFaq = () => {
    document.querySelectorAll(".faq-trigger").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const item = trigger.closest(".faq-item");
        const isOpen = item.classList.contains("is-open");

        document.querySelectorAll(".faq-item").forEach((entry) => {
          entry.classList.remove("is-open");
          entry.querySelector(".faq-trigger")?.setAttribute("aria-expanded", "false");
        });

        if (!isOpen) {
          item.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
        }
      });
    });
  };

  const initValueTabs = () => {
    const tabButtons = document.querySelectorAll("[data-value-tab]");
    const panels = document.querySelectorAll("[data-value-panel]");

    if (!tabButtons.length || !panels.length) return;

    const activateTab = (target) => {
      tabButtons.forEach((button) => {
        const isActive = button.dataset.valueTab === target;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-selected", String(isActive));
      });

      panels.forEach((panel) => {
        const isActive = panel.dataset.valuePanel === target;
        panel.classList.toggle("is-active", isActive);
        panel.hidden = !isActive;
      });
    };

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => activateTab(button.dataset.valueTab));
    });
  };

  const initContactForm = () => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    if (!status) return;

    const messages = {
      success: "Your request has been sent successfully. Our team will review it and reply by email.",
      error: "We could not send your request right now. Please try again in a moment.",
      invalid: "Please enter a valid email address and try again."
    };

    document.querySelectorAll(".contact-form").forEach((form) => {
      let statusNode = form.querySelector(".form-status");
      if (!statusNode) {
        statusNode = document.createElement("p");
        statusNode.className = "form-status";
        form.appendChild(statusNode);
      }

      statusNode.textContent = messages[status] || messages.error;
    });
  };

  const initCountups = () => {
    const counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const formatValue = (value, suffix = "") => `${Math.round(value).toLocaleString("en-US")}${suffix}`;

    const animateCounter = (node) => {
      const target = Number(node.dataset.count || 0);
      const suffix = node.dataset.suffix || "";

      if (!target) {
        node.textContent = formatValue(target, suffix);
        return;
      }

      if (reducedMotion) {
        node.textContent = formatValue(target, suffix);
        return;
      }

      const duration = 1400;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        node.textContent = formatValue(target * eased, suffix);

        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };

      window.requestAnimationFrame(step);
    };

    const seen = new WeakSet();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || seen.has(entry.target)) return;
          seen.add(entry.target);
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.45 }
    );

    counters.forEach((node) => observer.observe(node));
  };

  const initTestimonials = () => {
    const root = document.querySelector("[data-testimonials]");
    if (!root) return;

    const items = Array.from(root.querySelectorAll("[data-testimonial-item]"));
    const prev = root.querySelector("[data-testimonial-prev]");
    const next = root.querySelector("[data-testimonial-next]");
    if (!items.length || !prev || !next) return;

    let activeIndex = items.findIndex((item) => item.classList.contains("is-active"));
    if (activeIndex < 0) activeIndex = 0;

    const render = () => {
      items.forEach((item, index) => {
        const isActive = index === activeIndex;
        item.classList.toggle("is-active", isActive);
        item.hidden = !isActive;
      });
    };

    prev.addEventListener("click", () => {
      activeIndex = (activeIndex - 1 + items.length) % items.length;
      render();
    });

    next.addEventListener("click", () => {
      activeIndex = (activeIndex + 1) % items.length;
      render();
    });

    render();
  };

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  setActiveNav();
  setHeaderState();
  initMenu();
  initContactDrawer();
  initModal();
  initFaq();
  initValueTabs();
  initContactForm();
  initCountups();
  initTestimonials();

  if (window.lucide) {
    window.lucide.createIcons();
  }

  window.addEventListener("scroll", setHeaderState, { passive: true });
});
