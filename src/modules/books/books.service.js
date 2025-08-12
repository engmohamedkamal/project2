import Book from '../../../DB/models/book.models.js';

export const createBook = async (data) => {
  const book = new Book(data);
  await book.save();
  return book;
};

export const listBooks = async ({ search, sortBy, page = 1, limit = 10 }) => {
  const filter = {};
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { author: { $regex: search, $options: 'i' } }
    ];
  }
  let query = Book.find(filter);
  if (sortBy === 'title') query = query.sort({ title: 1 });
  if (sortBy === 'publishedYear') query = query.sort({ publishedYear: -1 });
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Book.countDocuments(filter);
  const data = await query.skip(skip).limit(parseInt(limit));
  return { total, page: parseInt(page), limit: parseInt(limit), data };
};

export const updateBook = async (id, data) => {
  const book = await Book.findByIdAndUpdate(id, data, { new: true });
  if (!book) throw { status: 404, message: 'Book not found.' };
  return book;
};

export const deleteBook = async (id) => {
  const book = await Book.findByIdAndDelete(id);
  if (!book) throw { status: 404, message: 'Book not found.' };
  return;
};
