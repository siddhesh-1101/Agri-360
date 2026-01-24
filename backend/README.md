# Agri-360 Backend API

Backend API for the Agri-360 platform - connecting farmers, retailers, and ripening agents.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Three User Roles**: Farmers, Retailers, and Ripening Agents
- **Dashboard Endpoints**: Role-specific dashboards with relevant data
- **Produce Management**: Farmers can upload and manage produce
- **Order Management**: Retailers can browse produce and place orders
- **Ripening Management**: Agents can manage assigned produce and update ripening status
- **Comparison Feature**: Compare nearby users based on geolocation/region

## Tech Stack

- **Node.js** + **Express.js**: Backend framework
- **MongoDB** + **Mongoose**: Database and ODM
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **express-validator**: Input validation

## Project Structure

```
backend/
├── config/
│   └── db.js              # Database configuration
├── controllers/
│   ├── authController.js      # Authentication logic
│   ├── farmerController.js    # Farmer operations
│   ├── retailerController.js  # Retailer operations
│   ├── agentController.js     # Agent operations
│   └── comparisonController.js # Comparison feature
├── middleware/
│   └── auth.js            # Authentication middleware
├── models/
│   ├── User.js            # Base user model
│   ├── Farmer.js          # Farmer profile model
│   ├── Retailer.js        # Retailer profile model
│   ├── Agent.js           # Agent profile model
│   ├── Produce.js         # Produce model
│   └── Order.js           # Order model
├── routes/
│   ├── auth.js            # Auth routes
│   ├── farmers.js         # Farmer routes
│   ├── retailers.js       # Retailer routes
│   ├── agents.js          # Agent routes
│   └── comparison.js      # Comparison routes
├── scripts/
│   └── seed.js            # Seed data script
├── utils/
│   └── generateToken.js   # JWT token generation
├── server.js              # Main server file
└── package.json           # Dependencies

```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the `backend` directory:
```env
MONGODB_URI=mongodb://localhost:27017/agri360
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

3. Make sure MongoDB is running on your system.

## Running the Server

### Development mode (with nodemon):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in .env).

## Seeding Database

To populate the database with sample data:

```bash
npm run seed
```

This will create:
- 3 Farmers
- 3 Retailers
- 2 Ripening Agents
- Sample produce items

**Sample login credentials:**
- Farmers: `farmer1@agri360.com` / `password123`
- Retailers: `retailer1@agri360.com` / `password123`
- Agents: `agent1@agri360.com` / `password123`

## API Endpoints

### Authentication

- `POST /api/auth/register/:role` - Register new user (farmer, retailer, or agent)
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (Protected)

### Farmers

- `GET /api/farmers/dashboard` - Get farmer dashboard (Protected, Farmer only)
- `GET /api/farmers/produce` - Get all produce by farmer (Protected, Farmer only)
- `POST /api/farmers/produce` - Upload produce details (Protected, Farmer only)
- `PUT /api/farmers/produce/:id` - Update produce (Protected, Farmer only)
- `DELETE /api/farmers/produce/:id` - Delete produce (Protected, Farmer only)
- `GET /api/farmers/nearby-retailers` - Get nearby retailers (Protected, Farmer only)

### Retailers

- `GET /api/retailers/dashboard` - Get retailer dashboard (Protected, Retailer only)
- `GET /api/retailers/produce` - Browse available produce (Protected, Retailer only)
- `GET /api/retailers/orders` - Get all orders (Protected, Retailer only)
- `POST /api/retailers/orders` - Place an order (Protected, Retailer only)
- `GET /api/retailers/agents` - Track ripening agents (Protected, Retailer only)

### Ripening Agents

- `GET /api/agents/dashboard` - Get agent dashboard (Protected, Agent only)
- `GET /api/agents/produce` - Get assigned produce (Protected, Agent only)
- `PUT /api/agents/produce/:id/status` - Update ripening status (Protected, Agent only)
- `PUT /api/agents/orders/:orderId/accept` - Accept order (Protected, Agent only)
- `POST /api/agents/produce/:id/notify-retailer` - Notify retailer (Protected, Agent only)

### Comparison

- `GET /api/compare/nearby` - Compare nearby users by role (Protected)
- `GET /api/compare/nearby/:role` - Get nearby users by role (Protected)

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

The token is obtained from the login endpoint and should be included in subsequent requests.

## Response Format

All API responses follow a consistent format:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Example Usage

### Register a Farmer

```bash
POST /api/auth/register/farmer
Content-Type: application/json

{
  "email": "newfarmer@example.com",
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

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "farmer1@agri360.com",
  "password": "password123"
}
```

### Get Farmer Dashboard

```bash
GET /api/farmers/dashboard
Authorization: Bearer <token>
```

## Notes

- All passwords are hashed using bcryptjs before storage
- User locations are indexed for faster geolocation-based queries
- The comparison feature uses the `region` field to find nearby users
- All dashboards return JSON data suitable for React frontend consumption

## License

ISC
