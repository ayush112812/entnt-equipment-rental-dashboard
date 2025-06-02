export const USER_ROLES = {
  ADMIN: 'Admin',
  STAFF: 'Staff',
  CUSTOMER: 'Customer'
};

export const EQUIPMENT_STATUS = {
  AVAILABLE: 'Available',
  RENTED: 'Rented',
  MAINTENANCE: 'Maintenance'
};

export const EQUIPMENT_CONDITION = {
  EXCELLENT: 'Excellent',
  GOOD: 'Good',
  FAIR: 'Fair',
  POOR: 'Poor'
};

export const RENTAL_STATUS = {
  RESERVED: 'Reserved',
  ONGOING: 'Ongoing',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};

export const MAINTENANCE_TYPES = {
  ROUTINE: 'Routine Check',
  REPAIR: 'Repair',
  INSPECTION: 'Inspection',
  FULL_SERVICE: 'Full Service'
};

export const NOTIFICATION_TYPES = {
  RENTAL_CREATED: 'RENTAL_CREATED',
  RENTAL_UPDATED: 'RENTAL_UPDATED',
  RENTAL_RETURNED: 'RENTAL_RETURNED',
  EQUIPMENT_ADDED: 'EQUIPMENT_ADDED',
  EQUIPMENT_UPDATED: 'EQUIPMENT_UPDATED',
  MAINTENANCE_SCHEDULED: 'MAINTENANCE_SCHEDULED',
  MAINTENANCE_COMPLETED: 'MAINTENANCE_COMPLETED'
};

export const LOCAL_STORAGE_KEYS = {
  USERS: 'entnt_users',
  EQUIPMENT: 'entnt_equipment',
  RENTALS: 'entnt_rentals',
  MAINTENANCE: 'entnt_maintenance',
  NOTIFICATIONS: 'entnt_notifications',
  CURRENT_USER: 'entnt_current_user'
};

export const MOCK_DATA = {
  users: [
    { "id": "1", "role": "Admin", "email": "admin@entnt.in", "password": "admin123" },
    { "id": "2", "role": "Staff", "email": "staff@entnt.in", "password": "staff123" },
    { "id": "3", "role": "Customer", "email": "customer@entnt.in", "password": "cust123" },
    { "id": "4", "role": "Customer", "email": "jane@entnt.in", "password": "jane123" },
    { "id": "5", "role": "Staff", "email": "tech@entnt.in", "password": "tech123" },
    { "id": "6", "role": "Customer", "email": "bob@entnt.in", "password": "bobpass" },
    { "id": "7", "role": "Customer", "email": "alice@entnt.in", "password": "alicepass" },
    { "id": "8", "role": "Customer", "email": "mike@entnt.in", "password": "mikepass" },
    { "id": "9", "role": "Staff", "email": "manager@entnt.in", "password": "manager123" },
    { "id": "10", "role": "Customer", "email": "linda@entnt.in", "password": "linda123" },
    { "id": "11", "role": "Customer", "email": "peter@entnt.in", "password": "peterpass" }
  ],
  equipment: [
    { "id": "eq1", "name": "Excavator", "category": "Heavy Machinery", "condition": "Good", "status": "Available", "description": "CAT 320 Excavator - 20 ton capacity", "dailyRate": 250, "dateAdded": "2025-01-15" },
    { "id": "eq2", "name": "Concrete Mixer", "category": "Construction", "condition": "Excellent", "status": "Rented", "description": "Portable concrete mixer - 6 cubic foot capacity", "dailyRate": 75, "dateAdded": "2025-01-20" },
    { "id": "eq3", "name": "Bulldozer", "category": "Heavy Machinery", "condition": "Fair", "status": "Maintenance", "description": "CAT D6 Bulldozer", "dailyRate": 300, "dateAdded": "2025-02-01" },
    { "id": "eq4", "name": "Forklift", "category": "Warehouse Equipment", "condition": "Good", "status": "Available", "description": "Electric forklift - 5000 lb capacity", "dailyRate": 150, "dateAdded": "2025-02-10" },
    { "id": "eq5", "name": "Scissor Lift", "category": "Construction", "condition": "Excellent", "status": "Available", "description": "Electric scissor lift - 20ft height", "dailyRate": 120, "dateAdded": "2025-02-15" },
    { "id": "eq6", "name": "Dump Truck", "category": "Heavy Machinery", "condition": "Good", "status": "Available", "description": "10-wheel dump truck", "dailyRate": 280, "dateAdded": "2025-02-20" },
    { "id": "eq7", "name": "Loader", "category": "Construction", "condition": "Excellent", "status": "Available", "description": "Wheel loader - 3 cubic yard bucket", "dailyRate": 200, "dateAdded": "2025-03-01" },
    { "id": "eq8", "name": "Crane", "category": "Heavy Machinery", "condition": "Good", "status": "Rented", "description": "Mobile crane - 50 ton capacity", "dailyRate": 500, "dateAdded": "2025-03-10" },
    { "id": "eq9", "name": "Backhoe", "category": "Construction", "condition": "Good", "status": "Available", "description": "JCB Backhoe loader", "dailyRate": 180, "dateAdded": "2025-03-15" },
    { "id": "eq10", "name": "Jackhammer", "category": "Construction", "condition": "Excellent", "status": "Available", "description": "Electric jackhammer - heavy duty", "dailyRate": 60, "dateAdded": "2025-03-20" },
    { "id": "eq11", "name": "Plate Compactor", "category": "Construction", "condition": "Good", "status": "Available", "description": "Walk-behind plate compactor", "dailyRate": 45, "dateAdded": "2025-04-01" },
    { "id": "eq12", "name": "Skid Steer Loader", "category": "Heavy Machinery", "condition": "Excellent", "status": "Available", "description": "Bobcat skid steer with attachments", "dailyRate": 175, "dateAdded": "2025-04-10" }
  ],
  rentals: [
    { "id": "r1", "equipmentId": "eq2", "customerId": "3", "customerName": "Customer User", "equipmentName": "Concrete Mixer", "startDate": "2025-06-01", "endDate": "2025-06-05", "status": "Reserved", "totalCost": 375, "notes": "First rental" },
    { "id": "r2", "equipmentId": "eq4", "customerId": "4", "customerName": "Jane Doe", "equipmentName": "Forklift", "startDate": "2025-06-02", "endDate": "2025-06-10", "status": "Ongoing", "totalCost": 1200, "notes": "Extended rental period" },
    { "id": "r3", "equipmentId": "eq5", "customerId": "3", "customerName": "Customer User", "equipmentName": "Scissor Lift", "startDate": "2025-06-03", "endDate": "2025-06-07", "status": "Completed", "totalCost": 480, "notes": "Project completed early" },
    { "id": "r4", "equipmentId": "eq6", "customerId": "6", "customerName": "Bob Smith", "equipmentName": "Dump Truck", "startDate": "2025-06-05", "endDate": "2025-06-12", "status": "Reserved", "totalCost": 1960, "notes": "Construction project" },
    { "id": "r5", "equipmentId": "eq8", "customerId": "7", "customerName": "Alice Johnson", "equipmentName": "Crane", "startDate": "2025-06-04", "endDate": "2025-06-08", "status": "Ongoing", "totalCost": 2000, "notes": "High-rise project" },
    { "id": "r6", "equipmentId": "eq9", "customerId": "8", "customerName": "Mike Wilson", "equipmentName": "Backhoe", "startDate": "2025-06-06", "endDate": "2025-06-09", "status": "Reserved", "totalCost": 540, "notes": "Excavation work" },
    { "id": "r7", "equipmentId": "eq10", "customerId": "6", "customerName": "Bob Smith", "equipmentName": "Jackhammer", "startDate": "2025-06-07", "endDate": "2025-06-10", "status": "Completed", "totalCost": 180, "notes": "Demolition work" },
    { "id": "r8", "equipmentId": "eq11", "customerId": "10", "customerName": "Linda Brown", "equipmentName": "Plate Compactor", "startDate": "2025-06-08", "endDate": "2025-06-11", "status": "Ongoing", "totalCost": 135, "notes": "Road work" },
    { "id": "r9", "equipmentId": "eq12", "customerId": "11", "customerName": "Peter Davis", "equipmentName": "Skid Steer Loader", "startDate": "2025-06-09", "endDate": "2025-06-13", "status": "Reserved", "totalCost": 700, "notes": "Landscaping project" }
  ],
  maintenance: [
    { "id": "m1", "equipmentId": "eq1", "equipmentName": "Excavator", "date": "2025-05-20", "type": "Routine Check", "notes": "No issues found", "cost": 150, "technician": "John Doe" },
    { "id": "m2", "equipmentId": "eq3", "equipmentName": "Bulldozer", "date": "2025-05-28", "type": "Repair", "notes": "Replaced hydraulic pump", "cost": 2500, "technician": "Mike Tech" },
    { "id": "m3", "equipmentId": "eq4", "equipmentName": "Forklift", "date": "2025-05-25", "type": "Inspection", "notes": "Battery replaced", "cost": 400, "technician": "Sarah Smith" },
    { "id": "m4", "equipmentId": "eq7", "equipmentName": "Loader", "date": "2025-05-30", "type": "Full Service", "notes": "Replaced tires and oil change", "cost": 800, "technician": "John Doe" },
    { "id": "m5", "equipmentId": "eq8", "equipmentName": "Crane", "date": "2025-05-29", "type": "Repair", "notes": "Fixed winch system", "cost": 1200, "technician": "Mike Tech" },
    { "id": "m6", "equipmentId": "eq9", "equipmentName": "Backhoe", "date": "2025-06-01", "type": "Inspection", "notes": "Safety inspection completed", "cost": 200, "technician": "Sarah Smith" },
    { "id": "m7", "equipmentId": "eq10", "equipmentName": "Jackhammer", "date": "2025-06-02", "type": "Repair", "notes": "Replaced drill bit", "cost": 150, "technician": "John Doe" },
    { "id": "m8", "equipmentId": "eq11", "equipmentName": "Plate Compactor", "date": "2025-06-03", "type": "Routine Check", "notes": "Lubricated moving parts", "cost": 75, "technician": "Mike Tech" },
    { "id": "m9", "equipmentId": "eq12", "equipmentName": "Skid Steer Loader", "date": "2025-06-04", "type": "Repair", "notes": "Hydraulic system flushed", "cost": 350, "technician": "Sarah Smith" }
  ],
  notifications: []
};

export const DRAWER_WIDTH = 240;
