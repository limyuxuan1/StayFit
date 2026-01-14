// StayFit - JavaScript Interactivity
// Features: Smooth scrolling, FAQ toggles, scroll animations

// Wait for DOM to be fully loaded before running any code
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎉 StayFit DOM loaded - initializing...');

    // ==========================================
    // Helper function to open n8n chat
    // ==========================================
    function openN8NChat() {
        console.log('Attempting to open n8n chat...');
        
        // Try multiple selectors to find the n8n chat widget button
        const selectors = [
            'button[aria-label*="chat" i]',
            'button[class*="chat" i]',
            '[data-key="chat"]',
            '.n8n-chat',
            '#n8n-chat',
            'iframe[title*="chat" i]'
        ];
        
        let chatButton = null;
        for (const selector of selectors) {
            chatButton = document.querySelector(selector);
            if (chatButton) {
                console.log('Found chat button with selector:', selector);
                break;
            }
        }
        
        if (chatButton) {
            chatButton.click();
            console.log('Chat button clicked!');
        } else {
            // Try looking in shadow DOM or iframes
            const iframes = document.querySelectorAll('iframe');
            console.log('Searching in iframes, found:', iframes.length);
            
            // Fallback: just let user know
            console.log('Chat widget button not found. Widget may still be loading.');
        }
    }

    // ==========================================
    // 1. Smooth Scrolling for Navigation Links
    // ==========================================
    const navLinks = document.querySelectorAll('.nav-link');
    console.log('Found nav links:', navLinks.length);
    
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            console.log('Nav link clicked:', targetId);

            if (targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ==========================================
    // 2. FAQ Accordion Toggle
    // ==========================================
    const faqItems = document.querySelectorAll('.faq-item');
    console.log('Found FAQ items:', faqItems.length);

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            console.log('FAQ clicked');
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // ==========================================
    // 3. Navigation "Chat with AI Coach" Button
    // ==========================================
    const openChatBtn = document.getElementById('openChatBtn');
    console.log('Chat button found:', !!openChatBtn);

    if (openChatBtn) {
        openChatBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Open chat button clicked!');
            openN8NChat();
        });
    }

    // ==========================================
    // 4. Hero Call-to-Action Buttons
    // ==========================================
    const startJourneyBtn = document.getElementById('startJourneyBtn');
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    console.log('Hero buttons found:', !!startJourneyBtn, !!learnMoreBtn);

    if (startJourneyBtn) {
        startJourneyBtn.addEventListener('click', () => {
            console.log('Start Journey button clicked!');
            openN8NChat();
        });
    }

    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', () => {
            console.log('Learn More button clicked!');
            const fitnessSection = document.getElementById('fitness-areas');
            if (fitnessSection) {
                fitnessSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // ==========================================
    // 5. Fitness Card Buttons
    // ==========================================
    const fitnessCards = document.querySelectorAll('.btn-card');
    console.log('Found fitness card buttons:', fitnessCards.length);

    fitnessCards.forEach(btn => {
        // Store original button text
        const originalText = btn.textContent;
        btn.setAttribute('data-original-text', originalText);
        
        btn.addEventListener('click', function () {
            const cardTitle = this.parentElement.querySelector('h3')?.textContent || 'Fitness';
            console.log(`Fitness card clicked: ${cardTitle}`);
            
            // Give user feedback
            this.textContent = '💬 Opening Chat...';
            this.style.opacity = '0.7';
            
            // Open chat widget for personalized guidance
            openN8NChat();
            
            // Restore button after delay
            setTimeout(() => {
                this.textContent = originalText;
                this.style.opacity = '1';
            }, 1500);
        });
    });

    // ==========================================
    // 6. Scroll Animation Observer
    // ==========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe fitness cards
    const cards = document.querySelectorAll('.fitness-card');
    cards.forEach((card, index) => {
        card.classList.add('scroll-fade');
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe FAQ items
    faqItems.forEach((faq, index) => {
        faq.classList.add('scroll-fade');
        faq.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(faq);
    });

    // ==========================================
    // 7. Navbar Scroll Effect
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
    // 8. Page Load Animation
    // ==========================================
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');

    if (heroContent) heroContent.classList.add('fade-in');
    if (heroImage) heroImage.classList.add('fade-in');

    // ==========================================
    // 9. Mobile Menu Detection (future enhancement)
    // ==========================================
    function initMobileMenu() {
        if (window.innerWidth <= 768) {
            console.log('Mobile view detected');
        }
    }

    window.addEventListener('resize', initMobileMenu);
    initMobileMenu();

    // ==========================================
    // 10. Mobile Menu Toggle
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

    console.log('✅ StayFit fully initialized! All buttons ready!');

}); // End of DOMContentLoaded
