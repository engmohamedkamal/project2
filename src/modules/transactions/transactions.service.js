import Transaction from '../../../DB/models/transaction.models.js';
import Book from '../../../DB/models/book.models.js';

export const borrowBook = async (userId, { bookId }) => {
  const book = await Book.findById(bookId);
  if (!book) throw { status: 404, message: 'Book not found.' };
  if (book.availableCopies < 1) throw { status: 400, message: 'No copies available.' };
  const tx = new Transaction({ userId, bookId: book._id, status: 'borrowed' });
  await tx.save();
  book.availableCopies -= 1;
  await book.save();
  return tx;
};

export const returnBook = async (txId) => {
  const tx = await Transaction.findById(txId);
  if (!tx) throw { status: 404, message: 'Transaction not found.' };
  if (tx.status === 'returned') throw { status: 400, message: 'Already returned.' };
  tx.status = 'returned';
  tx.returnDate = new Date();
  await tx.save();
  const book = await Book.findById(tx.bookId);
  if (book) {
    book.availableCopies += 1;
    await book.save();
  }
  return tx;
};

export const userTransactions = async (userId) => {
  return Transaction.find({ userId }).populate('bookId');
};

export const allTransactions = async ({ status, sort = 'borrowDate', page = 1, limit = 20 }) => {
  const filter = {};
  if (status) filter.status = status;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const data = await Transaction.find(filter).populate('bookId').populate('userId').sort({ [sort]: -1 }).skip(skip).limit(parseInt(limit));
  const total = await Transaction.countDocuments(filter);
  return { total, page: parseInt(page), limit: parseInt(limit), data };
};
