# Frontend - Appointment Management System

## 📁 Project Structure

```
frontend/src/
├── components/
│   ├── layout/           # Layout components (Header, Sidebar, Navbar)
│   ├── auth/            # Authentication components (Login, Register)
│   ├── dashboard/       # Dashboard components for each role
│   ├── admin/          # Admin-specific components
│   ├── company/        # Company-specific components
│   └── user/           # User-specific components
├── types/              # TypeScript type definitions
├── utils/              # Utility functions (API, helpers)
├── hooks/              # Custom React hooks
├── styles/             # CSS styles
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## 🏗️ Architecture Overview

### **Components Organization**
- **Layout Components**: Reusable UI components for navigation and layout
- **Auth Components**: Login and registration forms
- **Dashboard Components**: Role-specific dashboard views
- **Feature Components**: Organized by user role (admin, company, user)

### **Type Safety**
- Centralized type definitions in `types/index.ts`
- Strongly typed API responses and component props
- Interface definitions for all data models

### **API Layer**
- Centralized API utilities in `utils/api.ts`
- Role-specific API functions (adminAPI, companyAPI, userAPI)
- Automatic token management and error handling

### **Custom Hooks**
- `useAuth`: Authentication state management
- Reusable logic for common operations

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
cd frontend
npm install
```

### Development
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 📋 Key Features

### **Authentication System**
- JWT-based authentication
- Role-based access control
- Automatic token management
- Protected routes

### **Responsive Design**
- Mobile-first approach
- Sidebar navigation with hamburger menu
- Responsive dashboard layouts

### **Role-Based Dashboards**
- **Admin**: System-wide statistics and management
- **Company**: Business-specific metrics and operations
- **User**: Personal appointment management

## 🛠️ Technology Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **CSS3** - Styling with custom classes

## 📝 Code Standards

### **File Naming**
- Components: PascalCase (e.g., `AdminDashboard.tsx`)
- Utilities: camelCase (e.g., `api.ts`)
- Types: camelCase (e.g., `index.ts`)

### **Component Structure**
```typescript
import React from 'react'
import { ComponentType } from './types'

interface ComponentProps {
  // Props interface
}

const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic
  return (
    // JSX
  )
}

export default Component
```

### **API Usage**
```typescript
import { adminAPI } from '../utils/api'

// Using the API
const response = await adminAPI.getDashboard()
if (response.success) {
  // Handle success
}
```

## 🔧 Development Guidelines

1. **Type Safety**: Always use TypeScript interfaces for props and API responses
2. **Component Organization**: Place components in appropriate directories based on their purpose
3. **API Calls**: Use the centralized API utilities instead of direct fetch calls
4. **State Management**: Use React hooks for local state, custom hooks for shared logic
5. **Error Handling**: Implement proper error handling in all API calls
6. **Responsive Design**: Ensure all components work on mobile and desktop

## 🎨 Styling

- Custom CSS classes in `styles/index.css`
- Responsive design with media queries
- Consistent color scheme and spacing
- Mobile-first approach

## 🔐 Security

- JWT tokens stored in localStorage
- Automatic token refresh and validation
- Role-based route protection
- Input validation and sanitization

## 📱 Responsive Features

- Collapsible sidebar navigation
- Mobile hamburger menu
- Responsive dashboard grids
- Touch-friendly interface elements
