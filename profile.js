@@ .. @@
             showEditModal: false,
             showNotificationModal: false,
-            showAccessibilityPanel: false,
             showNotification: false,
             notificationMessage: '',
             notifications: {
@@ -49,12 +48,6 @@
                 profileViews: false,
                 emailNotifications: true
             },
-            // Accessibility settings
-            zoomLevel: 1,
-            screenReaderEnabled: false,
-            highContrastEnabled: false,
-            colorBlindMode: 'none',
             speechSynthesis: null,
             typingTimeout: null
         }
@@ .. @@
     methods: {
         speak(text) {
-            if (this.screenReaderEnabled && 'speechSynthesis' in window) {
+            if (window.incloveAccessibility && window.incloveAccessibility.settings.screenReader && 'speechSynthesis' in window) {
                 window.speechSynthesis.cancel();
                 const utterance = new SpeechSynthesisUtterance(text);
                 utterance.rate = 0.8;
@@ .. @@
         },

         speakTyping(field, value) {
-            if (!this.screenReaderEnabled) return;
+            if (!window.incloveAccessibility || !window.incloveAccessibility.settings.screenReader) return;

             clearTimeout(this.typingTimeout);
             this.typingTimeout = setTimeout(() => {
@@ .. @@
             this.showNotification('Notification preferences saved!');
             this.speak('Notification settings saved');
         },

-        // Accessibility methods
-        toggleAccessibilityPanel() {
-            this.showAccessibilityPanel = !this.showAccessibilityPanel;
-            this.speak(this.showAccessibilityPanel ? 'Opened accessibility panel' : 'Closed accessibility panel');
-        },
-
-        updateZoom() {
-            document.body.className = document.body.className.replace(/zoom-\d+/, '') + ` zoom-${this.zoomLevel}`;
-            this.speak(`Zoom level changed to ${this.zoomLevel === '1' ? 'normal' : this.zoomLevel === '2' ? 'large' : 'extra large'}`);
-        },
-
-        toggleScreenReader() {
-            this.speak(this.screenReaderEnabled ? 'Screen reader enabled' : 'Screen reader disabled');
-        },
-
-        toggleHighContrast() {
-            if (this.highContrastEnabled) {
-                document.body.classList.add('high-contrast');
-                this.speak('High contrast mode enabled');
-            } else {
-                document.body.classList.remove('high-contrast');
-                this.speak('High contrast mode disabled');
-            }
-        },
-
-        updateColorBlindMode() {
-            // Remove existing colorblind classes
-            document.body.classList.remove('colorblind-deuteranopia', 'colorblind-protanopia', 'colorblind-tritanopia');
-
-            if (this.colorBlindMode !== 'none') {
-                document.body.classList.add(`colorblind-${this.colorBlindMode}`);
-                this.speak(`Color blindness support enabled for ${this.colorBlindMode}`);
-            } else {
-                this.speak('Color blindness support disabled');
-            }
-        }
+        // Removed accessibility methods - using global system
     },

     mounted() {
-        // Initialize accessibility settings
-        this.updateZoom();
-
         // Add keyboard navigation support
         document.addEventListener('keydown', (e) => {
             // ESC key to close modals
@@ -318,9 +270,6 @@
                 this.closeEditModal();
             } else if (this.showNotificationModal) {
                 this.closeNotificationModal();
-            } else if (this.showAccessibilityPanel) {
-                this.toggleAccessibilityPanel();
             }
         }

@@ .. @@
             if (e.altKey && e.key === 'a') {
                 e.preventDefault();
-                this.toggleAccessibilityPanel();
+                if (window.incloveAccessibility) {
+                    window.incloveAccessibility.toggleAccessibilityPanel();
+                }
             }
         });