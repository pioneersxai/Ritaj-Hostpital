/**
 * ===================================
 * RITAJ HOSPITAL - MAIN JAVASCRIPT
 * ===================================
 */

'use strict';

/**
 * ===================================
 * PAGE LOADER
 * ===================================
 */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 1000);
  }
});

/**
 * ===================================
 * NAVBAR SCROLL EFFECT
 * ===================================
 */
const navbar = document.getElementById('navbar');
const scrollTop = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  // Navbar background on scroll
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Scroll to top button visibility
  if (scrollTop) {
    if (window.scrollY > 300) {
      scrollTop.classList.add('visible');
    } else {
      scrollTop.classList.remove('visible');
    }
  }
});

/**
 * ===================================
 * MOBILE MENU TOGGLE
 * ===================================
 * FIX: this used to look for id="mobileMenu", but the actual button in
 * the HTML is id="hamburger". That mismatch made this whole script crash
 * with a TypeError on every single page (mobileMenu was null), which
 * silently killed everything defined AFTER this block too — smooth
 * scrolling, the scroll-to-top button, and the contact form's WhatsApp
 * handoff were all broken sitewide because of this one line.
 */
const mobileMenu = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (mobileMenu && navLinks) {
  mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');

    // Toggle icon
    const icon = mobileMenu.querySelector('i');
    if (icon) {
      if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    }
  });

  // Close mobile menu when clicking on a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const icon = mobileMenu.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  });
}

/**
 * ===================================
 * SMOOTH SCROLLING
 * ===================================
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);

    if (target) {
      e.preventDefault();
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

/**
 * ===================================
 * SCROLL TO TOP BUTTON
 * ===================================
 */
if (scrollTop) {
  scrollTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * ===================================
 * CONTACT FORM SUBMISSION
 * ===================================
 * FIX: the previous version read fields via FormData + `name` attributes,
 * but the actual form in contact.html (name, phone, subject select,
 * message — no email field) never had `name` attributes on its inputs at
 * all. FormData(contactForm) was always empty, so even once the
 * mobileMenu crash above is fixed, every submit would still fail
 * validation with "fill in all required fields" — 100% of the time, for
 * every visitor. This reads the actual fields directly instead.
 */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  const nameInput = contactForm.querySelector('input[type="text"]');
  const phoneInput = contactForm.querySelector('input[type="tel"]');
  const subjectSelect = contactForm.querySelector('select');
  const messageInput = contactForm.querySelector('textarea');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
      name: nameInput ? nameInput.value.trim() : '',
      phone: phoneInput ? phoneInput.value.trim() : '',
      subject: subjectSelect && subjectSelect.selectedOptions.length
        ? subjectSelect.selectedOptions[0].textContent.trim()
        : '',
      message: messageInput ? messageInput.value.trim() : ''
    };

    // Validate form
    if (!validateForm(data)) {
      return;
    }

    // Create WhatsApp message
    const message = createWhatsAppMessage(data);
    const waNumber = (typeof BRAND !== 'undefined') ? BRAND.whatsapp : '201503808877';
    const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    // Show success message
    showNotification('success', 'شكراً لتواصلك معنا! سيتم فتح واتساب لإكمال المحادثة.');

    // Reset form
    contactForm.reset();
  });
}

/**
 * Validate form data
 */
function validateForm(data) {
  // Check required fields (name, phone, message — subject always has a default)
  if (!data.name || !data.phone || !data.message) {
    showNotification('error', 'الرجاء ملء جميع الحقول المطلوبة');
    return false;
  }

  // Validate phone
  const phoneRegex = /^[0-9+\-\s()]+$/;
  if (!phoneRegex.test(data.phone)) {
    showNotification('error', 'الرجاء إدخال رقم هاتف صحيح');
    return false;
  }

  return true;
}

/**
 * Create WhatsApp message from form data
 */
function createWhatsAppMessage(data) {
  return `مرحباً، أريد التواصل معكم عبر موقع مستشفى ريتاج:

الاسم: ${data.name}
الهاتف: ${data.phone}
الموضوع: ${data.subject || 'استفسار عام'}
الرسالة: ${data.message}`;
}

/**
 * ===================================
 * NOTIFICATION SYSTEM
 * ===================================
 */
function showNotification(type, message) {
  // Remove existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      <span>${message}</span>
    </div>
  `;

  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    animation: slideInRight 0.3s ease;
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 400px;
  `;

  // Add to DOM
  document.body.appendChild(notification);

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

/**
 * ===================================
 * COUNTER ANIMATION FOR STATS
 * ===================================
 */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');

  counters.forEach(counter => {
    const target = counter.textContent;
    const isPercentage = target.includes('%');
    const isPlus = target.includes('+');
    const is247 = target.includes('/');

    // Extract numeric value
    const numericTarget = parseInt(target.replace(/[^\d]/g, ''));

    if (isNaN(numericTarget)) return;

    let current = 0;
    const increment = numericTarget / 50;
    const duration = 2000; // 2 seconds
    const stepTime = duration / 50;

    const timer = setInterval(() => {
      current += increment;

      if (current >= numericTarget) {
        counter.textContent = target;
        clearInterval(timer);
      } else {
        if (is247) {
          counter.textContent = '24/7';
        } else {
          counter.textContent = Math.floor(current) + (isPercentage ? '%' : isPlus ? '+' : '');
        }
      }
    }, stepTime);
  });
}

/**
 * ===================================
 * DYNAMIC YEAR IN FOOTER
 * ===================================
 */
// FIX: previously this overwrote the footer with a format that dropped the
// "PioneersX" credit line entirely. Now it just keeps the year current
// while preserving whatever credit format is already in the HTML.
const footerYear = document.querySelector('.footer-bottom p');
if (footerYear) {
  const currentYear = new Date().getFullYear();
  footerYear.textContent = footerYear.textContent.replace(/©\s*\d{4}/, `© ${currentYear}`);
}

/**
 * ===================================
 * DETECT USER COUNTRY FOR LOCALIZATION
 * ===================================
 */
async function detectUserCountry() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.country_code;
  } catch (error) {
    console.log('Could not detect country:', error);
    return 'EG'; // Default to Egypt
  }
}

/**
 * ===================================
 * LAZY LOADING IMAGES
 * ===================================
 */
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

/**
 * ===================================
 * EXPORT FUNCTIONS FOR USE IN OTHER MODULES
 * ===================================
 */
window.RitajHospital = {
  showNotification,
  detectUserCountry,
  animateCounters
};
