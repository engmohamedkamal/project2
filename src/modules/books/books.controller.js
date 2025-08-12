import express from 'express';
import authentication from '../../middleware/authentication.js';
import { requireAdmin } from '../../middleware/authorization.js';
import validation from '../../middleware/validation.js';
import { bookSchema } from './validation.books.js';
import * as service from './books.service.js';

const router = express.Router();

router.post('/', authentication, requireAdmin, validation(bookSchema), async (req, res, next) => {
  try {
    const book = await service.createBook(req.body);
    res.status(201).json(book);
  } catch (err) { next(err); }
});

router.get('/', authentication, async (req, res, next) => {
  try {
    const result = await service.listBooks(req.query);
    res.json(result);
  } catch (err) { next(err); }
});

router.put('/:id', authentication, requireAdmin, validation(bookSchema), async (req, res, next) => {
  try {
    const book = await service.updateBook(req.params.id, req.body);
    res.json(book);
  } catch (err) { next(err); }
});

router.delete('/:id', authentication, requireAdmin, async (req, res, next) => {
  try {
    await service.deleteBook(req.params.id);
    res.json({ message: 'Book deleted.' });
  } catch (err) { next(err); }
});

export default router;
