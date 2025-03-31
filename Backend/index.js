import express from "express";
const app=express();
import cors from "cors";

// const pool = require('./db/config');
import cookieParser from "cookie-parser";
import pool from './db/config.js';// Import database connection
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import userRoute from './routes/userRoute.js'
import linkRoute from './routes/linkRoute.js'
import categoryRoute from './routes/categoryRoute.js'

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    cors({
      origin: "http://localhost:5173", // ✅ Allow frontend URL
      credentials: true, // ✅ Allow cookies
    })
  );
app.use(express.json());
app.use("/api/user",userRoute);
app.use("/api/link",linkRoute);
app.use("/api/category",categoryRoute);





  






app.listen(3000,()=>{
    console.log("connected successfully");
});