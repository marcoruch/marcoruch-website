/**
 * GDPR Consent Manager for Marco Ruch's Portfolio
 * Handles cookie consent and Firebase Analytics integration
 */

console.log('Consent manager script loaded');

class ConsentManager {
    constructor() {
        console.log('ConsentManager constructor called');
        this.consentKey = 'mr_consent_preferences';
        this.consentVersion = '1.0';
        this.consentData = this.loadConsent();
        this.firebase = null;
        this.analytics = null;
        
        console.log('About to call init()');
        this.init();
        console.log('ConsentManager constructor completed');
    }

    init() {
        console.log('Init method called');
        try {
            this.createConsentBanner();
            console.log('Consent banner created');
            this.createConsentModal();
            console.log('Consent modal created');
            this.createPrivacyIndicator();
            console.log('Privacy indicator created');
            this.checkConsentStatus();
            console.log('Consent status checked');
            this.bindEvents();
            console.log('Events bound');
        } catch (error) {
            console.error('Error in init method:', error);
        }
    }

    loadConsent() {
        try {
            const stored = localStorage.getItem(this.consentKey);
            if (stored) {
                const data = JSON.parse(stored);
                // Check if consent version matches
                if (data.version === this.consentVersion) {
                    return data;
                }
            }
        } catch (e) {
            console.log('No previous consent found');
        }
        
        return {
            version: this.consentVersion,
            timestamp: null,
            analytics: false,
            marketing: false,
            functional: true, // Always true for essential functionality
            necessary: true   // Always true for essential cookies
        };
    }

    saveConsent() {
        this.consentData.timestamp = new Date().toISOString();
        localStorage.setItem(this.consentKey, JSON.stringify(this.consentData));
        this.applyConsent();
    }

    applyConsent() {
        // Initialize Firebase Analytics if consent given
        if (this.consentData.analytics) {
            this.initFirebaseAnalytics();
        } else {
            this.disableAnalytics();
        }

        // Hide banner after consent
        this.hideConsentBanner();
        this.showPrivacyIndicator();
    }

    async initFirebaseAnalytics() {
        if (this.analytics) return; // Already initialized

        try {
            // Import Firebase modules
            const { initializeApp } = await import('https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js');
            const { getAnalytics, setConsent } = await import('https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js');

            // Firebase configuration
            const firebaseConfig = {
                apiKey: "AIzaSyC69Bs5AxRbOEVQf8cvzA5G5j7P7YEHs9U",
                authDomain: "marcoruch-website.firebaseapp.com",
                projectId: "marcoruch-website",
                storageBucket: "marcoruch-website.firebasestorage.app",
                messagingSenderId: "240785440759",
                appId: "1:240785440759:web:862aa9237bcdd2f7c238f2",
                measurementId: "G-7QH375J4SR"
            };

            // Initialize Firebase
            this.firebase = initializeApp(firebaseConfig);
            this.analytics = getAnalytics(this.firebase);

            // Set consent mode
            setConsent({
                'analytics_storage': this.consentData.analytics ? 'granted' : 'denied',
                'ad_storage': this.consentData.marketing ? 'granted' : 'denied',
                'functionality_storage': 'granted',
                'security_storage': 'granted'
            });

            console.log('Firebase Analytics initialized with consent');

        } catch (error) {
            console.error('Failed to initialize Firebase Analytics:', error);
        }
    }

    disableAnalytics() {
        // Disable analytics tracking
        if (this.analytics) {
            // Analytics is already initialized, just update consent
            const { setConsent } = import('https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js')
                .then(module => {
                    module.setConsent({
                        'analytics_storage': 'denied',
                        'ad_storage': 'denied'
                    });
                });
        }
        
        // Clear any existing analytics cookies/data
        this.clearAnalyticsCookies();
    }

    clearAnalyticsCookies() {
        // Clear Google Analytics cookies
        const cookies = ['_ga', '_ga_G-7QH375J4SR', '_gid', '_gat'];
        cookies.forEach(cookie => {
            document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.marcoruch.ch;`;
        });
    }

    createConsentBanner() {
        const banner = document.createElement('div');
        banner.className = 'consent-banner';
        banner.id = 'consent-banner';
        
        banner.innerHTML = `
            <div class="consent-content">
                <div class="consent-text">
                    <h4>🍪 Your Privacy Matters</h4>
                    <p>I use cookies and analytics to improve your experience and understand how you interact with my portfolio. <a href="privacy.html" class="consent-link" target="_blank">Learn more</a> or choose which cookies to accept.</p>
                </div>
                <div class="consent-actions">
                    <button class="consent-btn consent-btn-accept" id="consent-accept">Accept All</button>
                    <button class="consent-btn consent-btn-decline" id="consent-decline">Decline All</button>
                    <button class="consent-btn consent-btn-settings" id="consent-settings">Settings</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(banner);
    }

    createConsentModal() {
        const modal = document.createElement('div');
        modal.className = 'consent-modal';
        modal.id = 'consent-modal';
        
        modal.innerHTML = `
            <div class="consent-modal-content">
                <div class="consent-modal-header">
                    <h3 class="consent-modal-title">Privacy Settings</h3>
                    <button class="consent-modal-close" id="consent-modal-close">&times;</button>
                </div>
                
                <div class="consent-category">
                    <div class="consent-category-header">
                        <h4 class="consent-category-title">Necessary Cookies</h4>
                        <label class="consent-toggle">
                            <input type="checkbox" checked disabled>
                            <span class="consent-slider"></span>
                        </label>
                    </div>
                    <p class="consent-category-description">
                        Essential cookies required for basic website functionality, navigation, and security. These cannot be disabled.
                    </p>
                </div>

                <div class="consent-category">
                    <div class="consent-category-header">
                        <h4 class="consent-category-title">Functional Cookies</h4>
                        <label class="consent-toggle">
                            <input type="checkbox" id="functional-toggle" checked disabled>
                            <span class="consent-slider"></span>
                        </label>
                    </div>
                    <p class="consent-category-description">
                        Enable enhanced functionality like remembering your preferences and settings.
                    </p>
                </div>

                <div class="consent-category">
                    <div class="consent-category-header">
                        <h4 class="consent-category-title">Analytics Cookies</h4>
                        <label class="consent-toggle">
                            <input type="checkbox" id="analytics-toggle">
                            <span class="consent-slider"></span>
                        </label>
                    </div>
                    <p class="consent-category-description">
                        Help me understand how visitors interact with my portfolio through Google Analytics. This data is anonymized and helps improve the user experience.
                    </p>
                </div>

                <div class="consent-category">
                    <div class="consent-category-header">
                        <h4 class="consent-category-title">Marketing Cookies</h4>
                        <label class="consent-toggle">
                            <input type="checkbox" id="marketing-toggle">
                            <span class="consent-slider"></span>
                        </label>
                    </div>
                    <p class="consent-category-description">
                        Track visits across websites to provide relevant content and advertising. Currently not used but reserved for future features.
                    </p>
                </div>

                <div class="consent-modal-actions">
                    <button class="consent-btn consent-btn-decline" id="modal-decline">Decline All</button>
                    <button class="consent-btn consent-btn-accept" id="modal-save">Save Preferences</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    createPrivacyIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'privacy-indicator';
        indicator.id = 'privacy-indicator';
        indicator.title = 'Privacy Settings';
        
        indicator.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
        `;
        
        document.body.appendChild(indicator);
    }

    bindEvents() {
        // Banner events
        document.getElementById('consent-accept')?.addEventListener('click', () => this.acceptAll());
        document.getElementById('consent-decline')?.addEventListener('click', () => this.declineAll());
        document.getElementById('consent-settings')?.addEventListener('click', () => this.showSettings());

        // Modal events
        document.getElementById('consent-modal-close')?.addEventListener('click', () => this.hideSettings());
        document.getElementById('modal-decline')?.addEventListener('click', () => this.declineAll());
        document.getElementById('modal-save')?.addEventListener('click', () => this.savePreferences());

        // Privacy indicator
        document.getElementById('privacy-indicator')?.addEventListener('click', () => this.showSettings());

        // Close modal on backdrop click
        document.getElementById('consent-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'consent-modal') {
                this.hideSettings();
            }
        });
    }

    checkConsentStatus() {
        if (!this.consentData.timestamp) {
            // No consent given yet
            this.showConsentBanner();
        } else {
            // Consent already given
            this.applyConsent();
        }
    }

    showConsentBanner() {
        const banner = document.getElementById('consent-banner');
        if (banner) {
            setTimeout(() => banner.classList.add('show'), 1000);
        }
    }

    hideConsentBanner() {
        const banner = document.getElementById('consent-banner');
        if (banner) {
            banner.classList.remove('show');
            banner.classList.add('hide');
        }
    }

    showPrivacyIndicator() {
        const indicator = document.getElementById('privacy-indicator');
        if (indicator) {
            setTimeout(() => indicator.classList.add('show'), 2000);
        }
    }

    showSettings() {
        const modal = document.getElementById('consent-modal');
        if (modal) {
            // Update toggles with current preferences
            document.getElementById('analytics-toggle').checked = this.consentData.analytics;
            document.getElementById('marketing-toggle').checked = this.consentData.marketing;
            
            modal.classList.add('show');
        }
    }

    hideSettings() {
        const modal = document.getElementById('consent-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    acceptAll() {
        this.consentData.analytics = true;
        this.consentData.marketing = true;
        this.consentData.functional = true;
        this.consentData.necessary = true;
        this.saveConsent();
    }

    declineAll() {
        this.consentData.analytics = false;
        this.consentData.marketing = false;
        this.consentData.functional = true;  // Keep essential functionality
        this.consentData.necessary = true;   // Keep necessary cookies
        this.saveConsent();
    }

    savePreferences() {
        this.consentData.analytics = document.getElementById('analytics-toggle').checked;
        this.consentData.marketing = document.getElementById('marketing-toggle').checked;
        this.saveConsent();
        this.hideSettings();
    }

    // Public method to get current consent status
    getConsent() {
        return { ...this.consentData };
    }

    // Public method to update consent programmatically
    updateConsent(preferences) {
        Object.assign(this.consentData, preferences);
        this.saveConsent();
    }
}

// Initialize consent manager when DOM is ready
function initConsentManager() {
    console.log('Initializing consent manager...');
    try {
        window.consentManager = new ConsentManager();
        console.log('Consent manager initialized successfully');
    } catch (error) {
        console.error('Failed to initialize consent manager:', error);
    }
}

// Try multiple initialization methods
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConsentManager);
} else {
    // DOM already loaded
    initConsentManager();
}

// Make ConsentManager available globally
window.ConsentManager = ConsentManager;
