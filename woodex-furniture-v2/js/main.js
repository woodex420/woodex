/**
 * Woodex Furniture V2.1 - Main JavaScript
 * Interactive functionality for the homepage
 */

(function() {
    'use strict';

    // DOM Elements
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMobile = document.querySelector('.nav-mobile');
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    // Testimonials carousel elements
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselPrev = document.querySelector('.carousel-btn-prev');
    const carouselNext = document.querySelector('.carousel-btn-next');
    const indicators = document.querySelectorAll('.indicator');
    
    // Lightbox elements
    const lightbox = document.querySelector('.lightbox-overlay');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const lightboxCounter = document.querySelector('.current-slide');
    const galleryItems = document.querySelectorAll('[data-gallery-index]');

    // ==================================================
    // DROPDOWN NAVIGATION FUNCTIONALITY
    // ==================================================

    function handleDropdownMenus() {
        dropdownItems.forEach(item => {
            const dropdown = item.querySelector('.dropdown-menu');
            
            // Show dropdown on hover (desktop only)
            item.addEventListener('mouseenter', () => {
                if (window.innerWidth >= 1024) {
                    dropdown.style.opacity = '1';
                    dropdown.style.visibility = 'visible';
                    dropdown.style.transform = 'translateY(0)';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                if (window.innerWidth >= 1024) {
                    dropdown.style.opacity = '0';
                    dropdown.style.visibility = 'hidden';
                    dropdown.style.transform = 'translateY(-10px)';
                }
            });
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-item.has-dropdown')) {
                dropdownItems.forEach(item => {
                    const dropdown = item.querySelector('.dropdown-menu');
                    dropdown.style.opacity = '0';
                    dropdown.style.visibility = 'hidden';
                    dropdown.style.transform = 'translateY(-10px)';
                });
            }
        });
    }

    // ==================================================
    // FAQ FUNCTIONALITY
    // ==================================================

    function handleFAQToggle() {
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                const answer = question.nextElementSibling;
                
                // Close all other FAQ items
                faqQuestions.forEach(otherQuestion => {
                    if (otherQuestion !== question) {
                        otherQuestion.setAttribute('aria-expanded', 'false');
                        otherQuestion.nextElementSibling.classList.remove('active');
                    }
                });
                
                // Toggle current FAQ item
                if (isExpanded) {
                    question.setAttribute('aria-expanded', 'false');
                    answer.classList.remove('active');
                } else {
                    question.setAttribute('aria-expanded', 'true');
                    answer.classList.add('active');
                }
            });
            
            // Keyboard accessibility
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        });
    }

    // ==================================================
    // MOBILE MENU FUNCTIONALITY
    // ==================================================

    function toggleMobileMenu() {
        const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        mobileToggle.setAttribute('aria-expanded', 'true');
        navMobile.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus the first mobile link
        setTimeout(() => {
            if (mobileLinks.length > 0) {
                mobileLinks[0].focus();
            }
        }, 100);
    }

    function closeMobileMenu() {
        mobileToggle.setAttribute('aria-expanded', 'false');
        navMobile.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Toggle mobile menu
    if (mobileToggle && navMobile) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
        
        // Close menu when clicking on mobile links
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!header.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMobile.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    // ==================================================
    // SMOOTH SCROLLING
    // ==================================================

    function smoothScroll(targetId) {
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = getComputedStyle(document.documentElement)
                .getPropertyValue('--header-height').trim();
            const mobileHeaderHeight = getComputedStyle(document.documentElement)
                .getPropertyValue('--header-height-mobile').trim();
            
            const isMobile = window.innerWidth <= 1024;
            const offsetTop = isMobile ? parseInt(mobileHeaderHeight) : parseInt(headerHeight);
            
            const targetPosition = targetElement.offsetTop - offsetTop;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Handle navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                smoothScroll(href);
            }
        });
    });

    // ==================================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ==================================================

    // Create intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // ==================================================
    // TESTIMONIALS CAROUSEL FUNCTIONALITY
    // ==================================================
    
    let currentTestimonial = 0;
    let carouselInterval;
    const testimonialCount = testimonialCards.length;
    
    function showTestimonial(index) {
        // Hide all testimonials
        testimonialCards.forEach(card => {
            card.classList.remove('active');
        });
        
        // Remove active class from all indicators
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Show current testimonial
        if (testimonialCards[index]) {
            testimonialCards[index].classList.add('active');
        }
        
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
        
        // Update carousel track position
        if (carouselTrack) {
            const translateX = -index * 100;
            carouselTrack.style.transform = `translateX(${translateX}%)`;
        }
        
        currentTestimonial = index;
    }
    
    function nextTestimonial() {
        const nextIndex = (currentTestimonial + 1) % testimonialCount;
        showTestimonial(nextIndex);
    }
    
    function prevTestimonial() {
        const prevIndex = currentTestimonial === 0 ? testimonialCount - 1 : currentTestimonial - 1;
        showTestimonial(prevIndex);
    }
    
    function startCarouselAutoPlay() {
        carouselInterval = setInterval(nextTestimonial, 5000); // Auto-advance every 5 seconds
    }
    
    function stopCarouselAutoPlay() {
        clearInterval(carouselInterval);
    }
    
    function handleCarouselControls() {
        // Next button
        if (carouselNext) {
            carouselNext.addEventListener('click', () => {
                stopCarouselAutoPlay();
                nextTestimonial();
                startCarouselAutoPlay();
            });
        }
        
        // Previous button
        if (carouselPrev) {
            carouselPrev.addEventListener('click', () => {
                stopCarouselAutoPlay();
                prevTestimonial();
                startCarouselAutoPlay();
            });
        }
        
        // Indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                stopCarouselAutoPlay();
                showTestimonial(index);
                startCarouselAutoPlay();
            });
        });
        
        // Pause on hover
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', stopCarouselAutoPlay);
            carouselContainer.addEventListener('mouseleave', startCarouselAutoPlay);
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox && !lightbox.classList.contains('active')) {
                if (e.key === 'ArrowLeft') {
                    stopCarouselAutoPlay();
                    prevTestimonial();
                    startCarouselAutoPlay();
                } else if (e.key === 'ArrowRight') {
                    stopCarouselAutoPlay();
                    nextTestimonial();
                    startCarouselAutoPlay();
                }
            }
        });
    }
    
    // Touch/Swipe support for mobile
    function addTouchSupport() {
        let startX = 0;
        let endX = 0;
        const carouselContainer = document.querySelector('.carousel-container');
        
        if (carouselContainer) {
            carouselContainer.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });
            
            carouselContainer.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                const diffX = startX - endX;
                
                if (Math.abs(diffX) > 50) { // Minimum swipe distance
                    stopCarouselAutoPlay();
                    if (diffX > 0) {
                        nextTestimonial();
                    } else {
                        prevTestimonial();
                    }
                    startCarouselAutoPlay();
                }
            });
        }
    }

    // Observe elements for animation
    function observeElements() {
        const animatedElements = document.querySelectorAll('.product-card, .service-card, .value-card, .product-item, .contact-card');
        
        animatedElements.forEach((el, index) => {
            el.classList.add('fade-in');
            el.style.animationDelay = `${index * 0.1}s`;
            observer.observe(el);
        });
        
        // Add stagger animation to testimonials
        testimonialCards.forEach((card, index) => {
            card.classList.add('stagger-animation');
        });
    }
    
    // ==================================================
    // LIGHTBOX FUNCTIONALITY
    // ==================================================
    
    let currentImageIndex = 0;
    const imageGallery = [];
    
    function initializeImageGallery() {
        galleryItems.forEach((item, index) => {
            const img = item.querySelector('img');
            if (img && img.dataset.gallerySrc) {
                imageGallery.push({
                    src: img.dataset.gallerySrc,
                    alt: img.alt,
                    title: item.querySelector('.product-title')?.textContent || img.alt
                });
            }
        });
    }
    
    function openLightbox(index) {
        if (!lightbox || !imageGallery.length) return;
        
        currentImageIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        if (lightboxClose) {
            lightboxClose.focus();
        }
    }
    
    function closeLightbox() {
        if (!lightbox) return;
        
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function updateLightboxImage() {
        if (!lightboxImage || !imageGallery[currentImageIndex]) return;
        
        const currentImage = imageGallery[currentImageIndex];
        lightboxImage.src = currentImage.src;
        lightboxImage.alt = currentImage.alt;
        
        if (lightboxCounter) {
            lightboxCounter.textContent = currentImageIndex + 1;
        }
    }
    
    function nextLightboxImage() {
        currentImageIndex = (currentImageIndex + 1) % imageGallery.length;
        updateLightboxImage();
    }
    
    function prevLightboxImage() {
        currentImageIndex = currentImageIndex === 0 ? imageGallery.length - 1 : currentImageIndex - 1;
        updateLightboxImage();
    }
    
    function handleLightboxControls() {
        // Gallery item clicks
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                openLightbox(index);
            });
            
            // Keyboard accessibility
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(index);
                }
            });
            
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', `View ${item.querySelector('.product-title')?.textContent || 'product'} in full size`);
        });
        
        // Close button
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }
        
        // Navigation buttons
        if (lightboxNext) {
            lightboxNext.addEventListener('click', nextLightboxImage);
        }
        
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', prevLightboxImage);
        }
        
        // Click outside to close
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox && lightbox.classList.contains('active')) {
                switch(e.key) {
                    case 'Escape':
                        closeLightbox();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        nextLightboxImage();
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        prevLightboxImage();
                        break;
                }
            }
        });
    }
    
    // Touch/Swipe support for lightbox
    function addLightboxTouchSupport() {
        let startX = 0;
        let endX = 0;
        
        if (lightbox) {
            lightbox.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });
            
            lightbox.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                const diffX = startX - endX;
                
                if (Math.abs(diffX) > 50) { // Minimum swipe distance
                    if (diffX > 0) {
                        nextLightboxImage();
                    } else {
                        prevLightboxImage();
                    }
                }
            });
        }
    }

    // ==================================================
    // HEADER SCROLL EFFECTS
    // ==================================================

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
        }
        
        // Optional: Hide header on scroll down, show on scroll up
        if (scrollY > lastScrollY && scrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll);

    // ==================================================
    // CARD INTERACTIONS
    // ==================================================

    function enhanceCardInteractions() {
        const cards = document.querySelectorAll('.product-card, .service-card, .value-card, .contact-card');
        
        cards.forEach(card => {
            // Add ripple effect on click
            card.addEventListener('click', function(e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(194, 242, 30, 0.3)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 0.6s linear';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.width = '20px';
                ripple.style.height = '20px';
                ripple.style.marginLeft = '-10px';
                ripple.style.marginTop = '-10px';
                
                card.style.position = 'relative';
                card.style.overflow = 'hidden';
                card.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
            
            // Add keyboard navigation
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
            
            // Make cards focusable
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
        });
    }

    // ==================================================
    // CONTACT FORM HANDLING
    // ==================================================

    function handleContactActions() {
        const contactActions = document.querySelectorAll('.contact-action');
        
        contactActions.forEach(action => {
            action.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#contact') {
                    e.preventDefault();
                    
                    // Show contact modal or scroll to contact section
                    const contactSection = document.querySelector('#faq');
                    if (contactSection) {
                        smoothScroll('#faq');
                        
                        // Add highlighting effect
                        const contactCards = contactSection.querySelectorAll('.contact-card');
                        contactCards.forEach((card, index) => {
                            setTimeout(() => {
                                card.style.boxShadow = '0 0 0 3px var(--color-primary-500)';
                                setTimeout(() => {
                                    card.style.boxShadow = '';
                                }, 2000);
                            }, index * 200);
                        });
                    }
                }
            });
        });
    }

    // ==================================================
    // ACCESSIBILITY ENHANCEMENTS
    // ==================================================

    function enhanceAccessibility() {
        // Skip to content functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView();
                }
            });
        }
        
        // Announce page changes to screen readers
        const main = document.querySelector('main');
        if (main) {
            main.setAttribute('aria-label', 'Main content area');
        }
        
        // Add aria-labels for icons
        const icons = document.querySelectorAll('.service-icon i, .contact-icon i');
        icons.forEach(icon => {
            const parentCard = icon.closest('.service-card, .contact-card');
            if (parentCard) {
                const title = parentCard.querySelector('.service-title, .contact-title');
                if (title) {
                    icon.setAttribute('aria-label', title.textContent);
                    icon.setAttribute('role', 'img');
                }
            }
        });
    }

    // ==================================================
    // PERFORMANCE OPTIMIZATIONS
    // ==================================================

    // Lazy load images
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    // Debounce utility
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // ==================================================
    // INITIALIZATION
    // ==================================================

    function init() {
        // Initialize all functionality
        observeElements();
        enhanceCardInteractions();
        handleContactActions();
        enhanceAccessibility();
        enhanceMicroInteractions();
        
        // Initialize new features
        handleDropdownMenus();
        handleFAQToggle();
        
        // Initialize new interactive features
        if (testimonialCards.length > 0) {
            handleCarouselControls();
            addTouchSupport();
            showTestimonial(0);
            startCarouselAutoPlay();
        }
        
        if (galleryItems.length > 0) {
            initializeImageGallery();
            handleLightboxControls();
            addLightboxTouchSupport();
        }
        
        // Handle window resize
        const handleResize = debounce(() => {
            // Close mobile menu on resize to desktop
            if (window.innerWidth > 1024 && navMobile.classList.contains('active')) {
                closeMobileMenu();
            }
            
            // Reset dropdown menus on resize
            if (window.innerWidth < 1024) {
                dropdownItems.forEach(item => {
                    const dropdown = item.querySelector('.dropdown-menu');
                    dropdown.style.opacity = '0';
                    dropdown.style.visibility = 'hidden';
                    dropdown.style.transform = 'translateY(-10px)';
                });
            }
        }, 250);
        
        window.addEventListener('resize', handleResize);
        
        // Initial scroll position check
        updateHeader();
        
    // ==================================================
    // ENHANCED MICRO-INTERACTIONS
    // ==================================================
    
    function enhanceMicroInteractions() {
        // Add glow effect to cards
        const cards = document.querySelectorAll('.product-card, .service-card, .value-card, .contact-card');
        cards.forEach(card => {
            card.classList.add('glow-on-hover', 'micro-bounce');
        });
        
        // Add pulse animation to CTAs
        const ctaButtons = document.querySelectorAll('.btn-primary');
        ctaButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.animation = 'pulse 1s infinite';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.animation = '';
            });
        });
        
        // Enhance product image hover effects
        const productImages = document.querySelectorAll('.product-image img');
        productImages.forEach(img => {
            img.addEventListener('mouseenter', () => {
                img.style.filter = 'brightness(1.1) contrast(1.1)';
            });
            
            img.addEventListener('mouseleave', () => {
                img.style.filter = '';
            });
        });
        
        // Add typing effect to hero text (optional enhancement)
        function addTypingEffect() {
            const heroHeadline = document.querySelector('.hero-headline');
            if (heroHeadline) {
                const text = heroHeadline.textContent;
                heroHeadline.textContent = '';
                heroHeadline.style.borderRight = '2px solid var(--color-primary-500)';
                
                let i = 0;
                const typeWriter = () => {
                    if (i < text.length) {
                        heroHeadline.textContent += text.charAt(i);
                        i++;
                        setTimeout(typeWriter, 50);
                    } else {
                        // Remove cursor after typing is complete
                        setTimeout(() => {
                            heroHeadline.style.borderRight = 'none';
                        }, 1000);
                    }
                };
                
                // Start typing effect after a delay
                setTimeout(typeWriter, 1000);
            }
        }
        
        // Uncomment to enable typing effect
        // addTypingEffect();
    }

        console.log('Woodex Furniture V2.1 - Enhanced with testimonials carousel and lightbox gallery');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ==================================================
    // CSS ANIMATIONS (INLINE STYLES)
    // ==================================================

    // Add ripple animation to the document
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .fade-in {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        
        /* Enhanced hover states */
        .product-card:hover .zoom-overlay {
            animation: fadeInUp 0.3s ease-out;
        }
        
        /* Smooth image loading */
        img {
            transition: opacity 0.3s ease-out, transform 0.3s ease-out;
        }
        
        img:not([src]) {
            opacity: 0;
        }
    `;
    document.head.appendChild(style);

    // ==================================================
    // PUBLIC API (if needed for external scripts)
    // ==================================================

    window.WoodexFurniture = {
        toggleMobileMenu,
        closeMobileMenu,
        smoothScroll,
        version: '2.1.0'
    };

})();