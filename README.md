# 🛍️ Shopping E-commerce Website

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://mern-e-commerce-store-je53.onrender.com)
[![Admin Dashboard](https://img.shields.io/badge/Admin-Dashboard-orange.svg)](https://e-commerce-admin-aw4a.onrender.com)

A **full-stack e-commerce platform** built using the MERN stack (**React.js, Node.js, Express.js, and MongoDB**).  
This project features a customer-facing store for browsing and purchasing fashion products, and a dedicated **Admin Dashboard** for complete business management.

---

## 🚀 Live Links
* **Kushi Store:** [https://mern-e-commerce-store-je53.onrender.com](https://mern-e-commerce-store-je53.onrender.com)
* **Admin Panel:** [https://e-commerce-admin-aw4a.onrender.com](https://e-commerce-admin-aw4a.onrender.com)
* **Backend Server** [https://mern-store-server.onrender.com](https://mern-store-server.onrender.com) 

---
## ✨ Features

- 🔒 **JWT Authentication** — Secure, stateless user sessions using **JSON Web Tokens** with industry-standard password encryption via **Bcrypt.js**.
- 🌐 **Global State Management** — Seamlessly **managing global cart and wishlist states** using **Redux Toolkit (@reduxjs/toolkit)**, ensuring high-performance data synchronization across the entire shop.
- 🎭 **Dynamic Visuals & Animations** — A highly interactive UI powered by **Framer Motion** and **GSAP** for fluid, professional transitions and an "app-like" user experience.
- 💳 **Hybrid Payment Gateway** — Fully integrated checkout supporting **Stripe** and **Razorpay** for global transactions, including **GPay**, **UPI**, and **Credit/Debit Cards**.
- 📊 **Advanced Admin Analytics** — A professional administrative dashboard featuring complex sales trends and inventory visualization via **Chart.js** and **Recharts**.
- 🔔 **Modern Notifications** — Sleek, non-intrusive toast alerts via **Sonner** for real-time user feedback on cart updates and authentication.
- 🧭 **Seamless Navigation** — Optimized Single-Page Application (SPA) architecture using **React Router Dom** for instant, reload-free page transitions.
- 🧩 **Robust CRUD & API** — Full-scale RESTful API communication via **Axios** with structured **Mongoose** schemas for reliable data persistence.
- 📱 **Responsive** — Fully adaptive layout built with **Bootstrap 5** and custom **CSS** for a pixel-perfect experience across all devices.


---

## 🧑‍💻 Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React.js, Redux, HTML, CSS, Bootstrap, Axios, React Router |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Atlas) |
| **Authentication** | JWT, bcrypt for password encryption |
| **Deployment** | Render (Frontend & Backend) |

---

## ⚙️ Project Workflow

1.  **User Registration & Login** → Secure entry via JWT-based authentication.
2.  **Product Browsing** → Search and filter by category, color, or size.
3.  **Shopping** → Add items to Cart or Wishlist.
4.  **Checkout** → Secure payment processing.
5.  **Order Tracking** → Users can manage their order history.
6.  **Admin Control** → Full management of products, users, and site analytics.

---

---

## 🧾 Installation & Local Setup

```bash
# 1. Clone the repository
git clone [https://github.com/Linda-31/MERN_eCommerce_Shop.git](https://github.com/Linda-31/MERN_eCommerce_Shop.git)
cd MERN_eCommerce_Shop

# 2. Install Dependencies
# Install Server dependencies
cd server && npm install

# Install User Store dependencies
cd ../My-shop && npm install

# Install Admin Dashboard dependencies
cd ../Admin && npm install

# 3. Environment Setup
# Create a .env file in the /server directory and add:
# PORT=4000
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key

# 4. Run the Project (in separate terminals)

# Start Backend
cd server
npm start

# Start Admin Dashboard
cd Admin
npm start

# Start User Shop
cd My-shop
npm start
