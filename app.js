import express from 'express';
import 'dotenv/config'
import connectDB from "./config/db.js"
import authRoutes from './routes/authRoutes.js'

const app = express()
connectDB();
const PORT = 5000

app.get("/", (req, res)=>{res.send("API helllo")})
app.use("/auth", authRoutes);

app.listen(PORT, ()=>{console.log("API server LISTENING !!")})
