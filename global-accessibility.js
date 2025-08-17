// Global Accessibility System for Inclove
class IncloveAccessibility {
    constructor() {
        this.settings = {
            screenReader: false,
            highContrast: false,
            colorBlindFriendly: false,
            reduceMotion: false,
            fontSize: 16,
            zoomLevel: 100,
            colorBlindMode: 'none',
            voiceCommands: false
        };
        
        this.speechSynthesis = window.speechSynthesis;
        this.recognition = null;
        this.isListening = false;
        
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.applySettings();
        this.setupKeyboardShortcuts();
        this.initVoiceRecognition();
        this.createAccessibilityPanel();
    }
    
    loadSettings() {
        const saved = localStorage.getItem('inclove-accessibility-settings');
        if (saved) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            } catch (e) {
                console.warn('Failed to load accessibility settings');
            }
        }
    }
    
    saveSettings() {
        localStorage.setItem('inclove-accessibility-settings', JSON.stringify(this.settings));
        this.applySettings();
    }
    
    applySettings() {
        const body = document.body;
        
        // Apply zoom
        if (this.settings.zoomLevel !== 100) {
            body.style.zoom = `${this.settings.zoomLevel}%`;
        }
        
        // Apply font size
        if (this.settings.fontSize !== 16) {
            document.documentElement.style.fontSize = `${this.settings.fontSize}px`;
        }
        
        // Apply high contrast
        body.classList.toggle('high-contrast', this.settings.highContrast);
        
        // Apply color blind friendly
        body.classList.toggle('colorblind-friendly', this.settings.colorBlindFriendly);
        
        // Apply reduced motion
        if (this.settings.reduceMotion) {
            body.classList.add('reduced-motion');
            document.documentElement.style.setProperty('--transition-fast', '0ms');
            document.documentElement.style.setProperty('--transition-normal', '0ms');
        } else {
            body.classList.remove('reduced-motion');
            document.documentElement.style.removeProperty('--transition-fast');
            document.documentElement.style.removeProperty('--transition-normal');
        }
        
        // Apply color blind mode
        body.classList.remove('protanopia', 'deuteranopia', 'tritanopia');
        if (this.settings.colorBlindMode !== 'none') {
            body.classList.add(this.settings.colorBlindMode);
        }
        
        // Screen reader
        if (this.settings.screenReader) {
            this.enableScreenReader();
        }
        
        // Voice commands
        if (this.settings.voiceCommands && !this.isListening) {
            this.startVoiceCommands();
        } else if (!this.settings.voiceCommands && this.isListening) {
            this.stopVoiceCommands();
        }
    }
    
    createAccessibilityPanel() {
        // Remove existing accessibility buttons/panels
        const existingPanels = document.querySelectorAll('.accessibility-panel, .accessibility-toggle');
        existingPanels.forEach(panel => panel.remove());
        
        // Create new unified panel
        const panel = document.createElement('div');
        panel.className = 'global-accessibility-panel';
        panel.innerHTML = `
            <button class="accessibility-toggle" aria-label="Toggle accessibility options">
                ♿
            </button>
            <div class="accessibility-menu">
                <h3>Accessibility Options</h3>
                
                <div class="accessibility-option">
                    <label>Screen Reader</label>
                    <div class="toggle-switch" data-setting="screenReader">
                        <div class="toggle-slider"></div>
                    </div>
                </div>
                
                <div class="accessibility-option">
                    <label>High Contrast</label>
                    <div class="toggle-switch" data-setting="highContrast">
                        <div class="toggle-slider"></div>
                    </div>
                </div>
                
                <div class="accessibility-option">
                    <label>Color Blind Friendly</label>
                    <div class="toggle-switch" data-setting="colorBlindFriendly">
                        <div class="toggle-slider"></div>
                    </div>
                </div>
                
                <div class="accessibility-option">
                    <label>Reduce Motion</label>
                    <div class="toggle-switch" data-setting="reduceMotion">
                        <div class="toggle-slider"></div>
                    </div>
                </div>
                
                <div class="accessibility-option">
                    <label>Voice Commands</label>
                    <div class="toggle-switch" data-setting="voiceCommands">
                        <div class="toggle-slider"></div>
                    </div>
                </div>
                
                <div class="accessibility-option">
                    <label>Font Size</label>
                    <div class="range-control">
                        <input type="range" min="12" max="24" value="${this.settings.fontSize}" data-setting="fontSize">
                        <span class="range-value">${this.settings.fontSize}px</span>
                    </div>
                </div>
                
                <div class="accessibility-option">
                    <label>Zoom Level</label>
                    <div class="range-control">
                        <input type="range" min="50" max="200" step="25" value="${this.settings.zoomLevel}" data-setting="zoomLevel">
                        <span class="range-value">${this.settings.zoomLevel}%</span>
                    </div>
                </div>
                
                <div class="accessibility-option">
                    <label>Color Vision</label>
                    <select data-setting="colorBlindMode">
                        <option value="none">Normal</option>
                        <option value="protanopia">Protanopia</option>
                        <option value="deuteranopia">Deuteranopia</option>
                        <option value="tritanopia">Tritanopia</option>
                    </select>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        this.setupPanelEvents();
        this.updatePanelUI();
    }
    
    setupPanelEvents() {
        const panel = document.querySelector('.global-accessibility-panel');
        const toggle = panel.querySelector('.accessibility-toggle');
        const menu = panel.querySelector('.accessibility-menu');
        
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            this.announce(menu.classList.contains('active') ? 'Accessibility menu opened' : 'Accessibility menu closed');
        });
        
        // Toggle switches
        panel.querySelectorAll('.toggle-switch').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const setting = toggle.dataset.setting;
                this.settings[setting] = !this.settings[setting];
                this.saveSettings();
                this.updatePanelUI();
                this.announce(`${setting} ${this.settings[setting] ? 'enabled' : 'disabled'}`);
            });
        });
        
        // Range inputs
        panel.querySelectorAll('input[type="range"]').forEach(input => {
            input.addEventListener('input', () => {
                const setting = input.dataset.setting;
                this.settings[setting] = parseInt(input.value);
                this.saveSettings();
                this.updatePanelUI();
                
                const unit = setting === 'fontSize' ? 'px' : '%';
                this.announce(`${setting} set to ${input.value}${unit}`);
            });
        });
        
        // Select inputs
        panel.querySelectorAll('select').forEach(select => {
            select.addEventListener('change', () => {
                const setting = select.dataset.setting;
                this.settings[setting] = select.value;
                this.saveSettings();
                this.announce(`${setting} changed to ${select.value}`);
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target)) {
                menu.classList.remove('active');
            }
        });
    }
    
    updatePanelUI() {
        const panel = document.querySelector('.global-accessibility-panel');
        
        // Update toggle switches
        panel.querySelectorAll('.toggle-switch').forEach(toggle => {
            const setting = toggle.dataset.setting;
            toggle.classList.toggle('active', this.settings[setting]);
        });
        
        // Update range values
        panel.querySelectorAll('.range-control').forEach(control => {
            const input = control.querySelector('input');
            const valueSpan = control.querySelector('.range-value');
            const setting = input.dataset.setting;
            
            input.value = this.settings[setting];
            const unit = setting === 'fontSize' ? 'px' : '%';
            valueSpan.textContent = `${this.settings[setting]}${unit}`;
        });
        
        // Update select values
        panel.querySelectorAll('select').forEach(select => {
            const setting = select.dataset.setting;
            select.value = this.settings[setting];
        });
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.altKey) {
                switch (e.key) {
                    case 'a':
                        e.preventDefault();
                        this.toggleAccessibilityPanel();
                        break;
                    case 'c':
                        e.preventDefault();
                        this.toggleSetting('highContrast');
                        break;
                    case 's':
                        e.preventDefault();
                        this.toggleSetting('screenReader');
                        break;
                    case 'v':
                        e.preventDefault();
                        this.toggleSetting('voiceCommands');
                        break;
                }
            }
        });
    }
    
    toggleAccessibilityPanel() {
        const menu = document.querySelector('.accessibility-menu');
        menu.classList.toggle('active');
    }
    
    toggleSetting(setting) {
        this.settings[setting] = !this.settings[setting];
        this.saveSettings();
        this.updatePanelUI();
        this.announce(`${setting} ${this.settings[setting] ? 'enabled' : 'disabled'}`);
    }
    
    enableScreenReader() {
        document.addEventListener('mouseover', this.handleMouseOver.bind(this));
        document.addEventListener('focus', this.handleFocus.bind(this), true);
    }
    
    handleMouseOver(event) {
        if (!this.settings.screenReader) return;
        
        const element = event.target;
        const text = this.getElementText(element);
        if (text && text.length > 0 && text.length < 200) {
            this.speak(text);
        }
    }
    
    handleFocus(event) {
        if (!this.settings.screenReader) return;
        
        const element = event.target;
        const text = this.getElementText(element);
        if (text) {
            this.speak(`Focused on: ${text}`);
        }
    }
    
    getElementText(element) {
        if (element.getAttribute('aria-label')) {
            return element.getAttribute('aria-label');
        }
        
        if (element.tagName === 'BUTTON') {
            return element.textContent?.trim() || 'Button';
        }
        
        if (element.tagName === 'A') {
            return element.textContent?.trim() || 'Link';
        }
        
        if (element.tagName === 'INPUT') {
            const label = this.getInputLabel(element);
            return label || element.placeholder || 'Input field';
        }
        
        return element.textContent?.trim();
    }
    
    getInputLabel(element) {
        if (element.id) {
            const label = document.querySelector(`label[for="${element.id}"]`);
            if (label) return label.textContent?.trim();
        }
        
        const parentLabel = element.closest('label');
        if (parentLabel) return parentLabel.textContent?.trim();
        
        return null;
    }
    
    initVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onresult = (event) => {
                const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
                this.processVoiceCommand(command);
            };
        }
    }
    
    startVoiceCommands() {
        if (this.recognition) {
            this.isListening = true;
            this.recognition.start();
            this.announce('Voice commands enabled');
        }
    }
    
    stopVoiceCommands() {
        if (this.recognition) {
            this.isListening = false;
            this.recognition.stop();
            this.announce('Voice commands disabled');
        }
    }
    
    processVoiceCommand(command) {
        if (command.includes('accessibility') || command.includes('settings')) {
            this.toggleAccessibilityPanel();
        } else if (command.includes('high contrast')) {
            this.toggleSetting('highContrast');
        } else if (command.includes('screen reader')) {
            this.toggleSetting('screenReader');
        }
    }
    
    speak(text) {
        if (this.speechSynthesis && this.settings.screenReader) {
            this.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            this.speechSynthesis.speak(utterance);
        }
    }
    
    announce(message) {
        // Create or update screen reader announcement
        let announcer = document.getElementById('global-announcer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'global-announcer';
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.className = 'sr-only';
            document.body.appendChild(announcer);
        }
        
        announcer.textContent = '';
        setTimeout(() => {
            announcer.textContent = message;
        }, 100);
        
        // Also speak if screen reader is enabled
        if (this.settings.screenReader) {
            this.speak(message);
        }
    }
}

// Initialize global accessibility when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.incloveAccessibility = new IncloveAccessibility();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IncloveAccessibility;
}