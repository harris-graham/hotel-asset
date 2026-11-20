import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import router from "./routes/index.js";
import db from "./config/Database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Test DB connection
try {
  await db.authenticate();
  console.log("Database connected successfully to db_material...");
} catch (error) {
  console.error("Database connection error:", error.message);
}

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  credentials: true,
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // permissive for local dev
    }
  }
}));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Hotel Asset Backend API'
  });
});

app.use(router);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => console.log(`Hotel Asset Server is running on port ${PORT}`));

export default app;
