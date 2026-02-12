import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// Allowed frontend origins
const allowedOrigins = [
  'http://localhost:5173', // local frontend
  'https://jade-melba-56aec3.netlify.app' // deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // allow cookies
}));

app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ limit: '50kb', extended: true }));
app.use(cookieParser());

// test route:
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
