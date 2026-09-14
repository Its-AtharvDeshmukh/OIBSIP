# 🔐 Level 2: Advanced Interaction & Authentication Systems — OIBSIP

<div align="center">

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Security](https://img.shields.io/badge/Security-Web%20Crypto%20API-blueviolet?style=for-the-badge&logo=security)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

*A production-grade, minimalist SaaS authentication ecosystem (Nova) featuring real-time validation, dynamic password strength meters, and secure zero-plaintext handling.*

</div>

---

## 📌 Overview
Level 2 focuses on advanced UI/UX design principles and secure interaction logic. Inspired by world-class developer tools and SaaS interfaces (such as Vercel, Linear, and Stripe), this module implements a complete Single Page Application (SPA) authentication workflow from scratch using native web technologies.

---

## ✨ Key Features & Architectural Highlights

### 🎨 Premium Design System
* **Restrained SaaS Aesthetics**: High-contrast typography using the *Inter* font stack, deep ambient glow accents, and subtle frosted-glass containers.
* **Fully Responsive**: Implements a clean split-screen desktop composition that adapts seamlessly into an optimized, touch-friendly mobile layout.

### 🛡️ Advanced Authentication & Security
* **Zero-Plaintext Password Handling**: Bypasses insecure plaintext storage by leveraging the native **Web Crypto API (SHA-256)** to hash credentials securely before local persistence.
* **Real-Time Form Validation**: Instant inline feedback for email formatting, whitespace trimming, and duplicate account protection.
* **Live Password Strength Indicator**: Dynamic checklist and multi-stage progress bars verifying length ($\ge 8$ chars), uppercase character inclusion, and numeric values on the fly.
* **Password Visibility Toggle**: Interactive eye icon allowing users to toggle password masking safely and accessibly.

### 🔄 Session Management & Route Protection
* **Protected Dashboard View**: Fully isolated secure workspace displaying authenticated user metadata and system framework status upon successful login.
* **Persistent vs. Temporary Sessions**: Intelligent handling of the "Remember Me" option using `localStorage` (persistent) versus `sessionStorage` (session-bound).
* **Graceful Logout**: Instantly clears application tokens, resets state variables, and redirects back to the sign-in viewport.

---

## 📂 File Structure
```text
Level 2/
├── index.html         # Unified SPA containing Auth and Dashboard views
├── style.css          # Restrained minimalist design system and keyframe animations
└── script.js          # Modular authentication logic, hashing, and state management