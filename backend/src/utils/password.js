import bcrypt from 'bcryptjs';

const ROUNDS = 12;

export const hashPassword = (plain) => bcrypt.hash(plain, ROUNDS);
export const comparePassword = (plain, hash) => bcrypt.compare(plain, hash);


const DUMMY_HASH = bcrypt.hashSync('hemocare-timing-dummy', ROUNDS);
export const compareAgainstDummy = (plain) => bcrypt.compare(plain, DUMMY_HASH);
