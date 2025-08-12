import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  publishedYear: { type: Number, required: true },
  availableCopies: { type: Number, required: true, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Book', bookSchema);
