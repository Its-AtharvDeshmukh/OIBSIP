# 🍕 Pizza Delivery — Full-Stack Ordering & Inventory Platform

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=24&pause=1000&color=F6B35C&center=true&vCenter=true&width=760&lines=Build+your+pizza.+Pay+securely.+Track+your+order.;Customer+Ordering+%7C+Admin+Operations+%7C+Inventory;A+MERN+full-stack+internship+project" alt="Pizza Delivery project description" />
</p>

<p align="center">
  <strong>Production-style pizza ordering, customization, payments, real-time tracking, and inventory management.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-API-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Razorpay-Test%20Mode-3395FF?style=for-the-badge" alt="Razorpay" />
  <img src="https://img.shields.io/badge/Socket.IO-Realtime-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.IO" />
</p>

---

## 📌 Overview

Pizza Delivery is a full-stack MERN application designed as a production-style pizza ordering and inventory management platform.

The project contains two major experiences:

- **Customer application** — registration, email verification, pizza discovery, custom pizza building, checkout, payment, order history, and real-time order tracking.
- **Admin application** — protected administration, menu management, inventory monitoring, stock updates, order management, and customer management.

The project is built for the **OIBSIP Web Development & Designing Internship — Level 3**.

---

## ✨ Core Features

### 👤 Customer Side

- User registration
- Email verification
- JWT-based authentication
- Login and logout
- Forgot-password flow
- Password reset through email link
- Customer dashboard
- Pizza/menu browsing
- Pizza detail pages
- Custom pizza builder
- Order summary and review
- Razorpay test-mode checkout
- Order confirmation
- Order history
- Individual order details
- Real-time order tracking
- Account management
- Order feedback/reviews

### 🍕 Custom Pizza Builder

The builder follows the required four-step configuration:

| Step | Selection |
|---|---|
| 1 | Pizza Base |
| 2 | Sauce |
| 3 | Cheese |
| 4 | Vegetables — multiple selection |

The selected configuration is displayed before payment so the customer can review the order.

### 📦 Order Lifecycle

```text
Order Received
      ↓
  In Kitchen
      ↓
Sent to Delivery
```

The customer tracking screen receives status updates through Socket.IO.

---

## 🛠️ Admin Side

### 🔐 Admin Authentication

- Separate admin login
- Admin credentials are not created through normal customer registration
- JWT-protected admin routes
- Role-based access protection

### 📊 Inventory Dashboard

The inventory system manages:

- Pizza bases
- Sauces
- Cheese types
- Vegetables

The seeded inventory contains:

- **5 pizza bases**
- **5 sauces**
- **4 cheese types**
- **7 vegetables**

### 📉 Automatic Stock Decrement

After a successful order/payment flow, the selected ingredients are used to calculate inventory consumption.

The application decreases the corresponding ingredient stock according to the customer's pizza configuration.

### ✏️ Manual Stock Updates

Administrators can update inventory quantities from the admin dashboard.

### 🚨 Low-Stock Monitoring

A scheduled background job checks inventory against the configured low-stock threshold.

The threshold is configurable through:

```env
LOW_STOCK_THRESHOLD=20
```

The stock monitor uses `node-cron` and sends an email notification when qualifying inventory items reach the configured threshold.

### 🧾 Order Management

Administrators can:

- View incoming orders
- Open order details
- Update order status
- Move orders through the delivery lifecycle

Customer tracking is updated when the admin changes the order status.

### 🍕 Menu Management

Administrators can:

- Create pizzas
- Edit pizzas
- Upload pizza images
- Set availability
- Mark pizzas as featured
- Soft-delete pizzas

Images are handled through Cloudinary.

---

## 🏗️ Architecture

```text
                         ┌─────────────────────┐
                         │      Customer       │
                         │     React App       │
                         └──────────┬──────────┘
                                    │
                           HTTP / Axios
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Express REST API  │
                         │      Node.js        │
                         └──────┬───────┬──────┘
                                │       │
                  ┌─────────────┘       └──────────────┐
                  ▼                                    ▼
          ┌───────────────┐                    ┌───────────────┐
          │    MongoDB    │                    │   Socket.IO   │
          │   Database    │                    │ Real-time API │
          └───────────────┘                    └───────┬───────┘
                                                      │
                                                      ▼
                                             Customer tracking

                  External Services
                  ─────────────────
                  Razorpay → Payments
                  Cloudinary → Images
                  SMTP/Nodemailer → Emails
                  node-cron → Scheduled stock checks
```

---

## 📁 Project Structure

```text
OIBSIP/
│
├── Level 1/
│   ├── Task-1-Landing-Page/
│   ├── Task-2-Portfolio/
│   └── Task-3-Temp-Converter/
│
├── Level 2/
│   └── Calculator/
│
├── Level 3/
│   ├── client/
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── context/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   ├── App.jsx
│   │   │   ├── index.css
│   │   │   └── main.jsx
│   │   ├── index.html
│   │   └── package.json
│   │
│   ├── server/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── jobs/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── server.js
│   │   ├── seeder.js
│   │   └── package.json
│   │
│   └── README.md
│
└── .gitignore
```

---

## 💻 Tech Stack

### Frontend

- React 19
- React Router
- Axios
- Socket.IO Client
- Vite
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Nodemailer
- node-cron
- Socket.IO

### Integrations

- Razorpay — test-mode payments
- Cloudinary — image management
- SMTP — transactional email

---

## 🔐 Authentication Flow

### Registration

```text
Customer
   ↓
Registration Form
   ↓
Backend validation
   ↓
Password hashing
   ↓
Verification token generated
   ↓
Verification email
   ↓
Email verified
   ↓
Account activated
```

### Login

```text
Email + Password
       ↓
Backend authentication
       ↓
JWT generated
       ↓
Token stored by client
       ↓
Protected API access
```

### Forgot Password

```text
Forgot Password
       ↓
Enter email
       ↓
Reset token generated
       ↓
Reset email sent
       ↓
Reset link opened
       ↓
New password
       ↓
Password updated
```

---

## 💳 Payment Flow

The application uses Razorpay in **test mode**.

```text
Customer selects pizza
        ↓
Review order
        ↓
Create Razorpay order
        ↓
Razorpay checkout
        ↓
Test payment
        ↓
Payment verification
        ↓
Order confirmation
        ↓
Inventory processing
        ↓
Order tracking
```

> ⚠️ Never put the Razorpay secret key in the React frontend.

Use environment variables on the server.

---

## 🔄 Real-Time Order Tracking

The project uses Socket.IO for real-time order status updates.

```text
Admin updates order
        ↓
Backend saves new status
        ↓
Socket.IO emits update
        ↓
Order-specific room
        ↓
Customer tracking page
        ↓
UI updates without refresh
```

Order status values:

```text
Order Received
In Kitchen
Sent to Delivery
```

---

## 📦 Inventory Workflow

```text
Customer chooses:
    Base
    Sauce
    Cheese
    Vegetables
          ↓
Order configuration stored
          ↓
Successful payment
          ↓
Inventory quantities updated
          ↓
Low-stock monitor checks stock
          ↓
Email notification if threshold is reached
```

---

## ☁️ Cloudinary Image Management

Pizza menu images can be uploaded from the admin interface.

The backend:

1. Receives the image.
2. Validates the upload.
3. Uploads it to Cloudinary.
4. Stores the image URL.
5. Stores the Cloudinary public ID.
6. Uses the stored URL in the menu.

Supported image formats include:

```text
JPG
PNG
WEBP
```

---

## 📧 Email System

The backend uses Nodemailer for email operations.

Email-related flows include:

- Account verification
- Password reset
- Low-stock notifications

SMTP configuration is kept in server environment variables.

For local development, email failures can be logged instead of exposing secrets.

---

## ⏰ Scheduled Jobs

The stock monitoring job runs using `node-cron`.

Example configuration:

```env
LOW_STOCK_THRESHOLD=20
```

The job periodically checks inventory and can notify the administrator when stock reaches the configured threshold.

---

## 🗄️ Database

MongoDB is used as the application's primary database.

Major data models include:

```text
User
Pizza
Inventory
Order
```

The application also contains supporting data for authentication, order configuration, and administration.

---

## 🌱 Database Seeder

The server includes a seeder for development/setup data.

The seed data includes:

```text
5  Pizza Bases
5  Sauces
4  Cheese Types
7  Vegetables
4  Menu Pizzas
1  Master Admin
```

The seeded admin account is configured by the server environment/seeder configuration.

---

## ⚙️ Environment Variables

Create:

```text
Level 3/server/.env
```

Example:

```env
PORT=5001
CLIENT_URL=http://localhost:5173

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

RAZORPAY_KEY_ID=your_razorpay_test_key
RAZORPAY_KEY_SECRET=your_razorpay_test_secret

SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password

ADMIN_EMAIL=admin@pizza.com
ADMIN_PASSWORD=your_admin_password

LOW_STOCK_THRESHOLD=20

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 🔒 Important

Do **not** commit `.env`.

The repository `.gitignore` should include:

```gitignore
node_modules/
.env
*.env
.DS_Store
dist/
```

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/Its-AtharvDeshmukh/OIBSIP.git
cd OIBSIP
```

### 2. Open Level 3

```bash
cd "Level 3"
```

### 3. Install frontend dependencies

```bash
cd client
npm install
```

### 4. Install backend dependencies

Open another terminal:

```bash
cd "OIBSIP/Level 3/server"
npm install
```

### 5. Configure environment variables

Create:

```text
Level 3/server/.env
```

and add the required values.

### 6. Seed the database

From the server directory:

```bash
npm run seed
```

If the project uses the seeder directly, use:

```bash
node seeder.js
```

### 7. Start the backend

```bash
npm run dev
```

Backend:

```text
http://localhost:5001
```

### 8. Start the frontend

From the client directory:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🔌 API Overview

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/verify-email/:token
POST /api/auth/forgot-password
POST /api/auth/reset-password/:token
```

### Pizza/Menu

```text
GET /api/pizzas
GET /api/pizzas/:id
```

### Inventory

```text
GET /api/inventory
```

### Orders

```text
GET /api/orders/my-orders
GET /api/orders/:id
```

### Payments

```text
POST /api/payment/create-order
POST /api/payment/verify
```

### Admin

```text
POST /api/admin/login
GET  /api/admin/orders
PATCH /api/admin/orders/:id/status
GET  /api/admin/inventory
```

### Admin Menu

```text
GET    /api/admin/menu
POST   /api/admin/menu
PUT    /api/admin/menu/:id
DELETE /api/admin/menu/:id
```

> API paths should be treated as implementation references and verified against the current server route files before production deployment.

---

## 🧪 Recommended Testing Checklist

Before considering the application production-ready, test the complete flows manually.

### Customer

- [ ] Register a new customer
- [ ] Receive verification email
- [ ] Verify account
- [ ] Login
- [ ] Browse pizzas
- [ ] Open pizza details
- [ ] Build a custom pizza
- [ ] Select base
- [ ] Select sauce
- [ ] Select cheese
- [ ] Select multiple vegetables
- [ ] Review order
- [ ] Open Razorpay test checkout
- [ ] Complete a test payment
- [ ] Confirm order
- [ ] Open order history
- [ ] Track order
- [ ] Receive real-time status update
- [ ] Test forgot password
- [ ] Test password reset

### Admin

- [ ] Login through admin login
- [ ] View dashboard
- [ ] View inventory
- [ ] Update stock
- [ ] Create menu pizza
- [ ] Upload pizza image
- [ ] Edit pizza
- [ ] Change availability
- [ ] Mark featured
- [ ] Soft-delete pizza
- [ ] View incoming orders
- [ ] Update order status
- [ ] Confirm customer receives status update
- [ ] Verify low-stock notification behavior

### Security

- [ ] Confirm `.env` is not committed
- [ ] Confirm Razorpay secret is server-side only
- [ ] Confirm protected admin routes reject unauthorized users
- [ ] Confirm customer routes reject invalid JWTs
- [ ] Confirm passwords are never stored in plain text

---

## 🎨 UI / UX Goals

The application is designed around a modern food-delivery experience.

### Design principles

- Clean visual hierarchy
- Responsive layouts
- Mobile-first interaction
- Clear CTAs
- Consistent cards and forms
- Smooth transitions
- Loading states
- Empty states
- Error states
- Accessible form controls
- Clear order status feedback

### Responsive targets

```text
📱 Mobile
💻 Desktop
🖥️ Large screens
```

---

## 📱 Application Flow

```text
                    CUSTOMER
                       │
              ┌────────▼────────┐
              │   Authentication │
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │    Dashboard    │
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │ Browse / Build  │
              │     Pizza       │
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │  Review Order   │
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │ Razorpay Test   │
              │    Checkout     │
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │ Order Confirmed │
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │ Track Order     │◄──── Socket.IO
              └─────────────────┘


                      ADMIN
                        │
               ┌────────▼────────┐
               │   Admin Login   │
               └────────┬────────┘
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
      Inventory       Orders        Menu
          │             │             │
          ▼             ▼             ▼
      Stock Update   Status Update   CRUD
          │             │
          └──────┬──────┘
                 ▼
          Customer Tracking
```

---

## 🔒 Security Considerations

The application uses several security practices:

- JWT authentication
- Password hashing with bcryptjs
- Protected API routes
- Separate admin authentication
- Environment-based secrets
- Server-side Razorpay secret
- Input validation
- Controlled image uploads
- Role-based authorization

For production deployment, additional hardening such as rate limiting, security headers, stronger validation, monitoring, and HTTPS should also be considered.

---

## 📸 Screenshots

Add project screenshots here after final UI testing.

Suggested screenshots:

```text
1. Customer Dashboard
2. Pizza Builder
3. Review Order
4. Razorpay Checkout
5. Order Success
6. Real-Time Order Tracking
7. Admin Dashboard
8. Inventory Management
9. Order Management
10. Menu Management
```

Example:

```md
![Customer Dashboard](./screenshots/customer-dashboard.png)
```

---

## 🎯 Internship Objective

This project demonstrates full-stack development skills through a single integrated application covering:

- React frontend development
- Node.js backend development
- Express REST APIs
- MongoDB database integration
- Authentication and authorization
- Email workflows
- Payment integration
- Real-time communication
- Inventory management
- Scheduled background jobs
- Cloud image storage
- Admin dashboard development
- Responsive UI/UX

---

## 🚧 Future Improvements

Possible future enhancements:

- Online delivery-driver dashboard
- Google Maps delivery tracking
- Coupon and discount system
- Multiple pizza sizes
- Multiple pizza quantities
- Advanced analytics
- Sales reports
- Customer loyalty points
- Push notifications
- PWA support
- Automated deployment pipeline
- Comprehensive automated test suite
- Production monitoring and logging

---

## 👨‍💻 Author

### Atharv Deshmukh

**OIBSIP Web Development & Designing Internship**

GitHub: [Its-AtharvDeshmukh](https://github.com/Its-AtharvDeshmukh)

---

## ⭐ Project

If this project helped you understand full-stack development, consider giving the repository a ⭐ on GitHub.

---

<p align="center">
  <strong>🍕 Build it. Order it. Track it.</strong>
</p>

<p align="center">
  Made with React, Node.js, MongoDB, and lots of pizza 🍕
</p>
