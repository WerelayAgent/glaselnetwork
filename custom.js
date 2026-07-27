// custom.js - Vanilla JS replacement for some removed Next.js/Framer Motion interactivity

document.addEventListener("DOMContentLoaded", () => {
    // 1. Re-implement Spotlight Hover Effects
    const cards = document.querySelectorAll(".spotlight, .card");
    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Many modern sites use --mouse-x and --mouse-y for gradient masks
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });

    // 2. Simple Scroll Animation Fallback (fade in)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = "translateY(0)";
            }
        });
    });

    const hiddenElements = document.querySelectorAll("section");
    hiddenElements.forEach((el) => observer.observe(el));
});
