// Accessibility Settings JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const settings = {
        fontSize: 16,
        contrastMode: 'normal',
        colorBlind: 'normal',
        reduceMotion: false,
        screenReader: false,
        voiceCommands: false,
        soundEffects: true,
        keyboardNav: false,
        focusIndicators: false,
        skipLinks: false,
        messageFormat: 'text',
        autoCaptions: false,
        signLanguage: false
    };
    
    // Load saved settings
    function loadSettings() {
        const saved = localStorage.getItem('inclove-accessibility-settings');
        if (saved) {
            try {
                const parsedSettings = JSON.parse(saved);
                Object.assign(settings, parsedSettings);
                applySettings();
                updateUI();
            } catch (e) {
                console.warn('Failed to load accessibility settings');
            }
        }
    }
    
    // Save settings to localStorage
    function saveSettings() {
        localStorage.setItem('inclove-accessibility-settings', JSON.stringify(settings));
        showSuccessMessage();
        applySettings();
    }
    
    // Apply settings to the page
    function applySettings() {
        // Font size
        document.documentElement.style.fontSize = settings.fontSize + 'px';
        
        // Contrast mode
        document.body.classList.remove('high-contrast', 'dark-mode');
        if (settings.contrastMode === 'high') {
            document.body.classList.add('high-contrast');
        } else if (settings.contrastMode === 'dark') {
            document.body.classList.add('dark-mode');
        }
        
        // Color blind support
        document.body.classList.remove('protanopia', 'deuteranopia', 'tritanopia');
        if (settings.colorBlind !== 'normal') {
            document.body.classList.add(settings.colorBlind);
        }
        
        // Reduced motion
        if (settings.reduceMotion) {
            document.body.classList.add('reduced-motion');
            document.documentElement.style.setProperty('--transition-fast', '0ms');
            document.documentElement.style.setProperty('--transition-normal', '0ms');
            document.documentElement.style.setProperty('--transition-slow', '0ms');
        } else {
            document.body.classList.remove('reduced-motion');
            document.documentElement.style.removeProperty('--transition-fast');
            document.documentElement.style.removeProperty('--transition-normal');
            document.documentElement.style.removeProperty('--transition-slow');
        }
        
        // Enhanced focus indicators
        if (settings.focusIndicators) {
            document.body.classList.add('enhanced-focus');
        } else {
            document.body.classList.remove('enhanced-focus');
        }
        
        // Screen reader enhancements
        if (settings.screenReader) {
            document.body.classList.add('screen-reader-mode');
            enableScreenReaderFeatures();
        } else {
            document.body.classList.remove('screen-reader-mode');
            disableScreenReaderFeatures();
        }
        
        // Update preview
        updatePreview();
    }
    
    // Update UI elements to reflect current settings
    function updateUI() {
        // Font size slider
        const fontSizeSlider = document.getElementById('font-size');
        if (fontSizeSlider) {
            fontSizeSlider.value = settings.fontSize;
        }
        
        // Contrast mode select
        const contrastSelect = document.getElementById('contrast-mode');
        if (contrastSelect) {
            contrastSelect.value = settings.contrastMode;
        }
        
        // Color blind select
        const colorBlindSelect = document.getElementById('color-blind');
        if (colorBlindSelect) {
            colorBlindSelect.value = settings.colorBlind;
        }
        
        // Toggle switches
        const toggles = {
            'reduce-motion': 'reduceMotion',
            'screen-reader': 'screenReader',
            'voice-commands': 'voiceCommands',
            'sound-effects': 'soundEffects',
            'keyboard-nav': 'keyboardNav',
            'focus-indicators': 'focusIndicators',
            'skip-links': 'skipLinks',
            'auto-captions': 'autoCaptions',
            'sign-language': 'signLanguage'
        };
        
        Object.entries(toggles).forEach(([id, setting]) => {
            const toggle = document.getElementById(id);
            if (toggle) {
                toggle.checked = settings[setting];
            }
        });
        
        // Message format select
        const messageFormatSelect = document.getElementById('message-format');
        if (messageFormatSelect) {
            messageFormatSelect.value = settings.messageFormat;
        }
    }
    
    // Update preview section
    function updatePreview() {
        const preview = document.querySelector('.preview-content');
        if (preview) {
            preview.style.fontSize = (settings.fontSize / 16) + 'em';
            
            if (settings.contrastMode === 'high') {
                preview.style.background = '#000000';
                preview.style.color = '#ffffff';
            } else if (settings.contrastMode === 'dark') {
                preview.style.background = '#1f2937';
                preview.style.color = '#f9fafb';
            } else {
                preview.style.background = '';
                preview.style.color = '';
            }
        }
    }
    
    // Screen reader features
    function enableScreenReaderFeatures() {
        // Add more descriptive labels
        document.querySelectorAll('img:not([alt])').forEach(img => {
            img.setAttribute('alt', 'Image');
        });
        
        // Add skip links if enabled
        if (settings.skipLinks) {
            addSkipLinks();
        }
        
        // Announce page changes
        announceToScreenReader('Screen reader mode enabled. Enhanced accessibility features are now active.');
    }
    
    function disableScreenReaderFeatures() {
        removeSkipLinks();
    }
    
    function addSkipLinks() {
        if (document.querySelector('.skip-links')) return;
        
        const skipLinks = document.createElement('div');
        skipLinks.className = 'skip-links';
        skipLinks.innerHTML = `
            <a href="#main-content" class="skip-link">Skip to main content</a>
            <a href="#navigation" class="skip-link">Skip to navigation</a>
        `;
        document.body.insertBefore(skipLinks, document.body.firstChild);
    }
    
    function removeSkipLinks() {
        const skipLinks = document.querySelector('.skip-links');
        if (skipLinks) {
            skipLinks.remove();
        }
    }
    
    // Voice commands (basic implementation)
    let recognition = null;
    
    function initVoiceCommands() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('Speech recognition not supported');
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = function(event) {
            const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
            processVoiceCommand(command);
        };
        
        recognition.onerror = function(event) {
            console.warn('Speech recognition error:', event.error);
        };
    }
    
    function processVoiceCommand(command) {
        if (command.includes('save settings')) {
            saveSettings();
            announceToScreenReader('Settings saved');
        } else if (command.includes('reset settings')) {
            resetSettings();
            announceToScreenReader('Settings reset to defaults');
        } else if (command.includes('increase text size')) {
            if (settings.fontSize < 24) {
                settings.fontSize += 2;
                applySettings();
                updateUI();
                announceToScreenReader('Text size increased');
            }
        } else if (command.includes('decrease text size')) {
            if (settings.fontSize > 12) {
                settings.fontSize -= 2;
                applySettings();
                updateUI();
                announceToScreenReader('Text size decreased');
            }
        }
    }
    
    // Event listeners
    function setupEventListeners() {
        // Font size slider
        const fontSizeSlider = document.getElementById('font-size');
        if (fontSizeSlider) {
            fontSizeSlider.addEventListener('input', function() {
                settings.fontSize = parseInt(this.value);
                applySettings();
                announceToScreenReader(`Text size set to ${settings.fontSize} pixels`);
            });
        }
        
        // Contrast mode select
        const contrastSelect = document.getElementById('contrast-mode');
        if (contrastSelect) {
            contrastSelect.addEventListener('change', function() {
                settings.contrastMode = this.value;
                applySettings();
                announceToScreenReader(`Contrast mode changed to ${this.value}`);
            });
        }
        
        // Color blind select
        const colorBlindSelect = document.getElementById('color-blind');
        if (colorBlindSelect) {
            colorBlindSelect.addEventListener('change', function() {
                settings.colorBlind = this.value;
                applySettings();
                announceToScreenReader(`Color vision filter changed to ${this.value}`);
            });
        }
        
        // Toggle switches
        const toggles = {
            'reduce-motion': 'reduceMotion',
            'screen-reader': 'screenReader',
            'voice-commands': 'voiceCommands',
            'sound-effects': 'soundEffects',
            'keyboard-nav': 'keyboardNav',
            'focus-indicators': 'focusIndicators',
            'skip-links': 'skipLinks',
            'auto-captions': 'autoCaptions',
            'sign-language': 'signLanguage'
        };
        
        Object.entries(toggles).forEach(([id, setting]) => {
            const toggle = document.getElementById(id);
            if (toggle) {
                toggle.addEventListener('change', function() {
                    settings[setting] = this.checked;
                    
                    // Special handling for voice commands
                    if (setting === 'voiceCommands') {
                        if (this.checked) {
                            initVoiceCommands();
                            if (recognition) {
                                recognition.start();
                            }
                        } else if (recognition) {
                            recognition.stop();
                        }
                    }
                    
                    applySettings();
                    announceToScreenReader(`${setting} ${this.checked ? 'enabled' : 'disabled'}`);
                });
            }
        });
        
        // Message format select
        const messageFormatSelect = document.getElementById('message-format');
        if (messageFormatSelect) {
            messageFormatSelect.addEventListener('change', function() {
                settings.messageFormat = this.value;
                announceToScreenReader(`Message format changed to ${this.value}`);
            });
        }
        
        // Save button
        const saveButton = document.getElementById('save-settings');
        if (saveButton) {
            saveButton.addEventListener('click', saveSettings);
        }
        
        // Reset button
        const resetButton = document.getElementById('reset-settings');
        if (resetButton) {
            resetButton.addEventListener('click', resetSettings);
        }
    }
    
    // Reset settings to defaults
    function resetSettings() {
        Object.assign(settings, {
            fontSize: 16,
            contrastMode: 'normal',
            colorBlind: 'normal',
            reduceMotion: false,
            screenReader: false,
            voiceCommands: false,
            soundEffects: true,
            keyboardNav: false,
            focusIndicators: false,
            skipLinks: false,
            messageFormat: 'text',
            autoCaptions: false,
            signLanguage: false
        });
        
        applySettings();
        updateUI();
        saveSettings();
        announceToScreenReader('All settings have been reset to defaults');
    }
    
    // Show success message
    function showSuccessMessage() {
        const successMessage = document.getElementById('success-message');
        if (successMessage) {
            successMessage.classList.add('show');
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 3000);
        }
    }
    
    // Screen reader announcement function
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (document.body.contains(announcement)) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+S to save settings
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveSettings();
        }
        
        // Ctrl+R to reset settings
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            resetSettings();
        }
        
        // Alt+1 through Alt+4 for quick font size changes
        if (e.altKey && e.key >= '1' && e.key <= '4') {
            e.preventDefault();
            const sizes = [12, 16, 20, 24];
            settings.fontSize = sizes[parseInt(e.key) - 1];
            applySettings();
            updateUI();
            announceToScreenReader(`Text size set to ${settings.fontSize} pixels`);
        }
    });
    
    // Initialize everything
    loadSettings();
    setupEventListeners();
    
    // Announce page load
    setTimeout(() => {
        announceToScreenReader('Accessibility settings page loaded. Use Tab to navigate between options, or press Ctrl+S to save settings.');
    }, 1000);
});