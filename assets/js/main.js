/**
* Template Name: Strategy
* Template URL: https://bootstrapmade.com/strategy-bootstrap-agency-template/
* Updated: Jun 06 2025 with Bootstrap v5.3.6
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Easy selector helper function (MOVED TO GLOBAL SCOPE WITHIN IIFE)
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    }
    return document.querySelector(el)
  }

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = select('body'); // Using select helper
    const selectHeader = select('#header'); // Using select helper
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = select('.mobile-nav-toggle'); // Using select helper

  function mobileNavToogle() {
    select('body').classList.toggle('mobile-nav-active'); // Using select helper
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  select('#navmenu a', true).forEach(navmenu => { // Using select helper with 'true'
    navmenu.addEventListener('click', () => {
      if (select('.mobile-nav-active')) { // Using select helper
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  select('.navmenu .toggle-dropdown', true).forEach(navmenu => { // Using select helper with 'true'
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = select('#preloader'); // Using select helper
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = select('.scroll-top'); // Using select helper

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    select(".init-swiper", true).forEach(function(swiperElement) { // Using select helper with 'true'
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  // --- START OF MODIFIED PORTFOLIO JAVASCRIPT ---

  let glightboxInstance = null; // To hold the current GLightbox instance

  // Function to initialize GLightbox with a specific selector
  function initPortfolioLightbox(selector) {
    // Destroy existing GLightbox instance if it exists
    if (glightboxInstance) {
      glightboxInstance.destroy();
    }
    // Initialize GLightbox with the new selector
    glightboxInstance = GLightbox({
      selector: selector,
      touchNavigation: true,
      loop: true,
      autoplayVideos: false
    });
  }

  /**
   * Init isotope layout and filters (MODIFIED)
   */
  window.addEventListener('load', () => {
    const portfolioContainer = select('.isotope-container'); // Selector for the Isotope container
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'masonry' // Make sure this matches your template's setting (e.g., 'masonry', 'fitRows')
      });

      // Get all portfolio items with the glightbox class
      const allGlightboxItems = select('.portfolio-item .glightbox', true);

      // Store original data-gallery attributes only once on initial load
      allGlightboxItems.forEach(item => {
        if (!item.hasAttribute('data-original-gallery')) { // Only store if not already stored
          const originalGallery = item.getAttribute('data-gallery');
          if (originalGallery) {
            item.setAttribute('data-original-gallery', originalGallery);
          }
        }
      });

      // Function to update data-gallery attributes for GLightbox based on current filter
      function updateGlightboxGalleries(filterValue) {
        allGlightboxItems.forEach(item => {
          const portfolioItem = item.closest('.portfolio-item');
          const originalGallery = item.getAttribute('data-original-gallery');

          if (filterValue === '*') {
            // For 'All Projects', set a single common data-gallery for all
            item.setAttribute('data-gallery', 'portfolio-all');
          } else {
            // For specific filters:
            // Check if the portfolio item contains the class of the active filter
            if (portfolioItem && portfolioItem.classList.contains(filterValue.substring(1))) {
                // If item matches the current filter, restore its original data-gallery
                if (originalGallery) {
                    item.setAttribute('data-gallery', originalGallery);
                } else {
                    item.removeAttribute('data-gallery'); // If no original, remove it
                }
            } else {
                // If item does NOT match the current filter, remove its data-gallery
                // This makes GLightbox treat it as an individual item and not part of the active gallery.
                item.removeAttribute('data-gallery');
            }
          }
        });
      }


      // Initial setup for 'All Projects' on page load
      updateGlightboxGalleries('*'); // Set all to 'portfolio-all' initially
      initPortfolioLightbox('.portfolio-item .glightbox'); // Initialize GLightbox for all items


      // Handle portfolio filter clicks
      const portfolioFilters = select('.isotope-layout .portfolio-filters li', true); // Selector for portfolio filters

      portfolioFilters.forEach(filter => {
        filter.addEventListener('click', function(e) {
          e.preventDefault();

          // Remove 'filter-active' from all filters within the same .isotope-filters group
          filter.closest('.portfolio-filters').querySelectorAll('li').forEach(el => el.classList.remove('filter-active'));
          // Add 'filter-active' to the clicked filter
          this.classList.add('filter-active');

          let filterValue = this.getAttribute('data-filter');

          // Filter Isotope items
          portfolioIsotope.arrange({
            filter: filterValue
          });

          // Update data-gallery attributes based on filter value BEFORE GLightbox re-initialization
          updateGlightboxGalleries(filterValue);

          // Reinitialize GLightbox based on the active filter
          if (filterValue === '*') {
            // Re-init with all items, now that their data-gallery is 'portfolio-all'
            initPortfolioLightbox('.portfolio-item .glightbox');
          } else {
            // Re-init targeting only the visible items that match the filter.
            // GLightbox will now create galleries based on their *restored original* data-gallery attributes.
            initPortfolioLightbox(`.portfolio-item${filterValue} .glightbox`);
          }

          // Optional: Re-run AOS animations after filtering if needed (your template includes this)
          if (typeof aosInit === 'function') {
            aosInit();
          }
        });
      });
    }
  });

  // --- END OF MODIFIED PORTFOLIO JAVASCRIPT ---


  /**
   * Frequently Asked Questions Toggle
   */
  select('.faq-item h3, .faq-item .faq-toggle, .faq-item .faq-header', true).forEach((faqItem) => { // Using select helper with 'true'
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (select(window.location.hash)) { // Using select helper
        setTimeout(() => {
          let section = select(window.location.hash); // Using select helper
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = select('.navmenu a', true); // Using select helper with 'true'

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = select(navmenulink.hash); // Using select helper
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        select('.navmenu a.active', true).forEach(link => link.classList.remove('active')); // Using select helper with 'true'
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();