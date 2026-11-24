PRAGMA foreign_keys = ON;


-- 1. DONORS


CREATE TABLE IF NOT EXISTS donors (
    donor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    sex TEXT NOT NULL CHECK (sex IN ('M', 'F')),
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    wants_reminder INTEGER NOT NULL DEFAULT 0
        CHECK (wants_reminder IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    blood_type TEXT CHECK (
        blood_type IN (
            'A+', 'A-', 'B+', 'B-',
            'AB+', 'AB-', 'O+', 'O-'
        )
    )
);


-- 2. DONATIONS


CREATE TABLE IF NOT EXISTS donations (
    donation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    donor_id INTEGER NOT NULL,
    donation_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (donor_id)
        REFERENCES donors(donor_id)
);
