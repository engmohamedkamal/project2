import User from '../../../DB/models/user.models.js';
import { hash, compare } from '../../utils/encrypt/index.js';
import { signToken } from '../../utils/token/index.js';

export const createUser = async ({ email, password, name, role }) => {
  const existing = await User.findOne({ email });
  if (existing) throw { status: 400, message: 'Email already registered.' };
  const hashed = await hash(password);
  const user = new User({ email, password: hashed, name, role });
  await user.save();
  const u = user.toObject();
  delete u.password;
  return u;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw { status: 400, message: 'Invalid credentials.' };
  const ok = await compare(password, user.password);
  if (!ok) throw { status: 400, message: 'Invalid credentials.' };
  const token = signToken({ id: user._id, role: user.role });
  return { token };
};

export const getUserProfile = async (id) => {
  const user = await User.findById(id).select('-password');
  if (!user) throw { status: 404, message: 'User not found.' };
  return user;
};
