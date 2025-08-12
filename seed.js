import dotenv from 'dotenv';
import connectDB from './DB/connectionDB.js';
import User from './DB/models/user.models.js';
import Book from './DB/models/book.models.js';
import { hash } from './src/utils/encrypt/index.js';

dotenv.config();

const seed = async () => {
  await connectDB();
  const adminEmail = 'admin@library.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hashed = await hash('admin123');
    const admin = new User({ email: adminEmail, password: hashed, name: 'Admin User', role: 'admin' });
    await admin.save();
    console.log('Admin created: admin@library.com / admin123');
  } else {
    console.log('Admin exists');
  }

  const count = await Book.countDocuments();
  if (count === 0) {
    await Book.insertMany([
      { title: 'Clean Code', author: 'Robert C. Martin', publishedYear: 2008, availableCopies: 3 },
      { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', publishedYear: 1999, availableCopies: 2 },
      { title: 'You Don\'t Know JS', author: 'Kyle Simpson', publishedYear: 2015, availableCopies: 5 }
    ]);
    console.log('Sample books inserted');
  } else {
    console.log('Books already present');
  }
  process.exit(0);
};

seed();
