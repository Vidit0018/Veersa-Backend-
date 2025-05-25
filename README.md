# 🩺 AppointMed – Smart Medical Appointment App (Backend)

This repository contains the backend codebase for **AppointMed**, a full-stack AI-assisted medical appointment application. The backend provides RESTful APIs for user authentication, doctor suggestions, appointment booking, and admin functionalities.

---

## 📌 Project Overview

AppointMed is a smart medical appointment mobile application that allows users to:

- Seamlessly schedule medical appointments
- Receive AI-based suggestions for specialists based on symptoms
- Sort nearby doctors using geolocation

---

## ✅ Functional Requirements

- Users can:
  - Register and log in
  - Input symptoms and receive AI-generated doctor suggestions
  - Search, sort, and filter doctors by specialization and distance
  - Book, reschedule, or cancel appointments
- Admins can:
  - Manage doctors
  - View system metrics

---

## 🔐 Non-Functional Requirements

- RESTful API architecture for scalability
- Optimized API response time with pagination and server-side filtering
- Secure token-based authentication
- Mobile-first, smooth UX design
- High availability using Railway hosting

---

## 🧱 Tech Stack Used

### Backend:
- **Node.js** with **Express.js**
- **MongoDB Atlas**
- **Languages**: JavaScript and TypeScript

### AI Assistance:
- **Gemini API** – Doctor suggestions
- **RapidAPI Med API** – Diagnosis
- **Replicate API** – Additional AI tasks

### Public APIs:
- **OpenCage API** – Address-to-coordinates
- **OpenStreetMap API** – Location sorting

### Code & Project Management:
- Git & GitHub (branching strategy)
- Postman (shared workspace)
- Trello Board (task and API tracking)
- Figma (design and prototyping)
- Railway & Render for backend hosting

---

## 📏 Coding Protocols & Best Practices

1. Modular RESTful backend structure for scalability
2. Production-ready with 1000+ doctor dataset
3. Reusable API services on frontend
4. Backend-side filtering and pagination for performance
5. Git workflow with `developer-specific` and `develop` branches
6. Thorough testing before merge
7. Shared Postman collection for easier collaboration
8. Trello maintained with task details and cURL requests
9. Hosted on Railway for persistent uptime
10. Proper error modeling with consistent status codes

---
