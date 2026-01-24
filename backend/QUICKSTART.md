# Quick Start Guide

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or connection string)

## Setup Steps

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Create Environment File**
   Create a `.env` file in the `backend` directory with:
   ```env
   MONGODB_URI=mongodb://localhost:27017/agri360
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   ```

3. **Seed Database (Optional)**
   ```bash
   npm run seed
   ```

4. **Start Server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Test the API**
   The server will be running on `http://localhost:5000`

   Test the health endpoint:
   ```bash
   curl http://localhost:5000/health
   ```

## Sample API Calls

### 1. Register a Farmer
```bash
POST http://localhost:5000/api/auth/register/farmer
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "farmName": "John's Farm",
  "location": {
    "region": "North Region",
    "latitude": 40.7128,
    "longitude": -74.0060
  }
}
```

### 2. Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "farmer1@agri360.com",
  "password": "password123"
}
```

### 3. Access Protected Route (use token from login)
```bash
GET http://localhost:5000/api/farmers/dashboard
Authorization: Bearer YOUR_TOKEN_HERE
```

## Default Credentials (After Seeding)

- **Farmers:**
  - `farmer1@agri360.com` / `password123`
  - `farmer2@agri360.com` / `password123`
  
- **Retailers:**
  - `retailer1@agri360.com` / `password123`
  - `retailer2@agri360.com` / `password123`
  
- **Agents:**
  - `agent1@agri360.com` / `password123`
  - `agent2@agri360.com` / `password123`

## API Endpoints Overview

### Authentication
- `POST /api/auth/register/:role` - Register (farmer, retailer, agent)
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Farmers
- `GET /api/farmers/dashboard` - Dashboard
- `GET /api/farmers/produce` - List produce
- `POST /api/farmers/produce` - Upload produce
- `PUT /api/farmers/produce/:id` - Update produce
- `DELETE /api/farmers/produce/:id` - Delete produce
- `GET /api/farmers/nearby-retailers` - Find nearby retailers

### Retailers
- `GET /api/retailers/dashboard` - Dashboard
- `GET /api/retailers/produce` - Browse produce
- `POST /api/retailers/orders` - Place order
- `GET /api/retailers/orders` - List orders
- `GET /api/retailers/agents` - Track agents

### Agents
- `GET /api/agents/dashboard` - Dashboard
- `GET /api/agents/produce` - Assigned produce
- `PUT /api/agents/produce/:id/status` - Update ripening status
- `PUT /api/agents/orders/:orderId/accept` - Accept order
- `POST /api/agents/produce/:id/notify-retailer` - Notify retailer

### Comparison
- `GET /api/compare/nearby` - Compare nearby users
- `GET /api/compare/nearby/:role` - Get nearby users by role

## Notes

- All protected routes require a JWT token in the Authorization header
- Tokens expire after 7 days (configurable in .env)
- The comparison feature uses the `region` field to find nearby users
- All dashboards return JSON data suitable for React frontend
