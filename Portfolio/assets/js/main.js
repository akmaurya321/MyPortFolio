const root = document.documentElement;
const header = document.getElementById("header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.getElementById("site-menu");
const navLinks = document.querySelectorAll(".site-nav__link");
const themeToggle = document.getElementById("theme-toggle");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const copyButton = document.getElementById("copy-email");
const currentYear = document.getElementById("current-year");

const fallbackCopyText = (value) => {
  const helper = document.createElement("textarea");
  helper.value = value;
  helper.setAttribute("readonly", "");
  helper.style.position = "absolute";
  helper.style.left = "-9999px";
  document.body.appendChild(helper);
  helper.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(helper);
  return copied;
};

const updateThemeLabel = (theme) => {
  if (!themeToggle) return;
  const nextTheme = theme === "dark" ? "light" : "dark";
  themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
  themeToggle.setAttribute("title", `Switch to ${nextTheme} mode`);
};

const setTheme = (theme) => {
  root.dataset.theme = theme;
  localStorage.setItem("portfolio-theme", theme);
  updateThemeLabel(theme);
};

const closeMenu = () => {
  if (!navMenu || !navToggle) return;
  navMenu.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
};

if (themeToggle) {
  updateThemeLabel(root.dataset.theme || "dark");

  themeToggle.addEventListener("click", () => {
    const currentTheme = root.dataset.theme === "light" ? "light" : "dark";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  });
}

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 920) {
      closeMenu();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

const updateActiveLink = () => {
  const scrollPosition = window.scrollY + 160;

  navLinks.forEach((link) => {
    const section = document.querySelector(link.getAttribute("href"));
    if (!section) return;

    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    const isActive = scrollPosition >= sectionTop && scrollPosition < sectionBottom;
    link.classList.toggle("is-active", isActive);
  });

  if (header) {
    header.classList.toggle("is-scrolled", window.scrollY > 18);
  }
};

updateActiveLink();
window.addEventListener("scroll", updateActiveLink, { passive: true });

if (revealItems.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "Thanks for reaching out. This form is ready to connect to a backend service when you want to make it live.";
    contactForm.reset();
  });
}

if (copyButton && formStatus) {
  copyButton.addEventListener("click", async () => {
    const email = copyButton.dataset.email;
    if (!email) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else if (!fallbackCopyText(email)) {
        throw new Error("Copy failed");
      }

      formStatus.textContent = "Email copied. You can paste it anywhere.";
    } catch (error) {
      formStatus.textContent = "Copy failed. Please use the email link instead.";
    }
  });
}

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}
