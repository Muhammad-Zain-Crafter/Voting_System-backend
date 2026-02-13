import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  process.env.CORS_ORIGIN, // Netlify URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman, server requests

      if (!allowedOrigins.includes(origin)) {
        return callback(new Error('Not allowed by CORS'));
      }

      callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('API is working');
});

import userRoute from './routes/user.route.js';
import candidateRoute from './routes/candidate.route.js';
import votingStatusRoute from './routes/votingStatus.route.js';

app.use('/api/v1/users', userRoute);
app.use('/api/v1/candidates', candidateRoute);
app.use('/api/v1/voting-status', votingStatusRoute);

export default app;
