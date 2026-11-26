import db from '../config/db.js';
import { env } from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import { signToken } from '../utils/jwt.js';
import { comparePassword, compareAgainstDummy, hashPassword } from '../utils/password.js';


const USER_TABLE = 'users';
const COLS = {
  id: 'user_id',
  email: 'email',
  username: 'username',
  fullName: 'fullname',
  passwordHash: 'hashedpassword',
};

const PUBLIC_FIELDS = `${COLS.id} AS id, ${COLS.email} AS email, ${COLS.username} AS username, ${COLS.fullName} AS fullName`;

const toPublicUser = ({ id, email, username, fullName }) => ({ id, email, username, fullName });

export async function login({ email, password, rememberMe }) {
  const row = db
    .prepare(
      `SELECT ${PUBLIC_FIELDS}, ${COLS.passwordHash} AS passwordHash
       FROM ${USER_TABLE} WHERE ${COLS.email} = ? COLLATE NOCASE`
    )
    .get(email);

  let ok = false;
  if (row) {
    ok = await comparePassword(password, row.passwordHash);
  } else {
    await compareAgainstDummy(password);
  }

  if (!ok) throw new ApiError(401, 'Invalid email or password');

  const expiresIn = rememberMe ? env.jwtRememberExpiresIn : env.jwtExpiresIn;
  return { token: signToken(row.id, expiresIn), expiresIn, user: toPublicUser(row) };
}

export function getUserById(id) {
  const row = db.prepare(`SELECT ${PUBLIC_FIELDS} FROM ${USER_TABLE} WHERE ${COLS.id} = ?`).get(id);
  return row ? toPublicUser(row) : null;
}

// Creates a login account (there is no register route yet).
// Run once from the backend/ folder to create your first user:
//   node --input-type=module -e "import('./src/services/auth.service.js').then(m => m.createUser({ email: process.env.U_EMAIL, username: process.env.U_NAME, fullName: process.env.U_FULL, password: process.env.U_PASS }))"
export async function createUser({ email, username, fullName, password }) {
  if (!email || !username || !fullName || !password) throw new Error('All fields are required');
  if (password.length < 10 || password.length > 72) {
    throw new Error('Password must be 10 to 72 characters');
  }
  db.prepare(
    `INSERT INTO ${USER_TABLE} (${COLS.email}, ${COLS.username}, ${COLS.fullName}, ${COLS.passwordHash})
     VALUES (?, ?, ?, ?)`
  ).run(email.trim().toLowerCase(), username.trim(), fullName.trim(), await hashPassword(password));
  console.log(`User created: ${email}`);
}
