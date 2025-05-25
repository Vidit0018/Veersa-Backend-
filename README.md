# 🩺 AppointMed – Smart Medical Appointment App (Backend)

This repository contains the backend code for **AppointMed**, a full-stack, AI-assisted medical appointment mobile application. The backend enables user management, doctor discovery based on symptoms and geolocation, and appointment scheduling features.

---

## 📌 Project Overview

AppointMed allows users to:
- Register, log in, and securely manage their profile
- Input symptoms to receive AI-generated doctor suggestions
- Sort and filter doctors based on specialization and proximity
- Book, reschedule, and cancel appointments

Admins can:
- Manage doctor profiles
- Monitor system metrics

---

## ✅ Functional Requirements

- User authentication and registration
- Symptom-based AI doctor suggestions
- Geolocation-based doctor sorting
- Doctor filtering by specialization and distance
- Appointment booking, rescheduling, and cancellation
- Admin dashboard for doctor and metric management

---

## 🔐 Non-Functional Requirements

- Scalable RESTful API architecture
- Optimized response times via backend-side pagination and filtering
- Token-based authentication (secure)
- Mobile-first UX design
- High availability via **Railway** hosting

---

## 🧱 Tech Stack Used

### 📌 Backend:
- Node.js with Express.js
- MongoDB Atlas
- Languages: JavaScript & TypeScript

### 🤖 AI Assistance:
- Gemini API – Doctor suggestions based on symptoms
- RapidAPI Med API – Diagnosis and condition mapping
- Replicate API – Additional AI tasks

### 🌍 Public APIs:
- OpenCage API – Address to coordinates
- OpenStreetMap API – Geolocation sorting

### 🛠 Tools & Management:
- Git & GitHub – Branching strategy with `develop` and feature branches
- Postman – Shared workspace for API testing
- Trello – Task and API tracking
- Figma – UI design and prototyping
- Railway & Render – Backend hosting

---

## 📏 Coding Protocols & Best Practices

1. Modular RESTful backend architecture
2. 1000+ doctor dataset for production readiness
3. API services decoupled for frontend reusability
4. Backend-side filtering & pagination for performance
5. Git workflow with separate dev/feature branches
6. Thorough API testing before merges
7. Shared Postman collection for collaboration
8. Trello board maintained with cURLs and task tracking
9. Deployed via Railway for persistent uptime
10. Consistent error handling with proper status codes

---

## 📎 Additional Resources

- 📄 **Project Documentation**:  
  [View on Google Drive](https://drive.google.com/file/d/1I22vA-GGSCmgwxKFoFUxdnDN0wEsw2H_/view?usp=drive_link)

- 🎨 **Figma Design**:  
  [Doctor Appointment App UI Kit](https://www.figma.com/design/BoGSswg5qWtmEwiz9hRfBh/Doctor-Appointment---Consultation-App-UI-Kit-%7C-Case-Study--Community-?node-id=0-1&p=f&t=YChGVDzwc1gXydu8-0)

- 🧪 **Manual Testing Report**:  
  [Download on Google Drive](https://drive.google.com/file/d/1F4oDQ5IY-DWwCRengkeOUgL6ysz474ks/view?usp=sharing)

---

## 📬 Contact

For any questions, please open an issue or reach out via the project's GitHub repository.
