import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  borrowDate: { type: Date, required: true, default: Date.now },
  returnDate: { type: Date },
  status: { type: String, required: true, enum: ['borrowed', 'returned'], default: 'borrowed' }
});

export default mongoose.model('Transaction', transactionSchema);
