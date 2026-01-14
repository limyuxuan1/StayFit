// Cardio Page JavaScript
// Features: Smooth scrolling, animations, chat integration

document.addEventListener('DOMContentLoaded', function() {
    console.log('🏃 Cardio page loaded!');

    // Wait a bit for n8n chat widget to fully initialize
    let chatWidgetReady = false;
    
    // Check for chat widget every 500ms for up to 10 seconds
    const checkWidget = setInterval(() => {
        const allElements = document.querySelectorAll('*');
        for (const el of allElements) {
            if (el.shadowRoot || 
                el.tagName === 'IFRAME' ||
                el.className?.toString().includes('n8n') ||
                el.className?.toString().includes('chat')) {
                chatWidgetReady = true;
                clearInterval(checkWidget);
                console.log('✅ n8n chat widget detected and ready!');
                break;
            }
        }
    }, 500);
    
    // Stop checking after 10 seconds
    setTimeout(() => clearInterval(checkWidget), 10000);

    // ==========================================
    // Helper function to open n8n chat
    // ==========================================
    function openN8NChat() {
        console.log('🔍 Attempting to open n8n chat widget...');
        
        // Method 1: Try to find and click the n8n chat toggle button in shadow DOM
        const findAndClickChatButton = () => {
            // Look for the n8n chat root element
            const chatRoot = document.querySelector('n8n-chat');
            if (chatRoot && chatRoot.shadowRoot) {
                const toggleBtn = chatRoot.shadowRoot.querySelector('button');
                if (toggleBtn) {
                    console.log('✅ Found n8n chat button in shadow DOM!');
                    toggleBtn.click();
                    return true;
                }
            }
            
            // Fallback: search all shadow roots
            const allElements = document.querySelectorAll('*');
            for (const el of allElements) {
                if (el.shadowRoot) {
                    const chatBtn = el.shadowRoot.querySelector('button');
                    if (chatBtn) {
                        const btnText = chatBtn.textContent?.toLowerCase() || '';
                        const btnClass = chatBtn.className?.toLowerCase() || '';
                        
                        if (btnText.includes('chat') || btnClass.includes('chat') || btnClass.includes('toggle')) {
                            console.log('✅ Found chat toggle button!');
                            chatBtn.click();
                            return true;
                        }
                    }
                }
            }
            return false;
        };
        
        // Try immediately
        if (findAndClickChatButton()) {
            return;
        }
        
        // If not found, wait a bit and try again
        console.log('⏳ Widget not ready, waiting...');
        setTimeout(() => {
            if (findAndClickChatButton()) {
                return;
            }
            // Last resort: show the default widget
            console.log('💡 Showing helpful message...');
        }, 500);
    }

    // ==========================================
    // Chat Button Handlers
    // ==========================================
    const openChatBtn = document.getElementById('openChatBtn');
    const ctaChatBtn = document.getElementById('ctaChatBtn');

    if (openChatBtn) {
        openChatBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Nav chat button clicked!');
            openN8NChat();
        });
    }

    if (ctaChatBtn) {
        ctaChatBtn.addEventListener('click', () => {
            console.log('CTA chat button clicked!');
            openN8NChat();
        });
    }

    // ==========================================
    // Type Card Buttons
    // ==========================================
    const typeButtons = document.querySelectorAll('.btn-type');
    
    typeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const cardTitle = this.closest('.type-card').querySelector('h3').textContent;
            console.log(`Type button clicked: ${cardTitle}`);
            
            // Visual feedback
            this.textContent = '💬 Opening Chat...';
            this.style.opacity = '0.7';
            
            openN8NChat();
            
            // Restore button
            setTimeout(() => {
                this.textContent = 'Chat with Coach';
                this.style.opacity = '1';
            }, 1500);
        });
    });

    // ==========================================
    // Scroll Animations
    // ==========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    const elementsToAnimate = document.querySelectorAll(
        '.benefit-card, .type-card, .plan-card, .tip-card, .zone-card'
    );
    
    elementsToAnimate.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });

    // ==========================================
    // Navbar Scroll Effect
    // ==========================================
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }
    });

    // ==========================================
    // Mobile Menu Toggle
    // ==========================================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            console.log('Mobile menu toggled');
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link, .btn-chat');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // ==========================================
    // Heart Rate Calculator
    // ==========================================
    const ageInput = document.getElementById('ageInput');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsDiv = document.getElementById('calculatorResults');

    if (calculateBtn && ageInput && resultsDiv) {
        calculateBtn.addEventListener('click', calculateHeartRateZones);
        
        // Allow Enter key to calculate
        ageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                calculateHeartRateZones();
            }
        });
    }

    function calculateHeartRateZones() {
        const age = parseInt(ageInput.value);

        // Validation
        if (!age || age < 10 || age > 100) {
            alert('Please enter a valid age between 10 and 100');
            ageInput.focus();
            return;
        }

        // Calculate Maximum Heart Rate
        const mhr = 220 - age;

        // Calculate zones
        const zones = {
            zone1: { min: Math.round(mhr * 0.50), max: Math.round(mhr * 0.60) },
            zone2: { min: Math.round(mhr * 0.60), max: Math.round(mhr * 0.70) },
            zone3: { min: Math.round(mhr * 0.70), max: Math.round(mhr * 0.80) },
            zone4: { min: Math.round(mhr * 0.80), max: Math.round(mhr * 0.90) },
            zone5: { min: Math.round(mhr * 0.90), max: Math.round(mhr * 1.00) }
        };

        // Display results
        document.getElementById('mhrValue').textContent = mhr;
        document.getElementById('zone1').textContent = `${zones.zone1.min} - ${zones.zone1.max} bpm`;
        document.getElementById('zone2').textContent = `${zones.zone2.min} - ${zones.zone2.max} bpm`;
        document.getElementById('zone3').textContent = `${zones.zone3.min} - ${zones.zone3.max} bpm`;
        document.getElementById('zone4').textContent = `${zones.zone4.min} - ${zones.zone4.max} bpm`;
        document.getElementById('zone5').textContent = `${zones.zone5.min} - ${zones.zone5.max} bpm`;

        // Show results with animation
        resultsDiv.classList.remove('hidden');
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        console.log(`Calculated heart rate zones for age ${age}: MHR = ${mhr}`);
    }

    console.log('✅ Cardio page fully initialized!');
});
