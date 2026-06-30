// Inject Global Preloader Immediately
(function() {
    // Only run on main pages (exclude dashboard iframe pages if necessary, though they don't load main.js)
    if (!document.getElementById('grand-preloader')) {
        const preloaderHTML = `
            <div id="grand-preloader" class="preloader-overlay">
                <div class="preloader-content">
                    <div class="spinner-ring"></div>
                    <span class="material-symbols-outlined preloader-icon">psychiatry</span>
                </div>
                <h3 class="preloader-text mt-4 text-white fw-bold tracking-widest text-uppercase" style="font-family: 'Source Serif 4', serif;">Cultivating <span class="text-success">Nature</span></h3>
            </div>
        `;
        document.write(preloaderHTML); // Ensures it renders immediately before DOMContentLoaded
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // Load Header and Footer dynamically
    Promise.all([
        fetch('header.html').then(response => response.text()),
        fetch('footer.html').then(response => response.text())
    ]).then(([headerHtml, footerHtml]) => {
        const headerPlaceholder = document.getElementById('common-header');
        const footerPlaceholder = document.getElementById('common-footer');
        
        if (headerPlaceholder) headerPlaceholder.innerHTML = headerHtml;
        if (footerPlaceholder) footerPlaceholder.innerHTML = footerHtml;

        // Set active nav link based on current URL
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Initialize AOS after dynamic content is loaded and preloader finishes
        if (typeof AOS !== 'undefined') {
            setTimeout(() => {
                AOS.init({
                    duration: 800,
                    once: true,
                    offset: 50
                });
            }, 2500); // Wait for the 2.5s preloader
        }
    }).catch(error => console.error("Error loading header/footer:", error));


    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navbar');
        if (nav) {
            if (window.scrollY > 50) {
                nav.classList.add('shadow-md', 'bg-opacity-90');
                nav.classList.remove('shadow-sm');
            } else {
                nav.classList.add('shadow-sm');
                nav.classList.remove('shadow-md', 'bg-opacity-90');
            }
        }
    });

    // Simple Slider Logic
    const slider = document.getElementById('project-slider');
    const nextBtn = document.getElementById('next-project');
    const prevBtn = document.getElementById('prev-project');

    if (slider && nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            slider.scrollLeft += 424;
        });
        prevBtn.addEventListener('click', () => {
            slider.scrollLeft -= 424;
        });
    }

    // Smooth animations for stats
    const animateStats = () => {
        const stats = [
            { id: 'stat-years', target: 15 },
            { id: 'stat-plants', target: 42 },
            { id: 'stat-projects', target: 850 },
            { id: 'stat-awards', target: 12 }
        ];

        stats.forEach(stat => {
            const el = document.getElementById(stat.id);
            if (el) {
                let current = 0;
                const duration = 2000;
                const stepTime = Math.abs(Math.floor(duration / stat.target));
                const timer = setInterval(() => {
                    current += Math.ceil(stat.target / 50);
                    if (current >= stat.target) {
                        el.innerText = stat.id === 'stat-years' ? stat.target + '+' :
                            stat.id === 'stat-plants' ? stat.target + 'k' : stat.target;
                        clearInterval(timer);
                    } else {
                        el.innerText = stat.id === 'stat-plants' ? current + 'k' : current;
                    }
                }, 30);
            }
        });
    };

    // Intersection Observer for stats
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.getElementById('stat-years')?.parentElement?.parentElement;
    if (statsSection) observer.observe(statsSection);

    // Auto-scrolling Testimonial Slider
    const testimonialSlider = document.getElementById('testimonial-slider');
    if (testimonialSlider) {
        let isPaused = false;
        let animationId;
        const scrollSpeed = 1; // Pixels per frame

        const autoScroll = () => {
            if (!isPaused) {
                testimonialSlider.scrollLeft += scrollSpeed;
                
                // If we've reached the end, loop back
                if (testimonialSlider.scrollLeft >= (testimonialSlider.scrollWidth - testimonialSlider.clientWidth - 1)) {
                    testimonialSlider.scrollLeft = 0;
                }
            }
            animationId = requestAnimationFrame(autoScroll);
        };

        // Start scrolling
        animationId = requestAnimationFrame(autoScroll);

        // Pause on interaction
        testimonialSlider.addEventListener('mouseenter', () => isPaused = true);
        testimonialSlider.addEventListener('mouseleave', () => isPaused = false);
        testimonialSlider.addEventListener('touchstart', () => isPaused = true, {passive: true});
        testimonialSlider.addEventListener('touchend', () => isPaused = false);
    }

    // Remove Preloader after 2.5 seconds
    setTimeout(() => {
        const preloader = document.getElementById('grand-preloader');
        if(preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => { 
                preloader.style.display = 'none'; 
                document.body.classList.add('preloader-done'); // Triggers CSS hero animations
                
                // Manually start the hero carousel now that preloader is done
                const heroCarousel = document.getElementById('heroSyncCarousel');
                if (heroCarousel && typeof bootstrap !== 'undefined') {
                    const bsCarousel = new bootstrap.Carousel(heroCarousel);
                    bsCarousel.cycle();
                }
            }, 800);
        } else {
            // If no preloader exists (e.g., fallback), just trigger animations immediately
            document.body.classList.add('preloader-done');
        }
    }, 2500);
});
