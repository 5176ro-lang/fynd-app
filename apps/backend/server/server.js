import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import listingsRouter from './routes/listings.js';
import swapsRouter from './routes/swaps.js';
import usersRouter from './routes/users.js';
import reviewsRouter from './routes/reviews.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api/reviews', reviewsRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Loop API is running' });
});

app.use('/api/listings', listingsRouter);
app.use('/api/swaps', swapsRouter);
app.use('/api/users', usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Loop API listening on http://localhost:${PORT}`);
});