# ⚖️ Quantity Measurement App — Frontend

A vanilla HTML/CSS/JS frontend for the Quantity Measurement App backend. Features a dark/light theme toggle, JWT authentication, and a clean dashboard for performing quantity measurement operations.

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| 🖥️ Frontend | [quantitymeasurement-app.netlify.app](https://quantitymeasurement-app.netlify.app) |
| ⚙️ Backend API | [quantitymeasurementapp-production-7653.up.railway.app](https://quantitymeasurementapp-production-7653.up.railway.app) |

---

## 🚀 Tech Stack

![HTML5](https://img.shields.io/badge/HTML-5-orange?style=flat-square)
![CSS3](https://img.shields.io/badge/CSS-3-blue?style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-ES9-yellow?style=flat-square)

---

## ✨ Features

- 🌙 **Dark / ☀️ Light theme toggle** with localStorage persistence
- 🔐 **Email + Password** login and registration
- 🌐 **Google OAuth2** login
- 📊 **Dashboard** with all measurement operations
- 📋 **Operation history** table
- 🔄 **JWT token** management
- 📱 **Responsive** design with Flexbox and Grid

---

## 📁 Project Structure

```
QuantityMeasurementFrontend/
│
├── index.html              ← Login/Register page
├── dashboard.html          ← Main app after login
│
├── css/
│   ├── style.css           ← global styles + theme variables
│   ├── auth.css            ← login/register page styles
│   └── dashboard.css       ← dashboard page styles
│
├── js/
    ├── config.js           ← API base URL, theme & token management
    ├── auth.js             ← login/register/logout logic
    ├── api.js              ← all fetch/AJAX calls to Spring Boot
    └── dashboard.js        ← dashboard page logic

```

---

## 📖 Pages

### `index.html` — Auth Page
- Login with Email/Password
- Register with Email/Password
- Login with Google
- Dark/Light theme toggle
- Smooth tab switching between login and register

### `dashboard.html` — Main App
- Navbar with user info + logout + theme toggle
- **Compare** — check if two quantities are equal
- **Add** — add two quantities
- **Subtract** — subtract one quantity from another
- **Divide** — divide one quantity by another
- **Convert** — convert between units
- **History** table showing recent operations

---

## 📐 Supported Units

| Category | Units |
|----------|-------|
| Length | `FEET`, `INCH`, `YARDS`, `CENTIMETER` |
| Weight | `KILOGRAM`, `GRAM`, `POUND` |
| Volume | `LITRE`, `MILLILITRE`, `GALLON` |
| Temperature | `CELSIUS`, `FAHRENHEIT` |

---

## ⚙️ Running the App

### Prerequisites
- Backend running at `http://localhost:8080`
- Any modern browser

### Steps
```bash
# Clone the repo
git clone https://github.com/VaidikPandey/QuantityMeasurementFrontend.git

# Open index.html in browser
# OR use Live Server extension in VS Code
```

> ⚠️ Make sure your Spring Boot backend is running before opening the frontend!

---

## 🔗 Backend Repo

👉 [QuantityMeasurementApp](https://github.com/VaidikPandey/QuantityMeasurementApp)

---

## 🧠 Key Concepts Used

- DOM Manipulation
- Event Handling
- Fetch API / AJAX
- Promises & Async/Await
- JWT token in localStorage
- CSS Variables for theming
- Flexbox & Grid layout
- Responsive design with media queries
- ES9 features

---

## 👨‍💻 Author

**Vaidik Pandey**
