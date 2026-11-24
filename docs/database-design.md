# Blood Bank Management System
## Database Design & Business Rules

**Database Engine:** SQLite  
**Database Name:** `blood_bank.db`

---

# 1. Database Overview

The database is composed of five main tables:

| Table | Description |
|---|---|
| `donors` | Stores personal information about blood donors. |
| `donations` | Records the donation history of each donor. |
| `blood_units` | Stores information about blood units available in the blood bank. |
| `blood_unit_movements` | Tracks the movements and usage of blood units. |
| `users` | Stores the accounts of people authorized to use the system. |

---

# 2. Database Tables and Attributes

## 2.1. Donors

**Purpose:** Stores the personal information of registered blood donors.

| Attribute | Data Type | Constraints | Description |
|---|---|---|---|
| `donor_id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique identifier of the donor. |
| `first_name` | TEXT | NOT NULL | Donor's first name. |
| `last_name` | TEXT | NOT NULL | Donor's last name. |
| `date_of_birth` | TEXT | NOT NULL | Donor's date of birth. |
| `sex` | TEXT | NOT NULL, CHECK (M/F) | Donor's sex. |
| `address` | TEXT | NOT NULL | Donor's address. |
| `phone` | TEXT | NOT NULL | Donor's phone number. |
| `wants_reminder` | INTEGER | NOT NULL, DEFAULT 0, CHECK (0/1) | Indicates whether the donor wants reminders. |
| `created_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date when the donor was registered. |
| `blood_type` | TEXT | CHECK (valid blood types) | Donor's recorded blood type. |

**Allowed blood types:** A+, A-, B+, B-, AB+, AB-, O+, O-.

## 2.2. Donations

**Purpose:** Stores the history of blood donations made by registered donors.

| Attribute | Data Type | Constraints | Description |
|---|---|---|---|
| `donation_id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique identifier of the donation. |
| `donor_id` | INTEGER | NOT NULL, FOREIGN KEY | References the donor who made the donation. |
| `donation_date` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date and time of the donation. |

**Foreign Key:**
- `donor_id` REFERENCES `donors(donor_id)`.

## 2.3. Blood Units

**Purpose:** Stores information about individual blood units registered in the blood bank inventory.

| Attribute | Data Type | Constraints | Description |
|---|---|---|---|
| `unit_id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique identifier of the blood unit. |
| `blood_type` | TEXT | NOT NULL, CHECK (valid blood types) | Confirmed blood type of the unit. |
| `collection_date` | TEXT | NOT NULL | Date when the blood was collected. |
| `expiration_date` | TEXT | NOT NULL | Expiration date of the blood unit. |
| `volume_ml` | INTEGER | Optional | Volume of the blood unit in milliliters. |
| `status` | TEXT | NOT NULL, DEFAULT 'AVAILABLE', CHECK | Current status of the blood unit. |
| `created_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date when the unit was registered in the system. |

**Allowed blood types:** A+, A-, B+, B-, AB+, AB-, O+, O-.

**Allowed statuses:**
- `AVAILABLE`
- `RESERVED`
- `USED`
- `EXPIRED`
- `DISCARDED`

## 2.4. Blood Unit Movements

**Purpose:** Records the history of movements and actions performed on blood units.

| Attribute | Data Type | Constraints | Description |
|---|---|---|---|
| `movement_id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique identifier of the movement. |
| `unit_id` | INTEGER | NOT NULL, FOREIGN KEY | References the blood unit concerned. |
| `movement_type` | TEXT | NOT NULL, CHECK | Type of movement performed. |
| `movement_date` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date and time of the movement. |
| `reason` | TEXT | Optional | Explanation or reason for the movement. |
| `created_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date when the movement was recorded. |
| `destination` | TEXT | Optional | Hospital department or service receiving the blood unit. |

**Foreign Key:**
- `unit_id` REFERENCES `blood_units(unit_id)`.

**Allowed movement types:**
- `USED`
- `DISCARDED`
- `EXPIRED`

The `destination` attribute is optional because a blood unit may be discarded or expired without being sent to a hospital department.

## 2.5. Users

**Purpose:** Stores the accounts of people who are authorized to access the blood bank management system.

| Attribute | Data Type | Constraints | Description |
|---|---|---|---|
| `user_id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique identifier of the user. |
| `full_name` | TEXT | NOT NULL | User's full name. |
| `username` | TEXT | NOT NULL, UNIQUE | Unique username used for login. |
| `password_hash` | TEXT | NOT NULL | Securely hashed user password. |
| `email` | TEXT | NOT NULL, UNIQUE | User's email address. |
| `created_at` | TEXT | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date when the account was created. |

**Security rule:** Passwords must never be stored in plain text. Only secure password hashes should be stored in the database.

---

# 3. Database Relationships

## 3.1. Donors – Donations

**Relationship: One-to-Many (1:N)**

- Each donor can make multiple donations.
- Each donation belongs to exactly one donor.
- A donor may have no donations yet.

**Foreign Key:** `donations.donor_id` → `donors.donor_id`

## 3.2. Blood Units – Blood Unit Movements

**Relationship: One-to-Many (1:N)**

- Each blood unit can have multiple recorded movements over time.
- Each movement belongs to exactly one blood unit.
- A blood unit may have no movements yet.

**Foreign Key:** `blood_unit_movements.unit_id` → `blood_units.unit_id`

## 3.3. Users

Currently, the `users` table has no direct relationship with the other tables.

It is used independently for user authentication.

## 3.4. Donations – Blood Units

There is currently **no direct relationship** between `donations` and `blood_units`.

They are managed independently in the current database design.

---

# 4. Database Relationship Summary

| Relationship | Cardinality | Foreign Key |
|---|---|---|
| Donors → Donations | One-to-Many (1:N) | `donations.donor_id` |
| Blood Units → Blood Unit Movements | One-to-Many (1:N) | `blood_unit_movements.unit_id` |
| Users → Other Tables | No relationship currently | None |
| Donations → Blood Units | No relationship | None |

---

# 5. Business Rules

The following rules define how the database and the application should behave.

## 5.1. Donor Management

1. Each donor must have a unique identifier (`donor_id`).
2. A donor must have a first name, last name, date of birth, sex, address, and phone number.
3. A donor's sex must be either `M` or `F`.
4. A donor's blood type is optional and, when provided, must be one of the eight valid blood types.
5. The `wants_reminder` attribute must be either `0` (No) or `1` (Yes).
6. Each donor can make multiple donations.
7. A donor's personal information is stored separately from their donation history.

## 5.2. Donation Management

1. Each donation must have a unique identifier (`donation_id`).
2. Each donation must belong to an existing donor.
3. A donor can have multiple donation records.
4. Each donation must have a recorded date.
5. Donation records represent donation events, independently of whether the collected blood is eventually accepted or rejected by the laboratory.

## 5.3. Blood Unit Management

1. Each blood unit must have a unique identifier (`unit_id`).
2. Each blood unit must have a valid blood type.
3. Each blood unit must have a collection date and an expiration date.
4. Each blood unit must have a status.
5. A newly registered blood unit has the status `AVAILABLE` by default.
6. Only blood units with the status `AVAILABLE` should be considered available for use.
7. A blood unit's status must be updated when its state changes.
8. Blood units should not be permanently deleted when they are used, expired, or discarded. Their historical records must be preserved.
9. The blood type stored for a blood unit must correspond to the laboratory-confirmed blood type.

## 5.4. Blood Unit Movement Management

1. Each movement must have a unique identifier (`movement_id`).
2. Each movement must refer to an existing blood unit.
3. A blood unit can have multiple movements.
4. Each movement must have a movement type: `USED`, `DISCARDED`, or `EXPIRED`.
5. The destination is optional and should be provided when a blood unit is sent to a hospital department or service.
6. A reason can optionally be recorded to explain the movement.
7. Each movement must have a recorded date.
8. Movement records must be preserved to maintain the history of blood units.

## 5.5. User Management

1. Each system user must have a unique identifier (`user_id`).
2. Each user must have a full name, username, password hash, and email address.
3. Each username must be unique.
4. Each email address must be unique.
5. Passwords must be securely hashed before being stored.
6. Users must authenticate using their credentials before accessing the system.

## 5.6. General Database Rules

1. Every primary key must uniquely identify its corresponding record.
2. Foreign keys must reference existing records.
3. Required attributes must never be NULL.
4. Optional attributes may contain NULL values.
5. Dates should be stored in a consistent ISO format (`YYYY-MM-DD` or `YYYY-MM-DD HH:MM:SS`).
6. Historical records should be preserved whenever possible rather than permanently deleted.

---

# 6. Important Implementation Notes

- SQLite foreign key enforcement must be enabled for every database connection using `PRAGMA foreign_keys = ON;`.
- The application backend must validate business rules that are not enforced directly by SQL constraints.
- When a blood unit is used, discarded, or expires, its status in `blood_units` should remain consistent with the corresponding movement record.
- `created_at` represents when a record was registered in the database, while event dates such as `collection_date` and `donation_date` represent when the actual event occurred.
- The database design may be extended later to include donor screening questionnaires, laboratory test results, user roles, and other features as project requirements become clearer.

# 7. Database Setup

Each developer must create their own local SQLite database using the shared `schema.sql` file.

The database file is not included in the Git repository. This ensures that each developer works with their own local database.

## 7.1. Prerequisites

Install the SQLite command-line tools and make sure `sqlite3` is accessible from the terminal.

You can verify the installation with:

```bash
sqlite3 --version
```

## 7.2. Create the Database

From the root directory of the project, execute:

```bash
sqlite3 database/blood_bank.db < database/schema.sql
```

This command will:

- Create the `blood_bank.db` file inside the `database/` directory if it does not already exist.
- Execute all SQL statements contained in `schema.sql`.
- Create all five database tables.

## 7.3. Verify the Database

Open the database:

```bash
sqlite3 database/blood_bank.db
```

List all tables:

```sql
.tables
```

Expected output:

```text
blood_unit_movements
blood_units
donations
donors
users
```

To inspect the structure of a specific table:

```sql
.schema donors
```

To inspect the complete database schema:

```sql
.schema
```

To exit SQLite:

```sql
.quit
```

## 7.4. Important Notes

- Each developer should generate their own local `blood_bank.db`.
- The `schema.sql` file is the shared source of truth for the database structure.
- If the database structure changes, the updated `schema.sql` must be committed and pushed to the repository.
- Developers who need the updated structure should apply the changes to their local databases.
- The `blood_bank.db` file must not be committed or pushed to GitHub.
- Foreign key enforcement must be enabled for every SQLite connection using:

```sql
PRAGMA foreign_keys = ON;
```