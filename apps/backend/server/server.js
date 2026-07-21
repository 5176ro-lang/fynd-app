import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import listingsRouter from './routes/listings.js';
import swapsRouter from './routes/swaps.js';
import usersRouter from './routes/users.js';
import reviewsRouter from './routes/reviews.js';
import authRouter from './routes/auth.js';
import path from 'path';
import { fileURLToPath } from 'url';
import uploadsRouter from './routes/uploads.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Fynd API is running' });
});

app.use('/api/uploads', uploadsRouter);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/listings', listingsRouter);
app.use('/api/swaps', swapsRouter);
app.use('/api/users', usersRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/auth', authRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Fynd API listening on http://localhost:${PORT}`);
});