document.addEventListener('DOMContentLoaded', () => {
    // Reveal Animations on Scroll
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;

        revealElements.forEach((el) => {
            const revealTop = el.getBoundingClientRect().top;

            if (revealTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    };

    // Initial check
    revealOnScroll();
    
    // Video Scroll Logic
    const heroScrollWrapper = document.querySelector('.hero-scroll-wrapper');
    const heroVideo = document.querySelector('.hero-video-bg') || document.querySelector('.hero-img');
    
    if (heroVideo) {
        // Ensure the video metadata is preloaded before scrubbing
        heroVideo.preload = 'auto';
        heroVideo.pause();
        heroVideo.addEventListener('loadedmetadata', () => {
            onScroll();
        });
    }

    const onScroll = () => {
        revealOnScroll();

        // Control Video Scrubbing
        if (heroScrollWrapper && heroVideo && heroVideo.duration) {
            const rect = heroScrollWrapper.getBoundingClientRect();
            const start = rect.top;
            const end = rect.bottom - window.innerHeight;
            
            if (start <= 0 && end >= 0) {
                const scrollProgress = -start / (rect.height - window.innerHeight);
                heroVideo.currentTime = scrollProgress * heroVideo.duration;
            } else if (start > 0) {
                heroVideo.currentTime = 0;
            } else if (end < 0) {
                heroVideo.currentTime = heroVideo.duration;
            }
        }
    };

    window.addEventListener('scroll', () => {
        requestAnimationFrame(onScroll);
    });

    // Currency Toggle Logic
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const currencyPanels = document.querySelectorAll('.currency-panel');

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            toggleBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const selectedCurrency = btn.getAttribute('data-currency');

            // Hide all panels
            currencyPanels.forEach(panel => {
                panel.classList.remove('active');
            });

            // Show selected panel
            const activePanel = document.getElementById(`panel-${selectedCurrency}`);
            if(activePanel) {
                activePanel.classList.add('active');
                
                // Re-trigger reveal animation for newly visible elements
                setTimeout(() => {
                    revealOnScroll();
                }, 100);
            }
        });
    });

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for navbar
                    behavior: 'smooth'
                });
            }
        });
    });

    // Modal Logic
    const legalLinks = document.querySelectorAll('.legal-link');
    const modals = document.querySelectorAll('.modal-overlay');
    const closeBtns = document.querySelectorAll('.modal-close');

    legalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = link.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modals.forEach(modal => modal.classList.remove('active'));
            document.body.style.overflow = '';
        });
    });

    // Close on outside click
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Smooth Marquee Logic (JS-based to prevent CSS animation jumps on speed change)
    const marquees = document.querySelectorAll('.marquee-track');
    
    marquees.forEach(track => {
        let progress = 0; // 0 to 50% (since 50% is exactly one duplicated set)
        let speed = 0.02; // percent per frame (approx 40s per loop)
        let baseSpeed = 0.02;
        let hoverSpeed = 0.08; // approx 10s per loop on hover
        
        const isRightScroll = track.classList.contains('scroll-right');
        
        if (isRightScroll) {
            progress = 50; 
        }

        track.addEventListener('mouseenter', () => {
            speed = hoverSpeed;
        });
        
        track.addEventListener('mouseleave', () => {
            speed = baseSpeed;
        });

        const animateMarquee = () => {
            if (isRightScroll) {
                progress -= speed;
                if (progress <= 0) progress += 50;
            } else {
                progress += speed;
                if (progress >= 50) progress -= 50;
            }
            
            track.style.transform = `translateX(-${progress}%)`;
            requestAnimationFrame(animateMarquee);
        };
        requestAnimationFrame(animateMarquee);
    });
});
