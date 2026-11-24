import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const databasePath = process.env.DB_PATH
    ? path.resolve(process.env.DB_PATH)
    : path.resolve(process.cwd(), "../database/hemocare.db");

const schemaPath = path.resolve(
    process.cwd(),
    "../database/schema.sql"
);

const databaseDirectory = path.dirname(databasePath);

if (!fs.existsSync(databaseDirectory)) {
    fs.mkdirSync(databaseDirectory, { recursive: true });
}

const db = new Database(databasePath);

db.pragma("foreign_keys = ON");

if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, "utf-8");
    db.exec(schema);
}

export default db;
