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
        (page === "service-detail" && href === "index.html#services-preview") ||
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

  const initGsapMotion = () => {
    if (!window.gsap) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const { gsap } = window;
    const ScrollTrigger = window.ScrollTrigger;

    if (ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    gsap.defaults({
      ease: "power2.out",
      duration: 1
    });

    const heroTitle = document.querySelector(".split-text");
    const heroCrumbs = document.querySelector(
      ".hero-copy__lead, .service-hero__crumbs, .about-hero__crumbs, .contact-hero__crumbs, .legal-crumbs"
    );
    const heroLead = document.querySelector(
      ".hero-copy__lead, .service-hero__copy > p.reveal, .about-hero__copy > p.reveal, .contact-hero__copy > p.reveal, .legal-meta"
    );
    const heroActions = document.querySelector(".hero-actions, .contact-form-panel");
    const introTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (heroCrumbs) {
      introTimeline.from(heroCrumbs, {
        y: 18,
        opacity: 0,
        duration: 0.6
      });
    }

    if (heroTitle) {
      introTimeline.fromTo(
        heroTitle,
        {
          autoAlpha: 0,
          x: -34,
          y: 18
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          duration: 1
        },
        heroCrumbs ? "-=0.15" : 0
      );
    }

    if (heroLead) {
      introTimeline.fromTo(
        heroLead,
        {
          autoAlpha: 0,
          x: -20,
          y: 16
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          duration: 0.85
        },
        "-=0.45"
      );
    }

    if (heroActions) {
      introTimeline.fromTo(
        heroActions,
        {
          autoAlpha: 0,
          y: 20
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8
        },
        "-=0.45"
      );
    }

    const heroMediaItems = gsap.utils.toArray(
      ".hero-photo--left, .hero-photo--right, .service-hero__panel, .credibility-review, .who-we-are__media, .testimonials-section__visual"
    );

    heroMediaItems.forEach((node, index) => {
      introTimeline.fromTo(
        node,
        {
          autoAlpha: 0,
          x: index % 2 === 0 ? -26 : 26,
          y: 18
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          duration: 0.95
        },
        "-=0.6"
      );
    });

    const reservedNodes = new Set(
      [heroCrumbs, heroLead, heroActions, heroTitle, ...heroMediaItems].filter(Boolean)
    );

    const revealNodes = gsap
      .utils.toArray("[data-reveal]")
      .filter((node) => !node.closest(".cookie-consent") && !reservedNodes.has(node));

    revealNodes.forEach((node) => {
      const revealType = node.dataset.reveal || "fade-up";
      const vars = {
        autoAlpha: 0,
        duration: 0.95,
        ease: "power2.out"
      };

      if (revealType === "fade-left") {
        vars.x = 42;
        vars.y = 0;
      } else if (revealType === "fade-right") {
        vars.x = -42;
        vars.y = 0;
      } else {
        vars.x = 0;
        vars.y = 34;
      }

      if (ScrollTrigger) {
        gsap.fromTo(
          node,
          vars,
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            duration: 1,
            ease: "power2.out",
            clearProps: "transform,opacity,visibility",
            scrollTrigger: {
              trigger: node,
              start: "top 88%",
              once: true
            }
          }
        );
      } else {
        gsap.fromTo(
          node,
          vars,
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            duration: 1,
            ease: "power2.out",
            clearProps: "transform,opacity,visibility"
          }
        );
      }
    });

    const ornamental = gsap.utils.toArray(
      ".hero-rings, .hero-grid-dots, .hero-dots--right, .hero-social, .hero-accent, .proof-band__orbit"
    );

    ornamental.forEach((node, index) => {
      gsap.to(node, {
        y: index % 2 === 0 ? -8 : 8,
        x: index % 3 === 0 ? 4 : -4,
        duration: 5.4 + index * 0.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });

    const ctaButtons = gsap.utils.toArray(".hero-cta, .pricing-card__cta, .contact-submit");
    ctaButtons.forEach((button) => {
      const icon = button.querySelector(
        ".hero-cta__icon, .pricing-card__cta-icon, .contact-submit__icon"
      );

      button.addEventListener("mouseenter", () => {
        gsap.to(button, { y: -2, duration: 0.22, ease: "power2.out" });
        if (icon) {
          gsap.to(icon, { x: 4, duration: 0.22, ease: "power2.out" });
        }
      });

      button.addEventListener("mouseleave", () => {
        gsap.to(button, { y: 0, duration: 0.22, ease: "power2.out" });
        if (icon) {
          gsap.to(icon, { x: 0, duration: 0.22, ease: "power2.out" });
        }
      });
    });
  };

  const initCookieConsent = () => {
    const storageKey = "rr_cookie_consent_v1";

    const readPreferences = () => {
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return {
          essential: true,
          analytics: Boolean(parsed.analytics),
          marketing: Boolean(parsed.marketing),
          updatedAt: parsed.updatedAt || null
        };
      } catch (error) {
        return null;
      }
    };

    const applyPreferences = (preferences) => {
      body.dataset.cookieAnalytics = String(Boolean(preferences.analytics));
      body.dataset.cookieMarketing = String(Boolean(preferences.marketing));

      window.dispatchEvent(
        new CustomEvent("cookieconsentchange", {
          detail: preferences
        })
      );
    };

    const savePreferences = (preferences) => {
      const payload = {
        essential: true,
        analytics: Boolean(preferences.analytics),
        marketing: Boolean(preferences.marketing),
        updatedAt: new Date().toISOString()
      };

      try {
        window.localStorage.setItem(storageKey, JSON.stringify(payload));
      } catch (error) {
        // Ignore storage errors and still apply the current choice for the session.
      }

      applyPreferences(payload);
      return payload;
    };

    const root = document.createElement("div");
    root.className = "cookie-consent";
    root.setAttribute("aria-hidden", "true");
    root.innerHTML = `
      <div class="cookie-consent__overlay" data-cookie-close></div>
      <div class="cookie-consent__banner" role="dialog" aria-modal="false" aria-labelledby="cookieBannerTitle">
        <p class="cookie-consent__eyebrow">Cookie Settings</p>
        <h2 id="cookieBannerTitle">We use cookies to keep the site useful and measure what is working.</h2>
        <p class="cookie-consent__text">Essential cookies keep the site functional. With your permission, we also use analytics and marketing cookies to understand performance and improve campaigns. Read more in our <a href="cookies.html">Cookie Policy</a>.</p>
        <div class="cookie-consent__actions">
          <button class="cookie-consent__button cookie-consent__button--ghost" type="button" data-cookie-reject>Reject optional</button>
          <button class="cookie-consent__button cookie-consent__button--secondary" type="button" data-cookie-manage>Manage choices</button>
          <button class="cookie-consent__button cookie-consent__button--primary" type="button" data-cookie-accept>Accept all</button>
        </div>
      </div>
      <div class="cookie-consent__panel" role="dialog" aria-modal="true" aria-labelledby="cookiePanelTitle" hidden>
        <div class="cookie-consent__panel-top">
          <div>
            <p class="cookie-consent__eyebrow">Cookie Preferences</p>
            <h2 id="cookiePanelTitle">Choose which cookies you want to allow.</h2>
          </div>
          <button class="cookie-consent__close" type="button" aria-label="Close cookie preferences" data-cookie-close>&times;</button>
        </div>
        <p class="cookie-consent__text">You can update these choices at any time. Essential cookies stay enabled because the website depends on them to work correctly.</p>
        <div class="cookie-consent__options">
          <label class="cookie-option">
            <span class="cookie-option__copy">
              <strong>Essential cookies</strong>
              <small>Required for security, navigation, and form delivery.</small>
            </span>
            <span class="cookie-option__switch">
              <input type="checkbox" checked disabled>
              <span></span>
            </span>
          </label>
          <label class="cookie-option">
            <span class="cookie-option__copy">
              <strong>Analytics cookies</strong>
              <small>Help us understand visits, page usage, and website performance.</small>
            </span>
            <span class="cookie-option__switch">
              <input type="checkbox" data-cookie-analytics>
              <span></span>
            </span>
          </label>
          <label class="cookie-option">
            <span class="cookie-option__copy">
              <strong>Marketing cookies</strong>
              <small>Support campaign measurement, ad attribution, and remarketing.</small>
            </span>
            <span class="cookie-option__switch">
              <input type="checkbox" data-cookie-marketing>
              <span></span>
            </span>
          </label>
        </div>
        <div class="cookie-consent__panel-actions">
          <button class="cookie-consent__button cookie-consent__button--ghost" type="button" data-cookie-reject-panel>Reject optional</button>
          <button class="cookie-consent__button cookie-consent__button--secondary" type="button" data-cookie-save>Save preferences</button>
          <button class="cookie-consent__button cookie-consent__button--primary" type="button" data-cookie-accept-panel>Accept all</button>
        </div>
      </div>
    `;

    body.appendChild(root);

    const banner = root.querySelector(".cookie-consent__banner");
    const panel = root.querySelector(".cookie-consent__panel");
    const analyticsToggle = root.querySelector("[data-cookie-analytics]");
    const marketingToggle = root.querySelector("[data-cookie-marketing]");
    const footerLinks = document.querySelectorAll(".footer-bottom div");

    footerLinks.forEach((group) => {
      if (group.querySelector("[data-cookie-open]")) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "footer-cookie-link";
      button.dataset.cookieOpen = "true";
      button.textContent = "Cookie Settings";
      group.appendChild(button);
    });

    let preferences = readPreferences();

    const syncInputs = () => {
      analyticsToggle.checked = Boolean(preferences?.analytics);
      marketingToggle.checked = Boolean(preferences?.marketing);
    };

    const showBanner = () => {
      root.classList.add("is-visible");
      root.classList.remove("is-settings-open");
      root.setAttribute("aria-hidden", "false");
      banner.hidden = false;
      panel.hidden = true;
    };

    const openPanel = () => {
      root.classList.add("is-visible", "is-settings-open");
      root.setAttribute("aria-hidden", "false");
      banner.hidden = true;
      panel.hidden = false;
      syncInputs();
    };

    const closeConsentUi = (hasSavedPreferences = Boolean(preferences)) => {
      root.classList.remove("is-settings-open");
      panel.hidden = true;

      if (hasSavedPreferences) {
        root.classList.remove("is-visible");
        root.setAttribute("aria-hidden", "true");
        banner.hidden = false;
        return;
      }

      banner.hidden = false;
      root.classList.add("is-visible");
      root.setAttribute("aria-hidden", "false");
    };

    const acceptAll = () => {
      preferences = savePreferences({ analytics: true, marketing: true });
      closeConsentUi(true);
    };

    const rejectOptional = () => {
      preferences = savePreferences({ analytics: false, marketing: false });
      closeConsentUi(true);
    };

    const saveFromPanel = () => {
      preferences = savePreferences({
        analytics: analyticsToggle.checked,
        marketing: marketingToggle.checked
      });
      closeConsentUi(true);
    };

    root.querySelector("[data-cookie-accept]")?.addEventListener("click", acceptAll);
    root.querySelector("[data-cookie-accept-panel]")?.addEventListener("click", acceptAll);
    root.querySelector("[data-cookie-reject]")?.addEventListener("click", rejectOptional);
    root.querySelector("[data-cookie-reject-panel]")?.addEventListener("click", rejectOptional);
    root.querySelector("[data-cookie-manage]")?.addEventListener("click", openPanel);
    root.querySelector("[data-cookie-save]")?.addEventListener("click", saveFromPanel);
    root.querySelectorAll("[data-cookie-close]")?.forEach((button) => {
      button.addEventListener("click", closeConsentUi);
    });

    document.querySelectorAll("[data-cookie-open]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        openPanel();
      });
    });

    if (preferences) {
      applyPreferences(preferences);
      root.classList.remove("is-visible");
      root.setAttribute("aria-hidden", "true");
      banner.hidden = false;
      panel.hidden = true;
    } else {
      showBanner();
    }
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
  initGsapMotion();
  initCookieConsent();

  if (window.lucide) {
    window.lucide.createIcons();
  }

  window.addEventListener("scroll", setHeaderState, { passive: true });
});
