// A simple, robust Intersection Observer to gently fade in elements as the user scrolls.
// This is user-friendly because it doesn't hijack scrolling or cause lag.

document.addEventListener("DOMContentLoaded", () => {
    const fadeElements = document.querySelectorAll(".fade-in");
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        root: null,
        rootMargin: "0px",
        threshold: 0.1 // Triggers when 10% of the element is visible
    });

    fadeElements.forEach(element => {
        observer.observe(element);
    });
});