# ENTNT Equipment Rental Management System

A modern, responsive equipment rental management system built with React. This application helps businesses manage their equipment inventory, rental orders, and maintenance schedules efficiently.

## Features

### Core Functionality
- **User Authentication**
  - Role-based access control (Admin, Staff, Customer)
  - Secure login with session persistence
  - Protected routes based on user roles

- **Equipment Management**
  - Comprehensive equipment inventory tracking
  - Add, edit, and delete equipment items
  - Detailed equipment information and history
  - Status tracking (Available, Rented, Maintenance)

- **Rental Management**
  - Create and manage rental orders
  - Calendar view for rental scheduling
  - Status tracking (Reserved, Rented, Returned, Overdue)
  - Rental history and customer tracking

- **Maintenance Management**
  - Schedule and track maintenance activities
  - Maintenance history per equipment
  - Upcoming maintenance notifications

- **Dashboard & Analytics**
  - Real-time KPI monitoring
  - Equipment utilization metrics
  - Visual data representation with charts
  - Overdue rentals tracking

### Additional Features
- **Modern UI/UX**
  - Material UI components
  - Responsive design for all devices
  - Interactive data visualizations
  - User-friendly forms and validations

- **Notification System**
  - Real-time notifications
  - Notification center with read/unread status
  - Important events tracking

## Technical Stack

- **Frontend Framework**: React (Functional Components)
- **Routing**: React Router v7
- **State Management**: Context API
- **UI Framework**: Material UI
- **Charts**: Recharts
- **Data Persistence**: LocalStorage
- **Form Validation**: Custom validation with error handling
- **Code Quality**: ESLint & Prettier

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/entnt-equipment-rental.git
cd entnt-equipment-rental
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Demo Accounts

The system comes with pre-configured demo accounts:

- **Admin**
  - Email: admin@entnt.in
  - Password: admin123

- **Staff**
  - Email: staff@entnt.in
  - Password: staff123

- **Customer**
  - Email: customer@entnt.in
  - Password: cust123

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Authentication/  # Login and auth-related components
│   ├── Dashboard/       # Dashboard components and charts
│   ├── Equipment/       # Equipment management components
│   ├── Layout/         # App layout components
│   ├── Maintenance/    # Maintenance management components
│   ├── Notifications/  # Notification components
│   └── Rentals/        # Rental management components
├── contexts/           # React Context providers
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── styles/            # Global styles and themes
├── utils/             # Utility functions and constants
└── App.jsx            # Main application component
```

## Features in Detail

### Equipment Management
- Complete CRUD operations for equipment
- Detailed equipment information tracking
- Status and condition monitoring
- Rental and maintenance history
- Equipment categorization

### Rental System
- Intuitive rental creation process
- Calendar-based availability view
- Automated status updates
- Rental history tracking
- Overdue rental monitoring

### Maintenance Tracking
- Scheduled maintenance planning
- Maintenance history records
- Cost tracking
- Technician assignment
- Upcoming maintenance alerts

### Dashboard Analytics
- Real-time KPI monitoring
- Equipment utilization metrics
- Revenue tracking
- Maintenance schedules
- Visual data representation

## Code Quality

The project maintains high code quality through:
- Consistent code style with ESLint and Prettier
- Component modularity and reusability
- Proper error handling and validation
- Comprehensive documentation
- Clean and maintainable architecture

## Security Features

- Role-based access control
- Protected routes
- Input validation
- Error handling

## License

This project is licensed under the MIT License - see the LICENSE file for details.
