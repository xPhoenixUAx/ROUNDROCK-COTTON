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

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  setActiveNav();
  setHeaderState();
  initMenu();
  initContactDrawer();
  initModal();
  initFaq();
  initContactForm();

  if (window.lucide) {
    window.lucide.createIcons();
  }

  window.addEventListener("scroll", setHeaderState, { passive: true });
});
