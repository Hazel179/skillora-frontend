
# 🎓 Skillora - Lesson Booking App

**Skillora** is a full-stack lesson booking system built with Vue.js (frontend) and Express.js + MongoDB (backend). The platform enables users to browse, sort, search, and book various skill-based lessons such as sports, music, film production, and more.

## 🔥 Live Demo

- **Frontend** (GitHub Pages): [https://hazel179.github.io/skillora-frontend](https://hazel179.github.io/skillora-frontend)  
- **Backend API** (Render): [https://skillora-server.onrender.com](https://skillora-server.onrender.com)

---

## ✨ Features

### 1. Lesson Display  
- Shows a collection of skill-based lessons (e.g., football, coding, swimming) with:
  - 🏷️ Subject  
  - 📍 Location  
  - 💵 Price  
  - 🎯 Available Spaces  
  - ⭐ Ratings  
  - 🖼️ Dynamic images from the backend  
- Rendered dynamically using `v-for` in Vue.

### 2. Sorting & Searching  
- Sort lessons by:
  - Name
  - Location
  - Price
  - Spaces
  - Ratings  
- Search bar supports real-time keyword filtering.

### 3. Add to Cart & Spaces Management  
- Add lessons to cart (only if spaces > 0).  
- Adding a lesson reduces the available space in real-time.  
- "No Spaces" disables the add button.

### 4. Cart Page  
- View and manage cart items.  
- Remove lessons from the cart to restore availability.

### 5. Checkout Process  
- Click **Cart** → Fill out the checkout form.  
- Validate:
  - First/Last Name (letters only)
  - Email
  - Phone number
  - City, Zip, and State selection
  - Delivery method  
- On submit:
  - Order is sent to backend
  - Spaces are updated in MongoDB
  - Modal shows confirmation message

### 6. Responsive Design  
- Fully responsive layout (desktop & mobile)  
- Simple, clean, and user-friendly UI with a pink theme

---

## 🛠️ Technologies Used

### 👩‍💻 Frontend
- **Vue.js 2** – reactive UI for dynamic data binding  
- **HTML & CSS** – structure and layout  
- **Font Awesome** – icons  
- **GitHub Pages** – for static frontend hosting

### 🧠 Backend
- **Node.js** – server-side JavaScript  
- **Express.js** – RESTful API for lessons and orders  
- **MongoDB Atlas** – NoSQL database storing lesson data and orders  
- **Render** – free backend deployment

---

## 📁 Project Structure

```
├── frontend/
│   ├── index.html
│   ├── script.js
│   ├── style.css
├── backend/
│   ├── app.js
│   ├── routes/
│   ├── controllers/
│   ├── config/
│   ├── images/
```

---

## 📸 Screenshots

> You can add screenshots of:
- Home page with lessons
- Cart view
- Checkout form
- Success modal

---

## 🚀 How to Run Locally

### Backend
```bash
cd backend
npm install
node app.js
```

### Frontend
Just open `index.html` in a browser or use Live Server in VS Code.

---

## 🙌 Team & Credits

- Developed by Khaing Nyein San Htet
- University Coursework – CST3144 Full Stack Web Development
