import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config(); // load env variables

const app = express();

// Parse allowed origins from env
const allowedOrigins = process.env.CORS_ORIGINS.split(",");

// CORS setup
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow Postman or server-side requests
    if(allowedOrigins.includes(origin)){
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Body parsers
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ limit: "50kb", extended: true }));
app.use(cookieParser());

// Test route
app.get('/', (req, res) => {
  res.send("API is working");
});

// Routes
import userRoute from './routes/user.route.js';
import candidateRoute from './routes/candidate.route.js';
import votingStatusRoute from './routes/votingStatus.route.js';

app.use("/api/v1/users", userRoute);
app.use("/api/v1/candidates", candidateRoute);
app.use("/api/v1/voting-status", votingStatusRoute);

export default app;
