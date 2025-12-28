// ===== DOM ELEMENTS =====
const header = document.getElementById("header");
const contactForm = document.getElementById("contactForm");
const skillBars = document.querySelectorAll(".skill-progress");
const allSections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".nav-links a");

// ===== HEADER SCROLL EFFECT =====
function handleHeaderScroll() {
  if (window.scrollY > 100) {
    header.classList.add("header-scrolled");
  } else {
    header.classList.remove("header-scrolled");
  }
}

// ===== ACTIVE NAV LINK ON SCROLL =====
function updateActiveNavLink() {
  let current = "";

  allSections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navItems.forEach((item) => {
    item.classList.remove("active");
    if (item.getAttribute("href") === `#${current}`) {
      item.classList.add("active");
    }
  });
}

// ===== ANIMATE SKILL BARS ON SCROLL =====
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top <=
      (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
    rect.bottom >= 0
  );
}

function animateSkillBars() {
  skillBars.forEach((bar) => {
    const width = bar.getAttribute("data-width");
    if (isElementInViewport(bar) && bar.style.width === "0px") {
      bar.style.width = width + "%";
    }
  });
}

// ===== SET VIEWPORT HEIGHT FOR MOBILE =====
function setViewportHeight() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

// ===== SMOOTH SCROLLING =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Update URL without page reload
        history.pushState(null, null, targetId);
      }
    });
  });
}

// ===== FORM SUBMISSION =====
async function handleFormSubmit(e) {
  e.preventDefault();

  const submitBtn = this.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  const originalBg = submitBtn.style.background;

  // Show loading state
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SENDING...';
  submitBtn.disabled = true;
  submitBtn.style.cursor = "not-allowed";

  try {
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    // Simulate API call with delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Show success state
    submitBtn.innerHTML = '<i class="fas fa-check"></i> SENT!';
    submitBtn.style.background = "#28a745";

    // Reset form and button after delay
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      submitBtn.style.background = originalBg;
      submitBtn.style.cursor = "";
      this.reset();

      // Show success notification
      showNotification(
        "Message sent successfully! Alexandre will respond shortly.",
        "success"
      );
    }, 2000);
  } catch (error) {
    // Show error state
    submitBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> ERROR';
    submitBtn.style.background = "#dc3545";

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      submitBtn.style.background = originalBg;
      submitBtn.style.cursor = "";

      showNotification("Failed to send message. Please try again.", "error");
    }, 2000);
  }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = "success") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notification) => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  });

  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;

  // Set styles
  Object.assign(notification.style, {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    background:
      type === "success" ? "rgba(10, 10, 10, 0.95)" : "rgba(220, 53, 69, 0.95)",
    color: type === "success" ? "var(--accent)" : "#fff",
    padding: "20px 30px",
    border: `1px solid ${type === "success" ? "var(--accent)" : "#dc3545"}`,
    borderRadius: "8px",
    zIndex: "10000",
    transform: "translateY(100px)",
    opacity: "0",
    transition: "all 0.5s ease",
    fontWeight: "600",
    maxWidth: "300px",
    fontFamily: '"Space Grotesk", sans-serif',
    letterSpacing: "1px",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    boxShadow: "0 20px 50px rgba(0, 119, 255, 0.2)",
    pointerEvents: "none",
  });

  notification.textContent = message;
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateY(0)";
    notification.style.opacity = "1";
  }, 10);

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = "translateY(100px)";
    notification.style.opacity = "0";
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 500);
  }, 5000);
}

// ===== UPDATE SECTION NUMBERS =====
function updateSectionNumbers() {
  const sectionTitles = document.querySelectorAll(".section-title");
  sectionTitles.forEach((title, index) => {
    const number = title.querySelector(".title-number");
    if (number) {
      const num = index + 1;
      number.textContent = num.toString().padStart(2, "0");
    }
  });
}

// ===== DETECT TOUCH DEVICE =====
function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

// ===== OPTIMIZE FOR TOUCH DEVICES =====
function optimizeForTouch() {
  if (isTouchDevice()) {
    document.body.classList.add("touch-device");

    // Add touch-specific optimizations
    const style = document.createElement("style");
    style.textContent = `
            .touch-device .btn:hover,
            .touch-device .stat-card:hover,
            .touch-device .career-card:hover,
            .touch-device .achievement-card:hover {
                transform: none !important;
            }
        `;
    document.head.appendChild(style);
  }
}

// ===== LAZY LOAD IMAGES =====
function lazyLoadImages() {
  const images = document.querySelectorAll("img");

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
        }
        observer.unobserve(img);
      }
    });
  });

  images.forEach((img) => {
    if (img.complete) return;
    imageObserver.observe(img);
  });
}

// ===== INITIALIZE AOS =====
function initAOS() {
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      mirror: false,
      disable: function () {
        return window.innerWidth < 768;
      },
    });
  }
}

// ===== EVENT LISTENERS =====
function initEventListeners() {
  // Mobile menu toggle
  mobileMenuBtn.addEventListener("click", toggleMobileMenu);
  mobileMenuBtn.addEventListener("keypress", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      toggleMobileMenu();
    }
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      navLinks.classList.contains("active") &&
      !navLinks.contains(e.target) &&
      !mobileMenuBtn.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });

  // Close mobile menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("active")) {
      closeMobileMenu();
    }
  });

  // Header scroll effect
  window.addEventListener("scroll", handleHeaderScroll);

  // Update active nav link on scroll
  window.addEventListener("scroll", updateActiveNavLink);

  // Animate skill bars on scroll
  window.addEventListener("scroll", animateSkillBars);

  // Form submission
  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit);
  }

  // Initialize smooth scrolling
  initSmoothScroll();

  // Set viewport height on resize
  window.addEventListener("resize", setViewportHeight);

  // Set viewport height on orientation change
  window.addEventListener("orientationchange", setViewportHeight);

  // Optimize for touch devices
  optimizeForTouch();
}

// ===== INITIALIZE ON DOM CONTENT LOADED =====
document.addEventListener("DOMContentLoaded", () => {
  console.log("Football Portfolio loaded successfully!");

  // Initialize all components
  initAOS();
  initEventListeners();
  updateSectionNumbers();
  setViewportHeight();
  optimizeForTouch();
  lazyLoadImages();

  // Initial checks
  handleHeaderScroll();
  updateActiveNavLink();
  animateSkillBars(); // Initial check for skill bars in viewport
});

// ===== WINDOW LOAD EVENT =====
window.addEventListener("load", () => {
  // Additional initialization after all resources are loaded
  console.log("All resources loaded");

  // Remove loading state if any
  document.body.classList.add("loaded");

  // Initialize animations that depend on loaded resources
  setTimeout(() => {
    const heroImage = document.querySelector(".hero-image img");
    if (heroImage) {
      heroImage.style.opacity = "1";
    }
  }, 500);
});

// ===== ERROR HANDLING =====
window.addEventListener("error", (e) => {
  console.error("Error occurred:", e.error);
});

// ===== OFFLINE SUPPORT =====
window.addEventListener("offline", () => {
  showNotification(
    "You are currently offline. Some features may not work.",
    "warning"
  );
});

window.addEventListener("online", () => {
  showNotification("You are back online!", "success");
});

// ===== SERVICE WORKER REGISTRATION (FOR PWA) =====
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("ServiceWorker registration successful");
      })
      .catch((error) => {
        console.log("ServiceWorker registration failed:", error);
      });
  });
}
