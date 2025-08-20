# Appointment Management System

A full-stack web application for managing appointments with role-based access control (RBAC). The system supports three user roles: Administrators, Companies, and End Users.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Company, User)
- Secure password hashing with bcrypt
- Protected routes based on user roles

### Admin Features
- Dashboard with system statistics
- Manage company registrations and approvals
- User management
- View all appointments across the system
- Billing and subscription management
- Revenue tracking

### Company Features
- Company profile management
- Service management (add, edit, delete services)
- Appointment management and status updates
- Dashboard with company-specific statistics
- Subscription management

### User Features
- Browse available companies
- View company services
- Book appointments with date/time selection
- Manage personal appointments
- Appointment history and status tracking

## 🛠 Technology Stack

### Backend
- **Node.js** with Express.js
- **SQLite** database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Stripe** integration for payments
- **Express Validator** for input validation

### Frontend
- **React** with TypeScript
- **Redux Toolkit** for state management
- **React Router** for navigation
- **TailwindCSS** for styling
- **Axios** for API communication

## 📁 Project Structure

```
appointment-management-system/
├── backend/
│   ├── config/
│   │   ├── db.js              # Database configuration
│   │   ├── authMiddleware.js  # JWT authentication middleware
│   │   └── stripe.js          # Stripe payment configuration
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── adminController.js # Admin operations
│   │   ├── companyController.js # Company operations
│   │   ├── appointmentController.js # Appointment operations
│   │   └── userController.js  # User operations
│   ├── models/
│   │   ├── User.js           # User model
│   │   ├── Company.js        # Company model
│   │   ├── Service.js        # Service model
│   │   ├── Appointment.js    # Appointment model
│   │   └── Subscription.js   # Subscription model
│   ├── routes/
│   │   ├── authRoutes.js     # Authentication routes
│   │   ├── adminRoutes.js    # Admin routes
│   │   ├── companyRoutes.js  # Company routes
│   │   ├── appointmentRoutes.js # Appointment routes
│   │   └── userRoutes.js     # User routes
│   └── server.js             # Main server file
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/       # Layout components
│   │   │   └── UI/           # Reusable UI components
│   │   ├── pages/
│   │   │   ├── auth/         # Authentication pages
│   │   │   ├── admin/        # Admin pages
│   │   │   ├── company/      # Company pages
│   │   │   └── user/         # User pages
│   │   ├── services/
│   │   │   └── api.js        # API service functions
│   │   ├── store/
│   │   │   ├── store.ts      # Redux store configuration
│   │   │   └── slices/       # Redux slices
│   │   ├── App.tsx           # Main App component
│   │   └── index.tsx         # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── database/                 # SQLite database files
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd appointment-management-system
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key
   DB_PATH=./database/appointments.db
   STRIPE_SECRET_KEY=your_stripe_secret_key
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start the development servers**

   **Option 1: Run both servers simultaneously**
   ```bash
   npm run dev
   ```

   **Option 2: Run servers separately**
   ```bash
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## 👤 Default Admin Account

The system creates a default admin account on first run:
- **Email**: admin@appointments.com
- **Password**: admin123

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Admin Routes
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/companies` - Get all companies
- `PUT /api/admin/companies/:id/status` - Update company status
- `GET /api/admin/users` - Get all users
- `GET /api/admin/appointments` - Get all appointments
- `GET /api/admin/revenue-stats` - Get revenue statistics

### Company Routes
- `GET /api/company/dashboard` - Company dashboard
- `GET /api/company/profile` - Get company profile
- `PUT /api/company/profile` - Update company profile
- `GET /api/company/services` - Get company services
- `POST /api/company/services` - Create new service
- `GET /api/company/appointments` - Get company appointments

### User Routes
- `GET /api/user/dashboard` - User dashboard
- `GET /api/user/companies` - Browse companies
- `GET /api/user/appointments` - Get user appointments

### Appointment Routes
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/upcoming` - Get upcoming appointments
- `PUT /api/appointments/:id/cancel` - Cancel appointment
- `GET /api/appointments/available-slots` - Get available time slots

## 🎨 Role-Based Access

### Admin (`/admin/*`)
- Full system access
- Manage companies and users
- View all appointments
- Access billing and revenue data

### Company (`/company/*`)
- Manage company profile
- Create and manage services
- View and manage appointments
- Access company-specific analytics

### User (`/user/*`)
- Browse companies and services
- Book appointments
- Manage personal appointments
- View appointment history

## 💳 Payment Integration

The system includes Stripe integration for subscription billing:
- Company subscription plans
- Payment processing
- Revenue tracking
- Subscription management

## 🔧 Development

### Database Schema
The system uses SQLite with the following main tables:
- `users` - User accounts and authentication
- `companies` - Company profiles and status
- `services` - Company services and pricing
- `appointments` - Appointment bookings
- `subscriptions` - Company subscription data

### Adding New Features
1. Create database models in `backend/models/`
2. Add controllers in `backend/controllers/`
3. Define routes in `backend/routes/`
4. Create frontend components and pages
5. Add Redux actions and reducers if needed

## 🚀 Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in environment variables
2. Configure production database
3. Set up proper JWT secret
4. Configure Stripe production keys

### Frontend Deployment
1. Build the React app: `npm run build`
2. Serve the `build` folder with a web server
3. Configure API base URL for production

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository.
