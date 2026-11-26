import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import { env } from './env.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(here, '../..');
const dbFile = path.resolve(backendRoot, env.dbPath);
const schemaFile = path.resolve(backendRoot, '../database/schema.sql');

const db = new Database(dbFile);
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');


db.exec(fs.readFileSync(schemaFile, 'utf8'));

export default db;
