/**
 * WEBORA - Colombo Creative Agency (Web Design & Social Media)
 * Pure Vanilla JavaScript - Framework-free, Ultra-Fast, Interactive
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initHeaderScroll();
  initFaqAccordion();
  initServiceTabs();
  initPortfolioFilter();
  initBlogFilter();
  initCostCalculator();
  initConciergeWidget();
  initContactForm();
});

/* ---------------------------------------------------------
   1. Mobile Navigation & Accessibility
   --------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const menuWrapper = document.querySelector('.nav-menu-wrapper');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  if (!toggleBtn || !menuWrapper) return;

  function toggleMenu(forceClose = false) {
    const isOpen = forceClose ? false : !menuWrapper.classList.contains('is-open');
    menuWrapper.classList.toggle('is-open', isOpen);
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  menuWrapper.addEventListener('click', (e) => {
    if (e.target === menuWrapper) {
      toggleMenu(true);
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(true);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuWrapper.classList.contains('is-open')) {
      toggleMenu(true);
    }
  });
}

/* ---------------------------------------------------------
   2. Sticky Header Elevation on Scroll
   --------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ---------------------------------------------------------
   3. Service Filtering Tabs (services.html / index.html)
   --------------------------------------------------------- */
function initServiceTabs() {
  const tabBtns = document.querySelectorAll('.services-filter-tabs .tab-btn');
  const cards = document.querySelectorAll('.service-filterable-card');

  if (!tabBtns.length || !cards.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transition = 'opacity 0.25s ease';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ---------------------------------------------------------
   4. Portfolio & Case Study Filtering (portfolio.html)
   --------------------------------------------------------- */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.portfolio-filter-tabs .tab-btn');
  const items = document.querySelectorAll('.case-study-card');

  if (!filterBtns.length || !items.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      items.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ---------------------------------------------------------
   5. Blog Search & Category Filter (blog.html)
   --------------------------------------------------------- */
function initBlogFilter() {
  const searchInput = document.getElementById('blogSearchInput');
  const filterBtns = document.querySelectorAll('.blog-filter-tabs .tab-btn');
  const blogCards = document.querySelectorAll('.blog-card');

  if (!blogCards.length) return;

  function filterArticles() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeBtn = document.querySelector('.blog-filter-tabs .tab-btn.active');
    const activeCategory = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';

    blogCards.forEach(card => {
      const cardTitle = card.querySelector('.blog-title').textContent.toLowerCase();
      const cardCategory = card.getAttribute('data-category');
      const matchesCategory = (activeCategory === 'all' || cardCategory === activeCategory);
      const matchesSearch = !query || cardTitle.includes(query);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterArticles);
  }

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterArticles();
      });
    });
  }
}

/* ---------------------------------------------------------
   6. ADVANCED: Interactive Cost Estimator Engine (pricing.html)
   --------------------------------------------------------- */
function initCostCalculator() {
  const calcForm = document.getElementById('projectCostCalculator');
  if (!calcForm) return;

  const totalAmountEl = document.getElementById('calcTotalAmount');
  const totalUsdEl = document.getElementById('calcTotalUsd');
  const summaryListEl = document.getElementById('calcSummaryItems');
  const whatsappOrderBtn = document.getElementById('calcWhatsAppOrderBtn');

  const USD_RATE = 308; // LKR per USD approx

  function updateCalculation() {
    let totalPrice = 0;
    const selectedItems = [];

    // 1. Web Development Tier
    const webOption = calcForm.querySelector('input[name="calc_web"]:checked');
    if (webOption) {
      const price = parseInt(webOption.getAttribute('data-price'), 10) || 0;
      const label = webOption.getAttribute('data-name');
      totalPrice += price;
      if (price > 0) {
        selectedItems.push({ name: label, price: price });
      }
    }

    // 2. Web Add-ons (Checkboxes)
    const addonCheckboxes = calcForm.querySelectorAll('input[name="calc_addon"]:checked');
    addonCheckboxes.forEach(cb => {
      const price = parseInt(cb.getAttribute('data-price'), 10) || 0;
      const label = cb.getAttribute('data-name');
      totalPrice += price;
      selectedItems.push({ name: label, price: price });
    });

    // 3. Social Media Management
    const socialOption = calcForm.querySelector('input[name="calc_social"]:checked');
    if (socialOption) {
      const price = parseInt(socialOption.getAttribute('data-price'), 10) || 0;
      const label = socialOption.getAttribute('data-name');
      totalPrice += price;
      if (price > 0) {
        selectedItems.push({ name: label, price: price });
      }
    }

    // Update visuals & active classes
    calcForm.querySelectorAll('.calc-option-label').forEach(label => {
      const input = label.querySelector('input');
      if (input && input.checked) {
        label.classList.add('is-selected');
      } else {
        label.classList.remove('is-selected');
      }
    });

    // Render summary list
    if (summaryListEl) {
      summaryListEl.innerHTML = '';
      if (selectedItems.length === 0) {
        summaryListEl.innerHTML = '<div style="color: var(--ash-400); font-size: 0.85rem;">Select options on the left to see scope breakdown.</div>';
      } else {
        selectedItems.forEach(item => {
          const row = document.createElement('div');
          row.className = 'calc-sum-row';
          row.innerHTML = `
            <span class="calc-sum-name">${item.name}</span>
            <span class="calc-sum-val">LKR ${item.price.toLocaleString()}</span>
          `;
          summaryListEl.appendChild(row);
        });
      }
    }

    // Update total numbers
    if (totalAmountEl) {
      totalAmountEl.textContent = totalPrice.toLocaleString();
    }
    if (totalUsdEl) {
      const approxUsd = Math.round(totalPrice / USD_RATE);
      totalUsdEl.textContent = `(~ $${approxUsd.toLocaleString()} USD)`;
    }

    // Update WhatsApp link with scope breakdown
    if (whatsappOrderBtn) {
      let scopeText = `*Webora Custom Scope Estimate*%0A%0A`;
      selectedItems.forEach(item => {
        scopeText += `• ${encodeURIComponent(item.name)}: LKR ${item.price.toLocaleString()}%0A`;
      });
      scopeText += `%0A*Estimated Total:* LKR ${totalPrice.toLocaleString()}%0A`;
      scopeText += `_Hi Webora team! I built this scope on your calculator and would like to proceed._`;

      whatsappOrderBtn.href = `https://wa.me/94771234567?text=${scopeText}`;
    }
  }

  calcForm.addEventListener('change', updateCalculation);
  updateCalculation(); // Initialize on page load
}

/* ---------------------------------------------------------
   7. ADVANCED: Interactive WhatsApp Concierge Chat Widget
   --------------------------------------------------------- */
function initConciergeWidget() {
  const triggerBtn = document.getElementById('conciergeTrigger');
  const popup = document.getElementById('conciergePopup');
  const closeBtn = document.getElementById('conciergeClose');

  if (!triggerBtn || !popup) return;

  function togglePopup() {
    popup.classList.toggle('is-open');
  }

  triggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePopup();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      popup.classList.remove('is-open');
    });
  }

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!popup.contains(e.target) && !triggerBtn.contains(e.target)) {
      popup.classList.remove('is-open');
    }
  });
}

/* ---------------------------------------------------------
   8. FAQ Accordion
   --------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('active', !isActive);
      questionBtn.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
    });
  });
}

/* ---------------------------------------------------------
   9. Interactive Contact Form with WhatsApp Lead Generator
   --------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('weboraContactForm');
  if (!form) return;

  const successNotice = document.getElementById('formSuccessNotice');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    const nameInput = document.getElementById('fullName');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const serviceInput = document.getElementById('serviceType');
    const messageInput = document.getElementById('message');

    form.querySelectorAll('.form-feedback').forEach(el => el.classList.remove('error'));

    if (!nameInput.value.trim()) {
      showError(nameInput, 'Please enter your name.');
      isValid = false;
    }

    if (!phoneInput.value.trim() || phoneInput.value.trim().length < 8) {
      showError(phoneInput, 'Please enter a valid phone or WhatsApp number.');
      isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      showError(emailInput, 'Please enter a valid email address.');
      isValid = false;
    }

    if (!messageInput.value.trim()) {
      showError(messageInput, 'Please tell us a little about your project.');
      isValid = false;
    }

    if (!isValid) return;

    const agencyNumber = '94771234567';
    const msgText = `*New Webora Website Inquiry*%0A%0A` +
      `*Client:* ${encodeURIComponent(nameInput.value.trim())}%0A` +
      `*Phone:* ${encodeURIComponent(phoneInput.value.trim())}%0A` +
      `*Email:* ${encodeURIComponent(emailInput.value.trim())}%0A` +
      `*Service Interested:* ${encodeURIComponent(serviceInput ? serviceInput.value : 'General')}%0A%0A` +
      `*Project Details:*%0A${encodeURIComponent(messageInput.value.trim())}%0A%0A` +
      `_Sent via Webora Colombo Web Portal_`;

    const waUrl = `https://wa.me/${agencyNumber}?text=${msgText}`;

    if (successNotice) {
      successNotice.style.display = 'block';
      successNotice.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    setTimeout(() => {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      form.reset();
    }, 600);
  });

  function showError(inputEl, msg) {
    const parent = inputEl.closest('.form-group');
    if (!parent) return;
    const feedback = parent.querySelector('.form-feedback');
    if (feedback) {
      feedback.textContent = msg;
      feedback.classList.add('error');
    }
  }
}
