import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Allowed origins
const allowedOrigins = process.env.CORS_ORIGINS.split(",").map(o => o.trim());

// CORS middleware
app.use(cors({
  origin: function(origin, callback){
    // Allow server-to-server requests or Postman
    if(!origin) return callback(null, true);
    if(allowedOrigins.includes(origin)){
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"]
}));

// Handle preflight OPTIONS requests for all routes
app.options("*", cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.includes(origin)){
      return callback(null, true);
    }
  },
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"]
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
