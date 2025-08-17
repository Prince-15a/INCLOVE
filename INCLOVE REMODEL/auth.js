// Authentication JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding form
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === targetTab + '-form') {
                    form.classList.add('active');
                }
            });
            
            // Announce to screen readers
            if (window.IncloveFunctions) {
                window.IncloveFunctions.announceToScreenReader(`Switched to ${targetTab} form`);
            }
        });
    });
    
    // Password visibility toggle
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const passwordInput = this.parentNode.querySelector('input');
            const icon = this.querySelector('.password-icon');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.textContent = '🙈';
                this.setAttribute('aria-label', 'Hide password');
            } else {
                passwordInput.type = 'password';
                icon.textContent = '👁️';
                this.setAttribute('aria-label', 'Show password');
            }
        });
    });
    
    // Password strength checker
    const signupPasswordInput = document.getElementById('signup-password');
    if (signupPasswordInput) {
        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');
        const strengthContainer = document.querySelector('.password-strength');
        
        signupPasswordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            
            // Update strength bar
            strengthBar.style.width = strength.percentage + '%';
            strengthText.textContent = strength.text;
            
            // Update container class for styling
            strengthContainer.className = 'password-strength strength-' + strength.level;
            
            // Announce to screen readers
            if (window.IncloveFunctions) {
                window.IncloveFunctions.announceToScreenReader(`Password strength: ${strength.text}`);
            }
        });
    }
    
    // Form validation
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    
    if (signinForm) {
        signinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('signin-email').value;
            const password = document.getElementById('signin-password').value;
            
            if (validateSigninForm(email, password)) {
                // Simulate successful login
                showSuccessMessage('Welcome back! Redirecting to your dashboard...');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
            }
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                firstName: document.getElementById('signup-firstname').value,
                lastName: document.getElementById('signup-lastname').value,
                email: document.getElementById('signup-email').value,
                password: document.getElementById('signup-password').value,
                age: document.getElementById('signup-age').value,
                location: document.getElementById('signup-location').value,
                terms: document.querySelector('#signup-form input[type="checkbox"]').checked
            };
            
            if (validateSignupForm(formData)) {
                // Simulate successful registration
                showSuccessMessage('Account created successfully! Please check your email to verify your account.');
                setTimeout(() => {
                    // Switch to signin form
                    document.querySelector('[data-tab="signin"]').click();
                }, 2000);
            }
        });
    }
    
    // Form validation functions
    function validateSigninForm(email, password) {
        let isValid = true;
        
        // Clear previous errors
        clearAllErrors();
        
        // Email validation
        if (!email) {
            showError(document.getElementById('signin-email'), 'Email is required');
            isValid = false;
        } else if (!window.IncloveFunctions.validateEmail(email)) {
            showError(document.getElementById('signin-email'), 'Please enter a valid email address');
            isValid = false;
        }
        
        // Password validation
        if (!password) {
            showError(document.getElementById('signin-password'), 'Password is required');
            isValid = false;
        }
        
        return isValid;
    }
    
    function validateSignupForm(formData) {
        let isValid = true;
        
        // Clear previous errors
        clearAllErrors();
        
        // First name validation
        if (!formData.firstName.trim()) {
            showError(document.getElementById('signup-firstname'), 'First name is required');
            isValid = false;
        }
        
        // Last name validation
        if (!formData.lastName.trim()) {
            showError(document.getElementById('signup-lastname'), 'Last name is required');
            isValid = false;
        }
        
        // Email validation
        if (!formData.email) {
            showError(document.getElementById('signup-email'), 'Email is required');
            isValid = false;
        } else if (!window.IncloveFunctions.validateEmail(formData.email)) {
            showError(document.getElementById('signup-email'), 'Please enter a valid email address');
            isValid = false;
        }
        
        // Password validation
        if (!formData.password) {
            showError(document.getElementById('signup-password'), 'Password is required');
            isValid = false;
        } else if (!window.IncloveFunctions.validatePassword(formData.password)) {
            showError(document.getElementById('signup-password'), 'Password must be at least 8 characters long');
            isValid = false;
        }
        
        // Age validation
        if (!formData.age) {
            showError(document.getElementById('signup-age'), 'Age is required');
            isValid = false;
        } else if (formData.age < 18 || formData.age > 100) {
            showError(document.getElementById('signup-age'), 'Age must be between 18 and 100');
            isValid = false;
        }
        
        // Location validation
        if (!formData.location.trim()) {
            showError(document.getElementById('signup-location'), 'Location is required');
            isValid = false;
        }
        
        // Terms validation
        if (!formData.terms) {
            showError(document.querySelector('#signup-form input[type="checkbox"]'), 'You must agree to the Terms of Service and Privacy Policy');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Error handling functions
    function showError(input, message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.setAttribute('role', 'alert');
        errorElement.setAttribute('aria-live', 'polite');
        
        // Insert error message after the input
        input.parentNode.insertBefore(errorElement, input.nextSibling);
        
        // Add error styling to input
        input.classList.add('error');
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', 'error-' + input.id);
        errorElement.id = 'error-' + input.id;
        
        // Focus on first error
        if (document.querySelectorAll('.error-message').length === 1) {
            input.focus();
        }
    }
    
    function clearAllErrors() {
        // Remove error messages
        document.querySelectorAll('.error-message').forEach(error => {
            error.remove();
        });
        
        // Remove error styling
        document.querySelectorAll('.error').forEach(input => {
            input.classList.remove('error');
            input.removeAttribute('aria-invalid');
            input.removeAttribute('aria-describedby');
        });
    }
    
    // Success message function
    function showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div class="success-content">
                <span class="success-icon">✅</span>
                <span class="success-text">${message}</span>
            </div>
        `;
        
        document.body.appendChild(successDiv);
        
        // Show with animation
        setTimeout(() => {
            successDiv.classList.add('show');
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            successDiv.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(successDiv)) {
                    document.body.removeChild(successDiv);
                }
            }, 300);
        }, 5000);
        
        // Announce to screen readers
        if (window.IncloveFunctions) {
            window.IncloveFunctions.announceToScreenReader(message);
        }
    }
    
    // Password strength calculation
    function calculatePasswordStrength(password) {
        let score = 0;
        let feedback = [];
        
        if (password.length >= 8) score += 1;
        else feedback.push('at least 8 characters');
        
        if (/[a-z]/.test(password)) score += 1;
        else feedback.push('lowercase letters');
        
        if (/[A-Z]/.test(password)) score += 1;
        else feedback.push('uppercase letters');
        
        if (/[0-9]/.test(password)) score += 1;
        else feedback.push('numbers');
        
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        else feedback.push('special characters');
        
        let level, text, percentage;
        
        if (score < 2) {
            level = 'weak';
            text = 'Weak - Add ' + feedback.slice(0, 2).join(' and ');
            percentage = 25;
        } else if (score < 4) {
            level = 'medium';
            text = 'Medium - Add ' + feedback.slice(0, 1).join(' and ');
            percentage = 60;
        } else {
            level = 'strong';
            text = 'Strong password';
            percentage = 100;
        }
        
        return { level, text, percentage };
    }
    
    // Social login handlers (placeholder)
    document.querySelectorAll('.btn-social').forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.textContent.trim();
            showSuccessMessage(`${provider} login is coming soon! Please use email registration for now.`);
        });
    });
    
    // Real-time validation
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            // Clear previous error for this input
            const existingError = this.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            this.classList.remove('error');
            this.removeAttribute('aria-invalid');
            this.removeAttribute('aria-describedby');
            
            // Validate individual field
            validateField(this);
        });
    });
    
    function validateField(input) {
        const value = input.value.trim();
        const type = input.type;
        const id = input.id;
        
        if (type === 'email' && value && !window.IncloveFunctions.validateEmail(value)) {
            showError(input, 'Please enter a valid email address');
        } else if (type === 'password' && value && !window.IncloveFunctions.validatePassword(value)) {
            showError(input, 'Password must be at least 8 characters long');
        } else if (id === 'signup-age' && value && (value < 18 || value > 100)) {
            showError(input, 'Age must be between 18 and 100');
        }
    }
    
    // Accessibility enhancements
    document.addEventListener('keydown', function(e) {
        // Alt+1 for signin, Alt+2 for signup
        if (e.altKey && e.key === '1') {
            e.preventDefault();
            document.querySelector('[data-tab="signin"]').click();
        } else if (e.altKey && e.key === '2') {
            e.preventDefault();
            document.querySelector('[data-tab="signup"]').click();
        }
    });
    
    // Load accessibility settings
    const settings = localStorage.getItem('inclove-accessibility-settings');
    if (settings) {
        try {
            const parsedSettings = JSON.parse(settings);
            if (parsedSettings.fontSize) {
                document.documentElement.style.fontSize = parsedSettings.fontSize + 'px';
            }
            if (parsedSettings.contrastMode === 'high') {
                document.body.classList.add('high-contrast');
            } else if (parsedSettings.contrastMode === 'dark') {
                document.body.classList.add('dark-mode');
            }
        } catch (e) {
            console.warn('Failed to apply accessibility settings');
        }
    }
});