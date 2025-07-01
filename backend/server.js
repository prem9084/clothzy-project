import express from 'express';
import "dotenv/config"
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './db/db.js';
import authRoute from "./routes/auth.route.js"
import productRoute from "./routes/produt.route.js"
import cookieParser from 'cookie-parser';
const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173','https://clothzytech.netlify.app'], // or your frontend origin
  credentials: true,               // 🔥 Allow credentials (cookies)
}));
app.use(cookieParser())
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

// routes

app.use("/api/v1/auth",authRoute)
app.use("/api/v1/products", productRoute);

// authentication middleware


app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  connectDB()
})