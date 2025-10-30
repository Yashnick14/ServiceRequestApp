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

### API Endpoints Implemented

- `POST /service_requests` → create request
- `GET /service_requests` → list requests with pagination
- `PUT /service_requests/:id` → update request
- `DELETE /service_requests/:id` → delete request
- `GET /drivers` → read-only
- `GET /vehicles` → read-only
- `GET /analytics/daily` → returns count of new requests for last 7 days
- Input validation with clear error messages and consistent JSON shape
- Correct HTTP status codes used

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

## Running the Service Request App

### Prerequisites

- Node.js (v18+ recommended)
- npm (v9+ recommended)
- Git

---

# Install root dependencies

```bash
git clone https://github.com/Yashnick14/ServiceRequestApp.git
cd ServiceRequestApp

# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..

# From root folder
npm start
```

### Quality Gates Implemented

- Linter + Prettier configured
- Logging middleware for method, path, status, and duration
- One unit test for a pure function and one API route
- Clear and meaningful commit history

### Deliverables Completed

- Repository with code and README
- Screenshots of customer form and admin panel included under screenshots folder
- Postman collection for APIs under postman folder
- Seed scripts for drivers and vehicles
- Test results output under screenshots/TestResults
- `.env.example` provided
- Single command to start frontend and backend
