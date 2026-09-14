<div align="center">

# 🚀 Full-Stack Web Development Internship Portfolio
### Oasis Infobyte (OIBSIP) — Complete Level 1, Level 2 & Level 3 Mastery

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=180&section=header&text=Internship%20Portfolio&fontSize=42&fontColor=fff&animation=fadeIn&fontAlignY=38" width="100%" />

[![HTML5/CSS3](https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3%20%7C%20JS-orange?style=for-the-badge&logo=html5)](https://github.com/)
[![React](https://img.shields.io/badge/Framework-React%20%7C%20Vite-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%7C%20Mongoose-brightgreen?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

*A centralized showcase documenting the end-to-end development lifecycle: from responsive UI fundamentals and secure client-side authentication to a real-time, production-ready full-stack MERN application.*

</div>

---

## 🧭 Project Roadmap & Level Structure

This repository is structured progressively to highlight expanding technical competencies across three distinct tiers of the internship assignment:

| Level | Focus Area | Key Deliverables & Architecture | Status |
| :---: | :--- | :--- | :---: |
| **Level 1** | **Frontend Foundations** | Responsive landing pages, clean semantic HTML5/CSS3 layouts, and vanilla JavaScript interactivity. | ✅ Completed |
| **Level 2** | **Advanced UI/UX & Auth** | Modern component design systems, real-time form validation, and secure authentication workflows (e.g., *Nova* Account Interface). | ✅ Completed |
| **Level 3** | **Full-Stack MERN Ecosystem** | **Pizza Craft**: Layer-by-layer custom studio, real-time WebSocket tracking, Razorpay payments, and full Admin Operations Hub. | ✅ Completed |

---

## 📂 Detailed Level Breakdown

### 🌟 Level 1: Frontend Web Fundamentals
* **Objective**: Build responsive, accessible, and visually polished user interfaces using core web technologies.
* **Core Competencies**: 
  * Mobile-first responsive grid design.
  * Semantic HTML structure and CSS custom properties (variables).
  * DOM manipulation and event-driven JavaScript applications.

### 🔐 Level 2: Advanced Interaction & Authentication Systems
* **Objective**: Engineer production-quality authentication user experiences inspired by modern SaaS design principles (Linear, Vercel, Stripe).
* **Core Competencies**:
  * **Real-time Form Validation**: Live helper notifications for email formatting, password strength meters (length, uppercase, numerical checks), and mismatch detection.
  * **Security-Minded Frontend**: Zero-plaintext password handling patterns using the native Web Crypto API (SHA-256) simulation.
  * **Session Management**: Secure persistence handling via `localStorage` and `sessionStorage` with protected route navigation guards.

### 🍕 Level 3: Full-Stack MERN "Pizza Delivery" Ecosystem (*Pizza Craft*)
* **Objective**: Deliver a robust, production-grade full-stack web application featuring real-time synchronization, secure payments, and administrative oversight.
* **Core Features**:
  * **The Custom Pizza Studio**: Interactive multi-step canvas enabling users to construct custom pies across 5+ bases, signature sauces, fine cheeses, and multiple fresh vegetable layers with dynamic pricing.
  * **Idempotent Razorpay Integration**: Secure test-mode checkout flow handling transaction settlement and automatic inventory stock decrements.
  * **Real-Time Order Tracker**: Live WebSocket communication via **Socket.IO** broadcasting status mutations (*Order Received* ➔ *In Kitchen* ➔ *Out for Delivery*) without page reloads.
  * **Administrative Operations Hub**: Complete staff control panel supporting menu management (add, edit pricing, soft deletion/removal), manual and automated stock controls, low-stock threshold cron jobs, and student user account oversight.

---

## 🛠️ Core Technology Stack

* **Frontend Client**: React, Vite, React Router DOM, Axios, CSS3 Custom Design System.
* **Backend Server**: Node.js, Express.js, RESTful API architecture, JWT authentication, Bcrypt.js.
* **Database Layer**: MongoDB, Mongoose ODM, automated database seeder scripts.
* **Real-Time Engine**: Socket.IO for bidirectional event streaming.
* **Payment & Automation**: Razorpay API, Node-Cron for scheduled background task monitoring.

---

## 📁 Monorepo Structure

```text
OIBSIP-Internship/
├── Level 1/                 # Frontend foundation tasks and static pages
├── Level 2/                 # Advanced interactive components and Auth UI
└── Level 3/                 # Full-Stack MERN Pizza Delivery Application
    ├── client/              # React + Vite frontend SPA
    │   ├── src/
    │   │   ├── components/  # Reusable UI elements, Navigation, and Modals
    │   │   ├── context/     # Auth, Toast, and PizzaBuilder Context Providers
    │   │   └── pages/       # Customer storefront, Studio, Tracker, & Admin console
    │   └── package.json
    └── server/              # Node.js + Express backend core
        ├── controllers/     # Business logic for auth, orders, inventory, & menu
        ├── jobs/            # Scheduled cron job monitors
        ├── middleware/      # JWT protection & role enforcement
        ├── models/          # Mongoose database schemas
        └── server.js        # Server entry point & Socket.IO initialization