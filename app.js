import express from 'express';
import session from 'express-session';
import cors from 'cors'
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import authRoutes from './routes/authRoutes.js'
import LeadRoutes from "./routes/publicRoutes.js"
import UserModel from './models/userM.js';
import LeadModel from './models/leadsM.js';


dotenv.config()
const app = express()
connectDB();
const PORT = process.env.PORT || 3000


// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({

    secret: "dasdaddsad",
    saveUninitialized: false,
    resave: false,


}))
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.get("/", (req, res) => { res.send("API helllo") })
app.use("/auth", authRoutes);
app.post('/front-end/submit-lead', async (req, res) => {
    try {
        const leadData = req.body;

        // Assuming LeadModel has a method to create a new lead, replace with your actual method
        const newLead = await LeadModel.create(leadData);

        // You can send a response back to the client if needed
        res.status(201).json({ message: 'Lead submitted successfully', lead: newLead });
    } catch (error) {
        console.error('Error submitting lead:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => { console.log("API server LISTENING !! PORT", PORT) })
