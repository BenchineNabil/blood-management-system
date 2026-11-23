
# Blood Bank Management System
# Software Requirements

## 1. System Scope

The system is designed exclusively for hospital blood bank staff.

Staff will use the application to manage donors, blood donations, blood inventory, and blood requests.

Donors will not directly access the system.

## 2. System Actors

- Hospital Staff: Uses the system to manage all blood bank operations.

## 3. Functional Requirements

### FR-01: Donor Management
- Register new donors.
- Store donor information.
- View donor records.
- Search donors by address.

### FR-02: Blood Donation Management
- Create blood donation records.
- Link each donation to its donor using the donor number.
- Store phenotype information.
- Track donation information and status.

### FR-03: Blood Inventory Management
- Display current blood stock.
- Organize stock by blood group.
- Track available blood donations.
- Update stock when donations enter or leave the blood bank.

### FR-04: Expiration Management
- Track the expiration date of each donation.
- Generate alerts when donations approach expiration.

### FR-05: Destination Management
- Allow authorized staff to select a receiving service.
- Allow staff to manually add a new destination.

### FR-06: Donor Reminders
- Automatically remind eligible donors approximately 3 months and 1 week after their previous donation.
- Follow the hospital's eligibility rules.

### FR-07: Statistics and Dashboard
- Display useful blood bank statistics.
- Provide accurate statistics based on the hospital's needs.

## 4. Confidentiality Requirements

- Donations must be linked to donor numbers, not donor names.
- Donor information must be accessible only to authorized staff.

## 5. Current Business Workflow

1. Donor arrives.
2. Donor completes the registration form.
3. Staff check donor eligibility.
4. Blood is collected.
5. Blood is processed by the laboratory.
6. Blood returns to the blood bank.
7. Staff register the donation in the system.
8. Staff update the system when blood leaves the stock.

## 6. Non-Functional Requirements

To be confirmed with the hospital.

## 7. Pending Clarifications

- Exact donor information fields.
- Exact donation information fields.
- Blood expiration rules.
- Donor eligibility and reminder rules.
- Required statistics.
- User access permissions.
