import express from 'express';
import authentication from '../../middleware/authentication.js';
import validation from '../../middleware/validation.js';
import { borrowSchema } from './validation.transactions.js';
import * as service from './transactions.service.js';
import { requireAdminOrOwner, requireAdmin } from '../../middleware/authorization.js';
import Transaction from '../../../DB/models/transaction.models.js';

const router = express.Router();

router.post('/borrow', authentication, validation(borrowSchema), async (req, res, next) => {
  try {
    const tx = await service.borrowBook(req.user.id, req.body);
    res.status(201).json(tx);
  } catch (err) { next(err); }
});

const getTxOwner = async (req) => {
  const tx = await Transaction.findById(req.params.id);
  if (!tx) throw { status: 404, message: 'Transaction not found.' };
  return tx.userId;
};

router.put('/return/:id', authentication, requireAdminOrOwner(getTxOwner), async (req, res, next) => {
  try {
    const tx = await service.returnBook(req.params.id);
    res.json(tx);
  } catch (err) { next(err); }
});

router.get('/user', authentication, async (req, res, next) => {
  try {
    const data = await service.userTransactions(req.user.id);
    res.json(data);
  } catch (err) { next(err); }
});

router.get('/all', authentication, requireAdmin, async (req, res, next) => {
  try {
    const data = await service.allTransactions(req.query);
    res.json(data);
  } catch (err) { next(err); }
});

export default router;
