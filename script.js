// Wait for page to load
document.addEventListener("DOMContentLoaded", function () {
  // Initialize the application
  initApp();
});

function initApp() {
  // Hide loading screen after 1.5 seconds
  setTimeout(() => {
    document.getElementById("loadingScreen").classList.add("hidden");
  }, 1500);

  // Initialize all components
  initNavbar();
  initForm();
  initProductCards();
  initSmoothScroll();
  initBackToTop();
  initAnimations();
  initParallax();
}

// Navbar functionality
function initNavbar() {
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll(".nav-link");

  // Navbar scroll effect
  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Update active nav link based on scroll position
    const sections = document.querySelectorAll("section");
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - 150) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}

// Form functionality
function initForm() {
  const rentalForm = document.getElementById("rentalForm");
  const submitBtn = document.getElementById("submitBtn");
  const resetBtn = document.getElementById("resetBtn");
  const newRequestBtn = document.getElementById("newRequestBtn");
  const successMessage = document.getElementById("successMessage");
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");

  // Set minimum date for rental form
  const today = new Date().toISOString().split("T")[0];
  startDateInput.setAttribute("min", today);
  endDateInput.setAttribute("min", today);

  // Update end date min when start date changes
  startDateInput.addEventListener("change", function () {
    endDateInput.setAttribute("min", this.value);
  });

  // Form submission handling
  rentalForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      product: document.getElementById("product").value,
      startDate: document.getElementById("startDate").value,
      endDate: document.getElementById("endDate").value,
      message: document.getElementById("message").value.trim(),
    };

    // Validate form
    if (!validateForm(formData)) {
      return;
    }

    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin me-2"></i> Mengirim...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      // Hide form and show success message
      rentalForm.style.display = "none";
      successMessage.style.display = "block";

      // Add animation
      successMessage.classList.add("animate__animated", "animate__fadeIn");

      // Reset button state
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;

      // Create confetti effect
      createConfetti();

      // Show success alert
      showAlert(
        "Permintaan sewa berhasil dikirim! Tim kami akan menghubungi Anda dalam 1 jam.",
        "success"
      );
    }, 1500);
  });

  // Reset form button
  resetBtn.addEventListener("click", function () {
    rentalForm.reset();
    startDateInput.setAttribute("min", today);
    endDateInput.setAttribute("min", today);

    // Add animation
    this.classList.add("animate__animated", "animate__pulse");
    setTimeout(() => {
      this.classList.remove("animate__animated", "animate__pulse");
    }, 1000);

    showAlert("Form telah direset. Silakan isi kembali.", "warning");
  });

  // New request button
  newRequestBtn.addEventListener("click", function () {
    // Hide success message and show form
    successMessage.style.display = "none";
    rentalForm.style.display = "block";
    rentalForm.reset();

    // Reset date inputs
    startDateInput.setAttribute("min", today);
    endDateInput.setAttribute("min", today);

    // Add animation
    rentalForm.classList.add("animate__animated", "animate__fadeIn");
    setTimeout(() => {
      rentalForm.classList.remove("animate__animated", "animate__fadeIn");
    }, 1000);

    // Focus on first input
    document.getElementById("name").focus();
  });
}

// Product cards functionality
function initProductCards() {
  // Product rent buttons
  document.querySelectorAll(".rent-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const productName = this.getAttribute("data-product");
      const productSelect = document.getElementById("product");

      // Add click animation
      this.classList.add("animate__animated", "animate__pulse");
      setTimeout(() => {
        this.classList.remove("animate__animated", "animate__pulse");
      }, 1000);

      // Set the product in the form
      for (let i = 0; i < productSelect.options.length; i++) {
        if (productSelect.options[i].value === productName) {
          productSelect.selectedIndex = i;
          break;
        }
      }

      // Scroll to the rental form
      smoothScrollTo("#rent", 1200);

      // Focus on the first input with animation
      setTimeout(() => {
        const nameInput = document.getElementById("name");
        nameInput.focus();
        nameInput.classList.add("animate__animated", "animate__pulse");
        setTimeout(() => {
          nameInput.classList.remove("animate__animated", "animate__pulse");
        }, 1000);
      }, 1300);
    });
  });

  // Add hover effects to product cards
  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)";
      this.style.boxShadow = "0 25px 60px rgba(0, 0, 0, 0.15)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
      this.style.boxShadow = "0 15px 40px rgba(0, 0, 0, 0.08)";
    });
  });
}

// Smooth scrolling functionality
function initSmoothScroll() {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");

      if (targetId === "#") return;

      e.preventDefault();
      smoothScrollTo(targetId, 1000);

      // Update active nav link
      document.querySelectorAll(".nav-link").forEach((link) => {
        link.classList.remove("active");
      });
      this.classList.add("active");

      // Close mobile navbar if open
      const navbarToggler = document.querySelector(".navbar-toggler");
      const navbarCollapse = document.querySelector(".navbar-collapse");

      if (navbarCollapse && navbarCollapse.classList.contains("show")) {
        navbarToggler.click();
      }
    });
  });
}

// Back to top functionality
function initBackToTop() {
  const backToTop = document.getElementById("backToTop");

  // Show/hide back to top button on scroll
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      backToTop.classList.add("active");
    } else {
      backToTop.classList.remove("active");
    }
  });

  // Back to top button click
  backToTop.addEventListener("click", function (e) {
    e.preventDefault();
    smoothScrollTo("#home", 800);
  });
}

// Animations initialization
function initAnimations() {
  // Add animation to elements when they come into view
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate__animated", "animate__fadeInUp");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe product cards
  document.querySelectorAll(".product-card").forEach((card) => {
    observer.observe(card);
  });

  // Observe feature cards
  document.querySelectorAll(".feature-card").forEach((card) => {
    observer.observe(card);
  });

  // Observe testimonial cards
  document.querySelectorAll(".testimonial-card").forEach((card) => {
    observer.observe(card);
  });

  // Highlight text animation on scroll
  const highlights = document.querySelectorAll(".highlight");
  const highlightObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    { threshold: 0.5 }
  );

  highlights.forEach((highlight) => {
    highlightObserver.observe(highlight);
  });
}

// Parallax effect
function initParallax() {
  // Add parallax effect to floating elements on scroll
  window.addEventListener("scroll", function () {
    const scrolled = window.pageYOffset;
    const float1 = document.querySelector(".float-1");
    const float2 = document.querySelector(".float-2");
    const float3 = document.querySelector(".float-3");

    if (float1)
      float1.style.transform = `translateY(${scrolled * 0.05}px) rotate(${
        scrolled * 0.01
      }deg)`;
    if (float2)
      float2.style.transform = `translateY(${scrolled * 0.03}px) rotate(${
        scrolled * 0.02
      }deg)`;
    if (float3)
      float3.style.transform = `translateY(${scrolled * 0.07}px) rotate(${
        scrolled * 0.015
      }deg)`;
  });
}

// Helper Functions
function smoothScrollTo(target, duration = 1000) {
  const targetElement = document.querySelector(target);
  if (!targetElement) return;

  const targetPosition = targetElement.offsetTop - 80;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

function validateForm(formData) {
  // Check required fields
  if (
    !formData.name ||
    !formData.email ||
    !formData.phone ||
    !formData.product ||
    !formData.startDate ||
    !formData.endDate
  ) {
    showAlert("Harap lengkapi semua field yang wajib diisi!", "warning");
    return false;
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    showAlert("Format email tidak valid!", "warning");
    return false;
  }

  // Validate phone
  const phoneRegex = /^[0-9+\-\s]{10,15}$/;
  if (!phoneRegex.test(formData.phone)) {
    showAlert(
      "Format nomor telepon tidak valid! Harus 10-15 digit angka.",
      "warning"
    );
    return false;
  }

  // Validate dates
  const start = new Date(formData.startDate);
  const end = new Date(formData.endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (start < today) {
    showAlert("Tanggal mulai tidak boleh di masa lalu!", "warning");
    return false;
  }

  if (end <= start) {
    showAlert("Tanggal selesai harus setelah tanggal mulai!", "warning");
    return false;
  }

  return true;
}

function showAlert(message, type) {
  // Remove existing alerts
  const existingAlerts = document.querySelectorAll(".alert");
  existingAlerts.forEach((alert) => alert.remove());

  // Create alert element
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${
    type === "warning" ? "warning" : "success"
  } alert-dismissible fade show`;
  alertDiv.innerHTML = `
        <strong>${
          type === "warning" ? "⚠️ Peringatan!" : "✅ Sukses!"
        }</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

  // Add to body
  document.body.appendChild(alertDiv);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.parentNode.removeChild(alertDiv);
    }
  }, 5000);

  // Add shake animation to form if warning
  if (type === "warning") {
    const form = document.getElementById("rentalForm");
    form.classList.add("animate__animated", "animate__shakeX");
    setTimeout(() => {
      form.classList.remove("animate__animated", "animate__shakeX");
    }, 1000);
  }
}

function createConfetti() {
  const colors = ["#FF6B35", "#00B4D8", "#0A2463", "#FF9E00", "#10b981"];
  const container = document.querySelector(".rental-form-container");

  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement("div");
    confetti.style.position = "absolute";
    confetti.style.width = "10px";
    confetti.style.height = "10px";
    confetti.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = "50%";
    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.top = "-20px";
    confetti.style.zIndex = "9999";
    confetti.style.pointerEvents = "none";

    container.appendChild(confetti);

    // Animate confetti falling
    const animation = confetti.animate(
      [
        { transform: "translateY(0) rotate(0deg)", opacity: 1 },
        {
          transform: `translateY(${container.offsetHeight + 20}px) rotate(${
            Math.random() * 360
          }deg)`,
          opacity: 0,
        },
      ],
      {
        duration: 1000 + Math.random() * 1000,
        easing: "cubic-bezier(0.215, 0.610, 0.355, 1)",
      }
    );

    // Remove element after animation
    animation.onfinish = () => {
      if (confetti.parentNode) {
        confetti.parentNode.removeChild(confetti);
      }
    };
  }
}

// Add some additional interactivity
document.addEventListener("DOMContentLoaded", function () {
  // Add click sound effect to buttons (optional)
  const buttons = document.querySelectorAll(
    ".btn-custom, .rent-btn, .nav-link"
  );
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      // You can add a sound effect here if needed
      // For example: new Audio('click-sound.mp3').play();
    });
  });

  // Add hover effect to social icons
  const socialIcons = document.querySelectorAll(".social-icon");
  socialIcons.forEach((icon) => {
    icon.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px) scale(1.1)";
    });

    icon.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });
});
