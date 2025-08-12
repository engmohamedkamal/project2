import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'mongo-sanitize';

import connectDB from '../DB/connectionDB.js';
import usersRouter from './modules/users/users.controller.js';
import booksRouter from './modules/books/books.controller.js';
import transactionsRouter from './modules/transactions/transactions.controller.js';

dotenv.config();
await connectDB();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json())

app.use((req, res, next) => {  req.body = mongoSanitize(req.body);  req.query = mongoSanitize(req.query);  next();});

app.use('/users', usersRouter);
app.use('/books', booksRouter);
app.use('/transactions', transactionsRouter);

app.get('/', (req, res) => res.json({ ok: true, msg: 'Library API' }));

app.use((err, req, res, next) => {  console.error(err);  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
