import bcrypt from 'bcrypt';
export const hash = (plain) => bcrypt.hash(plain, 10);
