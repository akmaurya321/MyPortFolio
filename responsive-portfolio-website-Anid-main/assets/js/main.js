const header = document.getElementById("header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.getElementById("site-menu");
const navLinks = document.querySelectorAll(".site-nav__link");
const revealItems = document.querySelectorAll(".reveal");
const copyButton = document.getElementById("copy-email");
const copyStatus = document.getElementById("copy-status");
const currentYear = document.getElementById("current-year");

const fallbackCopyText = (value) => {
  const helper = document.createElement("textarea");
  helper.value = value;
  helper.setAttribute("readonly", "");
  helper.style.position = "absolute";
  helper.style.left = "-9999px";
  document.body.appendChild(helper);
  helper.select();

  const didCopy = document.execCommand("copy");
  document.body.removeChild(helper);
  return didCopy;
};

const closeMenu = () => {
  if (!navMenu || !navToggle) return;

  navMenu.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
};

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
    if (window.innerWidth >= 860) {
      closeMenu();
    }
  });
}

const setActiveLink = () => {
  const scrollPosition = window.scrollY + 140;

  navLinks.forEach((link) => {
    const section = document.querySelector(link.getAttribute("href"));
    if (!section) return;

    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    const isActive = scrollPosition >= sectionTop && scrollPosition < sectionBottom;
    link.classList.toggle("is-active", isActive);
  });

  if (header) {
    header.classList.toggle("is-scrolled", window.scrollY > 16);
  }
};

setActiveLink();
window.addEventListener("scroll", setActiveLink);

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
      threshold: 0.2,
      rootMargin: "0px 0px -60px 0px",
    },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

if (copyButton && copyStatus) {
  copyButton.addEventListener("click", async () => {
    const email = copyButton.dataset.email;
    if (!email) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else if (!fallbackCopyText(email)) {
        throw new Error("Fallback copy failed");
      }
      copyStatus.textContent = "Email copied. You can paste it anywhere.";
    } catch (error) {
      copyStatus.textContent = "Copy failed. Please use the email link instead.";
    }
  });
}

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}
