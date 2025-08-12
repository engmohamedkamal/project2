import bcrypt from 'bcrypt';
export const compare = (plain, hashed) => bcrypt.compare(plain, hashed);
