@@ .. @@
     data() {
         return {
             announcement: '',
-            showAccessibilityMenu: false,
             showSuccessPopup: false,
             showToast: false,
             toastMessage: '',
@@ .. @@
                 notifications: {
                     matches: true,
                     messages: true,
                     likes: false,
                     email: true
-                }
-            },
-            accessibility: {
-                screenReader: false,
-                highContrast: false,
-                colorBlindFriendly: false,
-                zoomLevel: 100
+                },
+                dataUsage: 'optimized',
+                autoBackup: true,
+                analyticsOptOut: false,
+                theme: 'auto'
             },
             availableLanguages: [
@@ .. @@
         // Accessibility methods
-        toggleAccessibilityMenu() {
-            this.showAccessibilityMenu = !this.showAccessibilityMenu;
-            this.announce(this.showAccessibilityMenu ? 'Accessibility menu opened' : 'Accessibility menu closed');
-        },
-
-        toggleScreenReader() {
-            this.accessibility.screenReader = !this.accessibility.screenReader;
-            this.announce(`Screen reader ${this.accessibility.screenReader ? 'enabled' : 'disabled'}`);
-
-            if (this.accessibility.screenReader) {
-                this.enableScreenReader();
-            } else {
-                this.disableScreenReader();
-            }
-        },
-
-        enableScreenReader() {
-            document.addEventListener('mouseover', this.handleMouseOver);
-            document.addEventListener('focus', this.handleFocus, true);
-            document.addEventListener('input', this.handleInput);
-            document.addEventListener('change', this.handleChange);
-            this.showToast('Screen reader mode enabled', 'success');
-            this.speak('Screen reader mode enabled. I will now read everything you interact with.');
-        },
-
-        disableScreenReader() {
-            document.removeEventListener('mouseover', this.handleMouseOver);
-            document.removeEventListener('focus', this.handleFocus, true);
-            document.removeEventListener('input', this.handleInput);
-            document.removeEventListener('change', this.handleChange);
-            this.showToast('Screen reader mode disabled', 'success');
-            this.speak('Screen reader mode disabled.');
-        },
-
-        handleMouseOver(event) {
-            if (this.accessibility.screenReader) {
-                const element = event.target;
-                const text = this.getElementText(element);
-                if (text && text.length > 0 && text.length < 200) {
-                    this.speak(text);
-                }
-            }
-        },
-
-        handleFocus(event) {
-            if (this.accessibility.screenReader) {
-                const element = event.target;
-                const text = this.getElementText(element);
-                if (text) {
-                    this.speak(`Focused on: ${text}`);
-                }
-            }
-        },
-
-        handleInput(event) {
-            if (this.accessibility.screenReader) {
-                const element = event.target;
-                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
-                    const label = this.getElementLabel(element);
-                    const value = element.value;
-                    if (value.length === 1) {
-                        this.speak(`Typing in ${label}: ${value}`);
-                    }
-                }
-            }
-        },
-
-        handleChange(event) {
-            if (this.accessibility.screenReader) {
-                const element = event.target;
-                const text = this.getElementText(element);
-                if (element.tagName === 'SELECT') {
-                    this.speak(`Selection changed to: ${element.value}`);
-                } else if (element.type === 'checkbox') {
-                    const label = this.getElementLabel(element);
-                    this.speak(`${label} ${element.checked ? 'checked' : 'unchecked'}`);
-                } else if (element.type === 'range') {
-                    const label = this.getElementLabel(element);
-                    this.speak(`${label} set to ${element.value}`);
-                }
-            }
-        },
-
-        getElementText(element) {
-            // Get meaningful text from element
-            if (element.getAttribute('aria-label')) {
-                return element.getAttribute('aria-label');
-            }
-
-            if (element.tagName === 'INPUT') {
-                const label = this.getElementLabel(element);
-                if (element.type === 'checkbox') {
-                    return `${label} checkbox, ${element.checked ? 'checked' : 'not checked'}`;
-                } else if (element.type === 'range') {
-                    return `${label} slider, value ${element.value}`;
-                } else {
-                    return label || element.placeholder || 'Input field';
-                }
-            }
-
-            if (element.tagName === 'BUTTON') {
-                return element.textContent?.trim() || 'Button';
-            }
-
-            if (element.tagName === 'SELECT') {
-                const label = this.getElementLabel(element);
-                return `${label}, selected: ${element.options[element.selectedIndex]?.text || element.value}`;
-            }
-
-            if (element.tagName === 'LABEL') {
-                return element.textContent?.trim();
-            }
-
-            if (element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3') {
-                return `Heading: ${element.textContent?.trim()}`;
-            }
-
-            const text = element.textContent?.trim();
-            return text && text.length > 2 ? text : '';
-        },
-
-        getElementLabel(element) {
-            // Try to find label for input element
-            if (element.id) {
-                const label = document.querySelector(`label[for="${element.id}"]`);
-                if (label) return label.textContent?.trim();
-            }
-
-            // Check if element is inside a label
-            const parentLabel = element.closest('label');
-            if (parentLabel) return parentLabel.textContent?.trim();
-
-            // Check for aria-label
-            if (element.getAttribute('aria-label')) {
-                return element.getAttribute('aria-label');
-            }
-
-            return 'Input field';
-        },
-
-        speak(text) {
-            if (this.speechSynthesis && text) {
-                // Cancel any ongoing speech
-                this.speechSynthesis.cancel();
-
-                // Create new utterance
-                const utterance = new SpeechSynthesisUtterance(text);
-                utterance.rate = 1.2;
-                utterance.pitch = 1;
-                utterance.volume = 0.8;
-
-                // Speak the text
-                this.speechSynthesis.speak(utterance);
-            }
-        },
-
-        toggleHighContrast() {
-            this.accessibility.highContrast = !this.accessibility.highContrast;
-
-            if (this.accessibility.highContrast) {
-                document.body.classList.add('high-contrast');
-                this.showToast('High contrast mode enabled', 'success');
-                this.announce('High contrast mode enabled');
-            } else {
-                document.body.classList.remove('high-contrast');
-                this.showToast('High contrast mode disabled', 'success');
-                this.announce('High contrast mode disabled');
-            }
-        },
-
-        toggleColorBlindFriendly() {
-            this.accessibility.colorBlindFriendly = !this.accessibility.colorBlindFriendly;
-
-            if (this.accessibility.colorBlindFriendly) {
-                document.body.classList.add('color-blind-friendly');
-                this.showToast('Color blind friendly mode enabled', 'success');
-                this.announce('Color blind friendly mode enabled');
-            } else {
-                document.body.classList.remove('color-blind-friendly');
-                this.showToast('Color blind friendly mode disabled', 'success');
-                this.announce('Color blind friendly mode disabled');
-            }
-        },
-
-        zoomIn() {
-            if (this.accessibility.zoomLevel < 200) {
-                this.accessibility.zoomLevel += 10;
-                this.applyZoom();
-                this.announce(`Zoom level increased to ${this.accessibility.zoomLevel}%`);
-            }
-        },
-
-        zoomOut() {
-            if (this.accessibility.zoomLevel > 50) {
-                this.accessibility.zoomLevel -= 10;
-                this.applyZoom();
-                this.announce(`Zoom level decreased to ${this.accessibility.zoomLevel}%`);
-            }
-        },
-
-        applyZoom() {
-            document.body.style.zoom = `${this.accessibility.zoomLevel}%`;
-            this.showToast(`Zoom level set to ${this.accessibility.zoomLevel}%`, 'success');
-        },
+        // Removed accessibility methods - using global system
+        
+        exportData() {
+            this.showToast('Data export initiated. You will receive an email with download link.', 'success');
+            this.announce('Data export request submitted');
+        },

         announce(message) {
             this.announcement = message;
-            // Also speak if screen reader is enabled
-            if (this.accessibility.screenReader) {
-                this.speak(message);
+            // Also speak if global screen reader is enabled
+            if (window.incloveAccessibility && window.incloveAccessibility.settings.screenReader) {
+                window.incloveAccessibility.speak(message);
             }
             // Clear announcement after a brief moment so it can be announced again if needed
@@ .. @@
             // In a real app, this would call an API to delete the account
             this.showToast('Account deletion initiated. You will be redirected shortly...', 'error');
-            this.speak('Account deletion initiated. Goodbye from IncLove!');
+            if (window.incloveAccessibility) {
+                window.incloveAccessibility.speak('Account deletion initiated. Goodbye from IncLove!');
+            }

             // Simulate redirect after showing message
             setTimeout(() => {