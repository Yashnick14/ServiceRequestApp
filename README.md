# ServiceRequestApp

A full-stack **Service Request System** for a coach company.  
Customers can submit trip requests, and coordinators can manage, approve, reject, or schedule them with assigned drivers and vehicles.

---

## Tech Stack

**Frontend:** React (Vite), Axios, React Router  
**Backend:** Node.js, Express.js, Sequelize ORM  
**Database:** MySQL (via XAMPP)  
**Auth:** JWT (JSON Web Token)  
**Styling:** CSS  
**Environment:** `.env` for secrets

---

## Features

### Customer

- Submit a trip request with name, phone, pickup, dropoff, time, passengers, and notes.
- Responsive form with validation and success message.

### Coordinator

- Login to admin panel.
- View trip requests in a table with pagination.
- Approve, reject, or schedule requests.
- Assign driver, vehicle, and scheduled time.
- Search requests by name or phone.
- View analytics for daily requests in the last 7 days.

---

## Project Structure

ServiceRequestApp/
├── backend/
│ ├── src/
│ │ ├── config/
│ │ ├── controllers/
│ │ ├── middleware/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── app.js
│ │ └── server.js
│ ├── .env.example
│ └── package.json
└── frontend/
├── src/
│ ├── components/
│ ├── pages/
│ ├── services/
│ ├── App.jsx
│ └── main.jsx
├── screenshots/
│ ├── customer_form.png
│ └── admin_panel.png
└── package.json
