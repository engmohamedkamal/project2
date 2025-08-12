import express from 'express';
import validation from '../../middleware/validation.js';
import authentication from '../../middleware/authentication.js';
import { registerSchema, loginSchema } from './validation.user.js';
import * as service from './users.service.js';

const router = express.Router();

router.post('/register', validation(registerSchema), async (req, res, next) => {
  try {
    const user = await service.createUser(req.body);
    res.status(201).json(user);
  } catch (err) { next(err); }
});

router.post('/login', validation(loginSchema), async (req, res, next) => {
  try {
    const token = await service.loginUser(req.body);
    res.json(token);
  } catch (err) { next(err); }
});

router.get('/profile', authentication, async (req, res, next) => {
  try {
    const user = await service.getUserProfile(req.user.id);
    res.json(user);
  } catch (err) { next(err); }
});

export default router;
