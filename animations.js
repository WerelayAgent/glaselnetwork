// animations.js - High Fidelity Vanilla JS Animations

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initial Reveal & Scroll Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Grab all elements we want to animate on scroll
    // Since we added .scroll-animate in HTML via python, observe them
    const animElements = document.querySelectorAll('.scroll-animate, section, .card, .badge, h2, p, .btn-primary, .btn-ghost');
    animElements.forEach(el => {
        // If it doesn't already have scroll-animate, add it so it fades in
        if (!el.classList.contains('scroll-animate') && el.tagName !== 'SECTION') {
            el.classList.add('scroll-animate');
        }
        observer.observe(el);
    });

    // Stagger elements inside grid containers
    const grids = document.querySelectorAll('.grid');
    grids.forEach(grid => {
        const children = grid.children;
        Array.from(children).forEach((child, index) => {
            child.style.transitionDelay = `${index * 100}ms`;
        });
    });

    // 2. High Fidelity Spotlight Hover Effect
    const cards = document.querySelectorAll('.spotlight, .card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 3. Navbar scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 4. Force reveal elements immediately in viewport (Hero section)
    setTimeout(() => {
        const heroElements = document.querySelectorAll('header, section:first-of-type .scroll-animate');
        heroElements.forEach(el => {
            el.classList.add('is-visible');
        });
    }, 100);
});
