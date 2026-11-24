
# System Architecture

The Blood Management System will follow a three-layer architecture.

## 1. Presentation Layer (Frontend)
Provides the user interface for hospital staff.

Responsibilities:
- Display dashboards.
- Manage forms and tables.
- Send requests to the backend.

## 2. Application Layer (Backend)
Handles the system's business logic.

Responsibilities:
- Authentication and authorization.
- Donor management.
- Donation management.
- Blood stock calculations.
- API endpoints.
- Expiration and donor reminders.

## 3. Data Layer (Database)
Stores and manages system information.

Responsibilities:
- Store donor records.
- Store donation records.
- Store staff accounts.
- Store destinations.
- Maintain data relationships.

## Communication
Frontend communicates with the backend through APIs.
Backend communicates with the database to retrieve and store information.
