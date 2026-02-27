/**
 * state-mobile-logic.js
 * Handles mobile-specific UI interactions like map expansion.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Map Expand Interaction
    const mapImg = document.querySelector('.map-box img');
    if (mapImg) {
        let isExpanded = false;

        mapImg.addEventListener('click', () => {
            if (!isExpanded) {
                const rect = mapImg.getBoundingClientRect();
                if (window.gsap) {
                    gsap.to(mapImg, {
                        width: window.innerWidth,
                        x: -rect.left,
                        duration: 0.6,
                        ease: "power3.inOut",
                        onStart: () => mapImg.classList.add('expanded')
                    });
                } else {
                    mapImg.classList.add('expanded');
                }
            } else {
                if (window.gsap) {
                    gsap.to(mapImg, {
                        width: '100%',
                        x: 0,
                        duration: 0.6,
                        ease: "power3.inOut",
                        onComplete: () => mapImg.classList.remove('expanded')
                    });
                } else {
                    mapImg.classList.remove('expanded');
                }
            }
            isExpanded = !isExpanded;
        });
    }

    // Scroll Animations for sections
    if (window.gsap) {
        gsap.from(".section-card", {
            duration: 0.6,
            y: 30,
            opacity: 0,
            stagger: 0.1,
            ease: "power2.out"
        });
    }
});
