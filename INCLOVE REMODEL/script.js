// Main JavaScript for Inclove
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .testimonial-card, .stat').forEach(el => {
        observer.observe(el);
    });
    
    // Form validation helpers
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function validatePassword(password) {
        return password.length >= 8;
    }
    
    // Accessibility helpers
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    // Keyboard navigation improvements
    document.addEventListener('keydown', function(e) {
        // Skip to main content with Alt+M
        if (e.altKey && e.key === 'm') {
            e.preventDefault();
            const main = document.querySelector('main');
            if (main) {
                main.focus();
                main.scrollIntoView({ behavior: 'smooth' });
                announceToScreenReader('Skipped to main content');
            }
        }
        
        // Quick access to accessibility page with Alt+A
        if (e.altKey && e.key === 'a') {
            e.preventDefault();
            window.location.href = 'accessibility.html';
        }
    });
    
    // Enhanced focus management
    let focusedElementBeforeModal = null;
    
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
            
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }
    
    function openModal(modalElement) {
        focusedElementBeforeModal = document.activeElement;
        modalElement.style.display = 'block';
        modalElement.setAttribute('aria-hidden', 'false');
        trapFocus(modalElement);
        const firstFocusable = modalElement.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }
    
    function closeModal() {
        const modals = document.querySelectorAll('[role="dialog"]');
        modals.forEach(modal => {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        });
        
        if (focusedElementBeforeModal) {
            focusedElementBeforeModal.focus();
        }
    }
    
    // Prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--transition-fast', '0ms');
        document.documentElement.style.setProperty('--transition-normal', '0ms');
        document.documentElement.style.setProperty('--transition-slow', '0ms');
    }
    
    // High contrast mode detection
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
    
    if (prefersHighContrast.matches) {
        document.body.classList.add('high-contrast');
    }
    
    // Color scheme preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    if (prefersDarkScheme.matches) {
        document.body.classList.add('dark-mode');
    }
    
    // Load accessibility settings from localStorage
    function loadAccessibilitySettings() {
        const settings = localStorage.getItem('inclove-accessibility-settings');
        if (settings) {
            try {
                const parsedSettings = JSON.parse(settings);
                applyAccessibilitySettings(parsedSettings);
            } catch (e) {
                console.warn('Failed to parse accessibility settings');
            }
        }
    }
    
    function applyAccessibilitySettings(settings) {
        if (settings.fontSize) {
            document.documentElement.style.fontSize = settings.fontSize + 'px';
        }
        
        if (settings.highContrast) {
            document.body.classList.add('high-contrast');
        }
        
        if (settings.reducedMotion) {
            document.body.classList.add('reduced-motion');
        }
        
        if (settings.colorBlind) {
            document.body.classList.add('colorblind-' + settings.colorBlind);
        }
    }
    
    // Initialize accessibility settings
    loadAccessibilitySettings();
    
    // Performance optimization: Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Error handling for forms
    function showError(input, message) {
        const errorElement = input.parentNode.querySelector('.error-message') || 
                           document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.setAttribute('role', 'alert');
        
        if (!input.parentNode.querySelector('.error-message')) {
            input.parentNode.appendChild(errorElement);
        }
        
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', errorElement.id || 'error-' + Date.now());
    }
    
    function clearError(input) {
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');
    }
    
    // Global error handler
    window.addEventListener('error', function(e) {
        console.error('Global error:', e.error);
        // Could send to error reporting service
    });
    
    // Service worker registration for PWA capabilities
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('SW registered: ', registration);
                })
                .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
});

// Export functions for use in other scripts
window.IncloveFunctions = {
    announceToScreenReader: function(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    },
    
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    validatePassword: function(password) {
        return password.length >= 8;
    }
};