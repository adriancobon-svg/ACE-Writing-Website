/**
 * ACE Writing - Interactive Scripting
 * Imprint of Adrian Cobon
 * Lightweight mobile menu toggling, active page states, scroll animation reveal, and interactive forms.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initActiveNav();
  initScrollAnimations();
  initForms();
});

/**
 * Mobile Hamburger Menu Toggle
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      menuToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('open');
        navMenu.classList.remove('open');
      }
    });
  }
}

/**
 * Active Navigation Link Highlight
 */
function initActiveNav() {
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname;
  
  // Clean filename from path
  const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentFile) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Scroll Animations using IntersectionObserver
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null, // viewport
      threshold: 0.15, // trigger when 15% visible
      rootMargin: '0px 0px -50px 0px' // offset bottom triggers slightly
    };

    const animObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target); // Animate only once
        }
      });
    }, observerOptions);

    animatedElements.forEach(element => {
      animObserver.observe(element);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    animatedElements.forEach(element => {
      element.classList.add('animated');
    });
  }
}

/**
 * Form Submission Validation and Feeds (Newsletter and Contact Forms)
 */
function initForms() {
  // Newsletter forms
  const newsletterForms = document.querySelectorAll('.newsletter-form, #newsletter-page-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = form.querySelector('input[type="email"]');
      const emailValue = emailInput ? emailInput.value.trim() : '';
      
      // Basic validation
      if (!validateEmail(emailValue)) {
        showFormFeedback(form, 'error', 'Please enter a valid email address.');
        return;
      }

      // Check for multi-list selections if they exist (Newsletter page)
      const listCheckboxes = form.querySelectorAll('input[type="checkbox"]:checked');
      let successMsg = 'Thank you for subscribing! Check your inbox to confirm.';
      
      if (listCheckboxes.length > 0) {
        const selectedWorlds = Array.from(listCheckboxes).map(cb => cb.value).join(', ');
        successMsg = `Subscribed successfully to: ${selectedWorlds}. Prequel files are on their way!`;
      }

      // Simulate API submit success
      showFormFeedback(form, 'success', successMsg);
      if (emailInput) emailInput.value = '';
    });
  });

  // Contact form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const genre = document.getElementById('contact-genre').value;
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        showFormFeedback(contactForm, 'error', 'Please fill in all required fields.');
        return;
      }

      if (!validateEmail(email)) {
        showFormFeedback(contactForm, 'error', 'Please enter a valid email address.');
        return;
      }

      // Simulate submit success
      const successMsg = `Thank you, ${name}! Your message regarding the ${genre} line has been received. Adrian will respond in 3-5 business days.`;
      showFormFeedback(contactForm, 'success', successMsg);
      contactForm.reset();
    });
  }
}

/**
 * Email Regex Validator
 */
function validateEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
}

/**
 * Shows visual form success/error messages
 */
function showFormFeedback(form, status, message) {
  // Check if feeeback element already exists
  let feedback = form.querySelector('.feedback-msg');
  
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.className = 'feedback-msg';
    form.appendChild(feedback);
  }

  feedback.textContent = message;
  feedback.className = `feedback-msg ${status}`;
  
  // Auto scroll to feedback if on mobile
  feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
