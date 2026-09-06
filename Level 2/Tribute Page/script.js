// ============================================================
// Sticky navigation: solid background once the hero is scrolled past
// ============================================================
function initializeNavigation() {
  const nav = document.getElementById("site-nav");
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle("is-solid", window.scrollY > 40);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// ============================================================
// Scroll reveal: fade/slide in elements marked with .reveal as
// they enter the viewport. The hidden starting state only applies
// once the "js" class is present (set in <head> before this file
// loads), so the page is fully readable if JavaScript is disabled.
// ============================================================
function initializeScrollReveal() {
  const revealItems = document.querySelectorAll(".reveal");
  if (!revealItems.length) return;

  if (!("IntersectionObserver" in window)) {
    // No observer support: reveal everything immediately rather than
    // leaving content hidden.
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  revealItems.forEach((item) => observer.observe(item));
}

// ============================================================
// Init
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation();
  initializeScrollReveal();
});