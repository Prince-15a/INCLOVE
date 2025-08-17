@@ .. @@
   data() {
     return {
       currentProfileIndex: 0,
       isTransitioning: false,
       cardTransition: '',
-      accessibilityMenuOpen: false,
-      screenReaderEnabled: false,
-      zoomLevel: 100,
-      highContrastEnabled: false,
-      colorblindFriendlyEnabled: false,
-      voiceCommandsEnabled: false,
       isListening: false,
       voiceStatus: 'Listening for commands...',
       recognition: null,
@@ .. @@
     this.setupKeyboardNavigation();
   },
   methods: {
     initializeAccessibility() {
       // Initialize Speech Recognition
       if ('webkitSpeechRecognition' in window) {
         this.recognition = new webkitSpeechRecognition();
         this.recognition.continuous = true;
         this.recognition.interimResults = true;
         this.recognition.lang = 'en-US';

         this.recognition.onresult = (event) => {
           const result = event.results[event.results.length - 1];
           if (result.isFinal) {
             this.processVoiceCommand(result[0].transcript.toLowerCase());
           }
         };

         this.recognition.onerror = () => {
           this.voiceStatus = 'Voice recognition error. Please try again.';
         };

         this.recognition.onend = () => {
-          if (this.voiceCommandsEnabled && this.isListening) {
+          if (window.incloveAccessibility && window.incloveAccessibility.settings.voiceCommands && this.isListening) {
             this.recognition.start();
           }
         };
       }

       // Initialize Speech Synthesis
       this.speechSynthesis = window.speechSynthesis;
     },
@@ .. @@
       });
     },

-    toggleAccessibilityMenu() {
-      this.accessibilityMenuOpen = !this.accessibilityMenuOpen;
-      const toggle = document.querySelector('.accessibility-toggle');
-      toggle.setAttribute('aria-expanded', this.accessibilityMenuOpen.toString());
-    },
-
-    toggleScreenReader() {
-      this.screenReaderEnabled = !this.screenReaderEnabled;
-      if (this.screenReaderEnabled) {
-        this.readProfileAloud();
-      }
-    },
-
     readProfileAloud() {
       if (!this.speechSynthesis) return;

       this.speechSynthesis.cancel();
@@ .. @@
       this.speechSynthesis.speak(utterance);
     },

-    zoomIn() {
-      if (this.zoomLevel < 200) {
-        this.zoomLevel += 25;
-        this.announceZoomChange();
-      }
-    },
-
-    zoomOut() {
-      if (this.zoomLevel > 50) {
-        this.zoomLevel -= 25;
-        this.announceZoomChange();
-      }
-    },
-
-    announceZoomChange() {
-      if (this.screenReaderEnabled && this.speechSynthesis) {
-        const utterance = new SpeechSynthesisUtterance(`Zoom level ${this.zoomLevel} percent`);
-        utterance.volume = 0.5;
-        this.speechSynthesis.speak(utterance);
-      }
-    },
-
-    toggleHighContrast() {
-      this.highContrastEnabled = !this.highContrastEnabled;
-      document.body.classList.toggle('high-contrast', this.highContrastEnabled);
-      this.announceAccessibilityChange('High contrast', this.highContrastEnabled);
-    },
-
-    toggleColorblindFriendly() {
-      this.colorblindFriendlyEnabled = !this.colorblindFriendlyEnabled;
-      document.body.classList.toggle('colorblind-friendly', this.colorblindFriendlyEnabled);
-      this.announceAccessibilityChange('Colorblind friendly mode', this.colorblindFriendlyEnabled);
-    },
-
-    toggleVoiceCommands() {
-      this.voiceCommandsEnabled = !this.voiceCommandsEnabled;
-
-      if (this.voiceCommandsEnabled && this.recognition) {
-        this.startListening();
-      } else {
-        this.stopListening();
-      }
-
-      this.announceAccessibilityChange('Voice commands', this.voiceCommandsEnabled);
-    },
-
     startListening() {
       if (!this.recognition) return;

       this.isListening = true;
@@ .. @@
       }
     },

-    announceAccessibilityChange(feature, enabled) {
-      if (this.speechSynthesis) {
-        const status = enabled ? 'enabled' : 'disabled';
-        const utterance = new SpeechSynthesisUtterance(`${feature} ${status}`);
-        utterance.volume = 0.7;
-        this.speechSynthesis.speak(utterance);
-      }
-    },
-
     likeProfile() {
       if (this.isTransitioning) return;

       this.isTransitioning = true;
       this.cardTransition = 'card-transition-like';

-      if (this.screenReaderEnabled) {
+      if (window.incloveAccessibility && window.incloveAccessibility.settings.screenReader) {
         this.speak(`You liked ${this.currentProfile.name}`);
       }

       this.createHeartEffect();
@@ .. @@
       this.isTransitioning = true;
       this.cardTransition = 'card-transition-dislike';

-      if (this.screenReaderEnabled) {
+      if (window.incloveAccessibility && window.incloveAccessibility.settings.screenReader) {
         this.speak(`You passed on ${this.currentProfile.name}`);
       }

       setTimeout(() => {
@@ .. @@
     },

     messageProfile() {
-      if (this.screenReaderEnabled) {
+      if (window.incloveAccessibility && window.incloveAccessibility.settings.screenReader) {
         this.speak(`Opening chat with ${this.currentProfile.name}`);
       }

       // Create bounce effect
@@ .. @@
         this.cardTransition = '';
         this.isTransitioning = false;

-        if (this.screenReaderEnabled) {
+        if (window.incloveAccessibility && window.incloveAccessibility.settings.screenReader) {
           setTimeout(() => {
             this.readProfileAloud();
           }, 300);