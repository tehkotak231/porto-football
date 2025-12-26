// ===== DOM ELEMENTS =====
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.querySelector(".nav-links");
const header = document.getElementById("header");
const contactForm = document.getElementById("contactForm");
const skillBars = document.querySelectorAll(".skill-progress");

// ===== MOBILE MENU TOGGLE =====
function toggleMobileMenu() {
  navLinks.classList.toggle("active");
  const icon = mobileMenuBtn.querySelector("i");
  icon.className = navLinks.classList.contains("active")
    ? "fas fa-times"
    : "fas fa-bars";
}

// ===== CLOSE MOBILE MENU ON LINK CLICK =====
function closeMobileMenu() {
  navLinks.classList.remove("active");
  mobileMenuBtn.querySelector("i").className = "fas fa-bars";
}

// ===== HEADER SCROLL EFFECT =====
function handleHeaderScroll() {
  if (window.scrollY > 100) {
    header.classList.add("header-scrolled");
  } else {
    header.classList.remove("header-scrolled");
  }
}

// ===== ANIMATE SKILL BARS ON SCROLL =====
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function animateSkillBars() {
  skillBars.forEach((bar) => {
    const width = bar.getAttribute("data-width");
    if (isElementInViewport(bar)) {
      bar.style.width = width + "%";
    }
  });
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
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });

        // Close mobile menu if open
        if (navLinks.classList.contains("active")) {
          closeMobileMenu();
        }
      }
    });
  });
}

// ===== FORM SUBMISSION =====
async function handleFormSubmit(e) {
  e.preventDefault();

  const submitBtn = this.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;

  // Show loading state
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SENDING...';
  submitBtn.disabled = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Show success state
    submitBtn.innerHTML = '<i class="fas fa-check"></i> SENT!';
    submitBtn.style.background = "var(--accent-dark)";

    // Reset form and button after delay
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      submitBtn.style.background = "";
      this.reset();

      // Show notification
      showNotification(
        "Message sent successfully! Alexandre will respond shortly."
      );
    }, 2000);
  } catch (error) {
    // Show error state
    submitBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> ERROR';
    submitBtn.style.background = "#dc3545";

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      submitBtn.style.background = "";

      showNotification("Failed to send message. Please try again.", "error");
    }, 2000);
  }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;

  // Styles
  notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: ${
          type === "success"
            ? "rgba(10, 10, 10, 0.95)"
            : "rgba(220, 53, 69, 0.95)"
        };
        color: ${type === "success" ? "var(--accent)" : "#fff"};
        padding: 20px 30px;
        border: 1px solid ${type === "success" ? "var(--accent)" : "#dc3545"};
        border-radius: 8px;
        z-index: 10000;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.5s ease;
        font-weight: 600;
        max-width: 300px;
        font-family: 'Space Grotesk', sans-serif;
        letter-spacing: 1px;
        backdrop-filter: blur(10px);
        box-shadow: var(--shadow-lg);
    `;

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
  document.querySelectorAll(".section-title").forEach((title, index) => {
    const number = title.querySelector(".title-number");
    if (number) {
      const num = index + 1;
      number.textContent = num.toString().padStart(2, "0");
    }
  });
}

// ===== INITIALIZE AOS =====
function initAOS() {
  AOS.init({
    duration: 1000,
    once: false,
    offset: 100,
    mirror: true,
    disable: "mobile", // Disable on mobile for performance
  });
}

// ===== EVENT LISTENERS =====
function initEventListeners() {
  // Mobile menu toggle
  mobileMenuBtn.addEventListener("click", toggleMobileMenu);

  // Close mobile menu when clicking on a link
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // Header scroll effect
  window.addEventListener("scroll", handleHeaderScroll);

  // Animate skill bars on scroll
  window.addEventListener("scroll", animateSkillBars);

  // Form submission
  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit);
  }

  // Initialize smooth scrolling
  initSmoothScroll();
}

// ===== INITIALIZE ON DOM CONTENT LOADED =====
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  initAOS();
  initEventListeners();
  updateSectionNumbers();
  animateSkillBars(); // Initial check for skill bars

  // Initial header state
  handleHeaderScroll();
});

// ===== WINDOW LOAD EVENT =====
window.addEventListener("load", () => {
  // Additional initialization after all resources are loaded
  console.log("Football Portfolio loaded successfully!");
});
