# 🛍️ Shopping E-commerce Website

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://mern-e-commerce-store-je53.onrender.com)
[![Admin API](https://img.shields.io/badge/API-running-blue.svg)](https://e-commerce-admin-aw4a.onrender.com)

A **full-stack e-commerce platform** built using the MERN stack (**React.js, Node.js, Express.js, and MongoDB**).  
This project features a customer-facing store for browsing and purchasing fashion products, and a dedicated **Admin Dashboard** for complete business management.

---

## 🚀 Live Links
* **Project Live:** [Kushi_Store]((https://mern-e-commerce-store-je53.onrender.com)
* **Admin:** [https://e-commerce-admin-aw4a.onrender.com](https://e-commerce-admin-aw4a.onrender.com)

---

## ✨ Features

- 🔒 **JWT Authentication** — Secure login and logout using **JSON Web Tokens**.
- 🧭 **Responsive Design** — Fully responsive layout built with **Bootstrap & CSS**.
- 🛍️ **Cart, Wishlist & Order Management** — Add, update, or remove products easily.
- 💳 **Secure Payment Integration** — Supports **GPay**, **UPI**, and **Credit/Debit Cards**.
- 📈 **Admin Dashboard** — Track orders, manage inventory, and view **sales insights**.
- 🔄 **CRUD Operations** — Full control over products and user data.
- 🧩 **Real-time API Updates** — Seamless frontend-backend communication via **Axios**.

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
