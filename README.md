::: {align="center"}
# 🍕 Pizza Delivery --- Full-Stack Ordering & Inventory Platform

```{=html}
<p>
```
`<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">`{=html}
`<img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">`{=html}
`<img src="https://img.shields.io/badge/Express.js-API-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">`{=html}
`<img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">`{=html}
`<img src="https://img.shields.io/badge/Razorpay-Test%20Mode-3395FF?style=for-the-badge" alt="Razorpay">`{=html}
`<img src="https://img.shields.io/badge/Cloudinary-Media-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary">`{=html}
`<img src="https://img.shields.io/badge/Socket.IO-Realtime-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.IO">`{=html}
```{=html}
</p>
```
```{=html}
<p>
```
`<img src="https://readme-typing-svg.demolab.com?font=Inter&weight=700&size=22&pause=900&color=FF6B35&center=true&vCenter=true&width=760&lines=Build+your+pizza.+Pay+securely.+Track+it+live.;Customer+Ordering+%7C+Admin+Operations+%7C+Inventory;A+MERN+full-stack+internship+project" alt="Animated project description">`{=html}
```{=html}
</p>
```
```{=html}
<p>
```
`<b>`{=html}🍕 Build it. 🛒 Order it. 💳 Pay it. 📦 Track it. ⚙️ Manage
it.`</b>`{=html}
```{=html}
</p>
```
:::

------------------------------------------------------------------------

## 📖 About the Project

**Pizza Delivery** is a full-stack pizza ordering and inventory
management platform built as a MERN-based internship project.

The application is designed around two distinct experiences:

-   **Customer experience** --- account creation, email verification,
    authentication, pizza discovery, custom pizza building, checkout,
    payment, order history and real-time order tracking.
-   **Administration experience** --- dedicated admin authentication,
    inventory management, order management, student/user management and
    pizza menu management with Cloudinary-powered image handling.

The project connects a React frontend to an Express/Node.js API, uses
MongoDB for persistent data, Razorpay in test mode for checkout,
Socket.IO for real-time order updates, Nodemailer for email workflows
and node-cron for scheduled stock monitoring.

> **Project goal:** demonstrate a complete, connected full-stack
> ordering workflow rather than a static frontend-only pizza website.

------------------------------------------------------------------------

## ✨ Core Features

### 👤 Customer Platform

  -----------------------------------------------------------------------
  Feature                             Description
  ----------------------------------- -----------------------------------
  📝 Registration                     Create a customer account through
                                      the public registration flow

  ✉️ Email Verification               Verification-token based account
                                      verification

  🔐 JWT Authentication               Token-based customer authorization

  🔑 Forgot Password                  Password reset flow using an email
                                      reset link

  🍕 Pizza Dashboard                  Browse available pizzas

  🧑‍🍳 Custom Pizza Builder             Build a pizza from base, sauce,
                                      cheese and vegetables

  🥣 5 Pizza Bases                    Five base inventory options are
                                      seeded

  🍅 5 Sauces                         Five sauce inventory options are
                                      seeded

  🧀 Cheese Selection                 Choose an available cheese type

  🥬 Multiple Vegetables              Select multiple vegetable
                                      ingredients

  🧾 Review Order                     Review pizza configuration,
                                      customer information and total
                                      before payment

  💳 Razorpay Checkout                Razorpay integration configured for
                                      test-mode payments

  ✅ Payment Confirmation             Successful payment verification
                                      confirms the order

  📦 Order History                    View previous orders

  🔎 Order Details                    Inspect an individual order

  🚚 Live Order Tracking              Track order status changes

  ⚡ Real-Time Updates                Socket.IO delivers order status
                                      updates to the customer
  -----------------------------------------------------------------------

### 🛡️ Admin Platform

  -----------------------------------------------------------------------
  Feature                             Description
  ----------------------------------- -----------------------------------
  🔐 Separate Admin Login             Admin authentication is separate
                                      from public customer registration

  📊 Admin Dashboard                  Central operational dashboard

  📦 Inventory Dashboard              View ingredient inventory

  ➕ Manual Stock Updates             Update inventory quantities

  📉 Automatic Stock Deduction        Successful orders consume selected
                                      ingredients

  🚨 Low-Stock Monitoring             Configurable low-stock threshold

  ⏰ Scheduled Monitoring             node-cron checks inventory on a
                                      scheduled basis

  ✉️ Stock Alerts                     Email notification workflow for
                                      low-stock inventory

  🧾 Order Management                 View incoming customer orders

  🔄 Status Management                Update order status from the admin
                                      side

  ⚡ Real-Time Status Sync            Customer tracking receives admin
                                      status changes

  🍕 Menu Management                  Add, update and remove pizza
                                      listings

  ☁️ Cloudinary Media                 Server-side image upload/deletion
                                      workflow

  ⭐ Featured Pizzas                  Pizza listings support featured
                                      status

  🟢 Availability                     Pizza listings support availability
                                      state

  👨‍🎓 Student Management               Admin can create, search and manage
                                      customer/student accounts
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 🧩 Pizza Builder Flow

The custom pizza builder follows the required ingredient structure:

``` text
                    🍕 CUSTOM PIZZA
                          │
                          ▼
                 ┌──────────────────┐
                 │ 1. Choose Base   │
                 │    5 options     │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ 2. Choose Sauce  │
                 │    5 options     │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ 3. Choose Cheese │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ 4. Vegetables    │
                 │    Multi-select  │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │   Order Review   │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ Razorpay Test    │
                 │     Checkout     │
                 └────────┬─────────┘
                          │
                          ▼
                    📦 ORDER CREATED
```

------------------------------------------------------------------------

## 🚚 Order Lifecycle

The application uses the required order-status progression:

``` text
┌────────────────┐
│ Order Received │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│   In Kitchen   │
└───────┬────────┘
        │
        ▼
┌────────────────────┐
│ Sent to Delivery   │
└────────────────────┘
```

When an administrator changes an order status, the backend can emit the
update through **Socket.IO**, allowing the customer tracking interface
to reflect the new state without requiring a full page refresh.

------------------------------------------------------------------------

## 🏗️ System Architecture

``` mermaid
flowchart LR
    U[👤 Customer] --> FE[⚛️ React Frontend]
    A[🛡️ Admin] --> FE

    FE --> API[🚀 Express REST API]
    FE <--> WS[⚡ Socket.IO]

    API --> AUTH[🔐 JWT Auth]
    API --> DB[(🍃 MongoDB)]
    API --> PAY[💳 Razorpay Test API]
    API --> MAIL[✉️ Nodemailer]
    API --> MEDIA[☁️ Cloudinary]

    CRON[⏰ node-cron] --> API
    API --> INV[📦 Inventory]
    API --> ORD[🧾 Orders]
    API --> MENU[🍕 Pizza Menu]
```

------------------------------------------------------------------------

## 🔄 Full Application Workflow

``` text
Customer
   │
   ├── Register
   │      └── Email verification
   │
   ├── Login
   │      └── JWT authorization
   │
   ├── Browse pizzas
   │
   ├── Build custom pizza
   │      ├── Base
   │      ├── Sauce
   │      ├── Cheese
   │      └── Vegetables
   │
   ├── Review order
   │
   ├── Razorpay test checkout
   │
   └── Confirmed order
          │
          ├── Inventory consumption
          ├── Order history
          └── Live tracking
                   ▲
                   │ Socket.IO
                   │
              Admin updates
```

------------------------------------------------------------------------

## 🧱 Technology Stack

### Frontend

-   **React 19**
-   **React DOM**
-   **React Router**
-   **Axios**
-   **Socket.IO Client**
-   **Vite**

### Backend

-   **Node.js**
-   **Express.js**
-   **MongoDB**
-   **Mongoose**
-   **JWT**
-   **bcryptjs**
-   **Socket.IO**
-   **Razorpay**
-   **Nodemailer**
-   **node-cron**
-   **Cloudinary**
-   **Multer**
-   **dotenv**
-   **CORS**

------------------------------------------------------------------------

## 📁 Project Structure

``` text
Level 3/
│
├── client/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   │
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       │
│       ├── components/
│       │   └── Navbar.jsx
│       │
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── PizzaBuilderContext.jsx
│       │
│       ├── services/
│       │   └── API service
│       │
│       └── pages/
│           ├── Account.jsx
│           ├── Dashboard.jsx
│           ├── ForgotPassword.jsx
│           ├── Login.jsx
│           ├── Orders.jsx
│           ├── OrderDetail.jsx
│           ├── PizzaBuilder.jsx
│           ├── PizzaDetail.jsx
│           ├── Register.jsx
│           ├── ResetPassword.jsx
│           ├── ReviewOrder.jsx
│           ├── TrackOrder.jsx
│           ├── VerifyEmail.jsx
│           └── admin/
│               ├── AdminDashboard.jsx
│               ├── AdminInventory.jsx
│               ├── AdminLogin.jsx
│               ├── AdminMenuManager.jsx
│               ├── AdminOrders.jsx
│               └── AdminStudents.jsx
│
└── server/
    ├── server.js
    ├── seeder.js
    ├── package.json
    ├── package-lock.json
    │
    ├── config/
    │   ├── db.js
    │   ├── razorpay.js
    │   └── cloudinary.js
    │
    ├── middleware/
    │   └── authMiddleware.js
    │
    ├── models/
    │   ├── Admin.js
    │   ├── InventoryItem.js
    │   ├── Order.js
    │   ├── Pizza.js
    │   └── User.js
    │
    ├── controllers/
    │   ├── adminController.js
    │   ├── adminMenuController.js
    │   ├── adminStudentController.js
    │   ├── authController.js
    │   ├── inventoryController.js
    │   ├── menuController.js
    │   ├── orderController.js
    │   ├── paymentController.js
    │   └── pizzaController.js
    │
    ├── routes/
    │   ├── adminMenuRoutes.js
    │   ├── adminRoutes.js
    │   ├── authRoutes.js
    │   ├── inventoryRoutes.js
    │   ├── orderRoutes.js
    │   ├── paymentRoutes.js
    │   └── pizzaRoutes.js
    │
    ├── services/
    │   └── emailService.js
    │
    └── jobs/
        └── stockMonitor.js
```

------------------------------------------------------------------------

## 🔐 Authentication & Authorization

The project separates customer and administrator access.

### Customer authentication

``` text
Registration
     ↓
Verification token
     ↓
Email verification
     ↓
Login
     ↓
JWT
     ↓
Protected customer APIs
```

### Admin authentication

``` text
Admin credentials
     ↓
Dedicated admin login
     ↓
Admin JWT
     ↓
Protected admin APIs
```

The public customer registration flow does **not** act as an
admin-registration mechanism.

------------------------------------------------------------------------

## 💳 Payment Architecture

Razorpay is integrated on the server side for test-mode checkout.

``` text
Customer
   │
   ▼
Review Order
   │
   ▼
Create Razorpay Order
   │
   ▼
Razorpay Checkout
   │
   ▼
Payment Result
   │
   ▼
Signature Verification
   │
   ▼
Order Confirmation
   │
   ▼
Inventory Processing
```

> **Security:** Razorpay secret credentials belong on the server and
> must never be exposed in the React client.

------------------------------------------------------------------------

## 📦 Inventory Management

Inventory is connected to the pizza ordering workflow.

The seeded inventory is organized around:

``` text
🍞 Pizza Bases
   └── 5 options

🍅 Sauces
   └── 5 options

🧀 Cheeses
   └── Available cheese inventory

🥬 Vegetables
   └── Multiple selectable options
```

After a successful order, the selected ingredients are used by the
inventory workflow.

The admin interface also supports manual inventory updates.

------------------------------------------------------------------------

## 🚨 Automated Low-Stock Monitoring

The backend includes a scheduled stock-monitoring job using
**node-cron**.

``` text
⏰ Scheduled Job
       │
       ▼
Read Inventory
       │
       ▼
Compare With Threshold
       │
       ├── Stock OK ───────► Continue
       │
       └── Low Stock
                │
                ▼
          Email Notification
                │
                ▼
             Admin
```

The threshold is configurable through server environment configuration.

------------------------------------------------------------------------

## ☁️ Cloudinary Image Management

The admin menu workflow includes server-side Cloudinary integration for
pizza images.

``` text
Admin selects image
        │
        ▼
React Admin Menu
        │
        ▼
Express API
        │
        ▼
Multer upload handling
        │
        ▼
Cloudinary
        │
        ▼
Secure image URL
        │
        ▼
MongoDB Pizza document
```

This keeps the media workflow separate from the application database
itself.

------------------------------------------------------------------------

## ⚡ Real-Time Order Tracking

Socket.IO is used for live order-status communication.

``` text
                 Socket.IO
                     │
        ┌────────────┴────────────┐
        │                         │
   Admin Panel               Customer
        │                         │
        │ update status           │
        ▼                         │
    Backend ──────────────────────┘
              emit event
```

The customer tracking page listens for order-specific status updates.

------------------------------------------------------------------------

## 👨‍🎓 Student Management

The project also includes an additional administration feature for
managing customer/student accounts.

Admins can:

-   View students/users
-   Search student records
-   Create a student/customer account
-   Suspend an account
-   Activate an account
-   Trigger the verification workflow for accounts created by admin

Admin-created students are created as customer/user accounts rather than
administrator accounts.

------------------------------------------------------------------------

## 🛡️ Security Considerations

The project uses several common security mechanisms:

-   JWT-based authorization
-   Password hashing with bcryptjs
-   Separate admin authentication
-   Protected admin routes
-   Server-side environment variables
-   Razorpay secret kept on the server
-   Cloudinary secret credentials kept on the server
-   CORS configuration
-   Authentication middleware
-   Email verification
-   Password-reset token workflow

### Never commit secrets

Do **not** commit:

``` text
server/.env
```

Use an example file instead:

``` text
server/.env.example
```

Example:

``` env
PORT=5001
CLIENT_URL=http://localhost:5173

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

RAZORPAY_KEY_ID=your_razorpay_test_key
RAZORPAY_KEY_SECRET=your_razorpay_test_secret

EMAIL_HOST=your_smtp_host
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
EMAIL_FROM=your_sender_email

ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password

LOW_STOCK_THRESHOLD=20

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

------------------------------------------------------------------------

## ⚙️ Installation

### 1. Clone the repository

``` bash
git clone https://github.com/Its-AtharvDeshmukh/OIBSIP.git
cd OIBSIP
```

### 2. Enter Level 3

``` bash
cd "Level 3"
```

### 3. Install frontend dependencies

``` bash
cd client
npm install
```

### 4. Install backend dependencies

``` bash
cd ../server
npm install
```

### 5. Configure environment variables

Create:

``` text
server/.env
```

using the variables shown in the `.env.example` section above.

### 6. Start the backend

From:

``` text
Level 3/server
```

run:

``` bash
npm run dev
```

The backend is configured for:

``` text
http://localhost:5001
```

### 7. Start the frontend

Open a second terminal:

``` bash
cd "Level 3/client"
npm run dev
```

Vite will provide the local frontend URL in the terminal.

------------------------------------------------------------------------

## 🌱 Database Seeding

The backend includes:

``` text
server/seeder.js
```

The seeder is intended to populate the application's initial
inventory/menu/admin data.

Run it according to the project's current server setup and environment
configuration.

> Make sure your MongoDB connection is configured before running
> database seed operations.

------------------------------------------------------------------------

## 🧪 Recommended Testing Flow

Before considering the project final, test the complete workflow rather
than testing only individual pages.

### Customer test

``` text
[ ] Register
[ ] Receive verification email
[ ] Verify account
[ ] Login
[ ] Open dashboard
[ ] Browse pizzas
[ ] Open pizza builder
[ ] Select base
[ ] Select sauce
[ ] Select cheese
[ ] Select multiple vegetables
[ ] Review order
[ ] Open Razorpay test checkout
[ ] Complete test payment
[ ] Verify order
[ ] Confirm inventory changes
[ ] Open order history
[ ] Open order details
[ ] Open live tracking
```

### Admin test

``` text
[ ] Admin login
[ ] Open admin dashboard
[ ] Open inventory
[ ] Manually update inventory
[ ] Open orders
[ ] Change order status
[ ] Confirm customer receives status update
[ ] Open student management
[ ] Create student/customer
[ ] Suspend student
[ ] Activate student
[ ] Open menu manager
[ ] Add pizza
[ ] Upload pizza image
[ ] Edit pizza
[ ] Change availability
[ ] Change featured state
[ ] Remove pizza
[ ] Verify low-stock monitoring
```

------------------------------------------------------------------------

## 📡 Main API Areas

The backend is organized around resource-specific routes.

``` text
/api/auth
    ├── registration
    ├── login
    ├── verification
    ├── forgot password
    └── reset password

/api/pizzas
    ├── list pizzas
    ├── get pizza
    ├── create pizza
    └── delete pizza

/api/orders
    ├── create/read orders
    ├── customer order history
    └── order details

/api/payment
    ├── create Razorpay order
    └── verify payment

/api/admin
    ├── admin authentication
    ├── admin orders
    ├── admin inventory
    └── admin students

/api/admin/menu
    ├── create pizza
    ├── update pizza
    └── delete pizza
```

------------------------------------------------------------------------

## 🎨 UI / UX Direction

The frontend is structured as a modern pizza-ordering application rather
than a basic CRUD interface.

The UI architecture includes:

-   Responsive layouts
-   Reusable React components
-   Customer/admin separation
-   Dashboard-oriented navigation
-   Pizza builder workflow
-   Order review flow
-   Tracking interface
-   Admin operational screens
-   Responsive CSS
-   Error handling through the application UI

The visual system can be extended further with additional
micro-interactions, transitions and motion without changing the backend
architecture.

------------------------------------------------------------------------

## 🗃️ Data Model Overview

``` text
Admin
 │
 └── Admin authentication

User
 │
 ├── Authentication
 ├── Verification
 └── Customer profile

Pizza
 │
 ├── Name
 ├── Description
 ├── Price
 ├── Image
 ├── Availability
 └── Default configuration

InventoryItem
 │
 ├── Category
 ├── Name
 └── Stock

Order
 │
 ├── Customer
 ├── Pizza configuration
 ├── Customer information
 ├── Payment status
 └── Order status
```

------------------------------------------------------------------------

## 📸 Screenshots

Add your final application screenshots here after the UI is verified:

``` text
docs/
├── home.png
├── pizza-builder.png
├── review-order.png
├── payment.png
├── order-tracking.png
├── admin-dashboard.png
├── inventory.png
├── admin-orders.png
└── menu-manager.png
```

Example:

``` md
![Customer Dashboard](docs/home.png)
```

> Recommended: use real screenshots from the final running application
> instead of placeholder images.

------------------------------------------------------------------------

## 🏆 Internship Project Context

This project was developed as part of the **OIBSIP Web Development &
Designing Internship --- Level 3**.

The Level 3 project focuses on implementing a complex full-stack
application using:

``` text
React.js
    +
Node.js
    +
Express.js
    +
MongoDB
    +
API Integration
```

with additional integrations for:

``` text
Razorpay
Cloudinary
Socket.IO
Nodemailer
node-cron
```

------------------------------------------------------------------------

## 🚀 Future Improvements

Possible future production enhancements include:

-   Refresh-token authentication
-   Role/permission matrix
-   Rate limiting
-   Request validation with a dedicated validation library
-   Centralized API error handling
-   Structured logging
-   Payment webhook verification
-   Stronger payment idempotency
-   MongoDB transaction-based inventory processing
-   Pagination for large admin datasets
-   Advanced menu search/filtering
-   Delivery-agent role
-   Coupon/discount engine
-   Multiple pizza quantities in a cart
-   Address book
-   Order cancellation/refund workflows
-   Analytics dashboard
-   Automated deployment pipeline
-   Automated tests
-   CI/CD
-   Production monitoring

------------------------------------------------------------------------

## 📌 Important Development Notes

### Environment

Keep secrets outside source control:

``` text
.env
```

### Dependencies

Do not commit:

``` text
node_modules/
```

### Build output

Do not normally commit:

``` text
dist/
```

### macOS metadata

Do not commit:

``` text
.DS_Store
__MACOSX/
```

------------------------------------------------------------------------

## 🧭 Development Philosophy

This project is built around a simple principle:

> **A full-stack application is not complete when the pages look
> finished. It is complete when the frontend, backend, database,
> authentication, payment, inventory and real-time workflows work
> together correctly.**

The architecture therefore separates responsibilities:

``` text
React
  → User interface & client state

Express / Node.js
  → API & business logic

MongoDB
  → Persistent application data

Razorpay
  → Test payment processing

Cloudinary
  → Pizza image management

Socket.IO
  → Real-time order updates

Nodemailer
  → Email workflows

node-cron
  → Scheduled inventory monitoring
```

------------------------------------------------------------------------

## ⭐ Project Highlights

``` text
🍕 Custom Pizza Builder
🔐 JWT Authentication
✉️ Email Verification
🔑 Password Reset
💳 Razorpay Test Checkout
📦 Inventory Management
🚨 Low-Stock Monitoring
⏰ Scheduled Jobs
⚡ Real-Time Order Tracking
🛡️ Separate Admin System
🍕 Admin Menu Management
☁️ Cloudinary Images
👨‍🎓 Student Management
📊 Admin Dashboard
📱 Responsive Frontend
```

------------------------------------------------------------------------

## 👨‍💻 Author

::: {align="center"}
### Atharv Deshmukh

**Web Development & Designing --- OIBSIP Internship**

Built with React, Node.js, Express, MongoDB and a lot of 🍕

------------------------------------------------------------------------

```{=html}
<p>
```
`<i>`{=html}From selecting the first ingredient to tracking the final
delivery --- the goal is to make the entire pizza journey
connected.`</i>`{=html}
```{=html}
</p>
```
### 🍕 Happy Ordering!
:::
