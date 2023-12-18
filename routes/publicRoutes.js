import { Router } from "express";
import LeadModel from "../models/leadsM.js";

const router = Router();

router.post("/add-lead", async (req, res) => {
    try {
        const { leadName, email, contactNo, message } = req.body;

        // Check if any required fields are missing
        if (!leadName || !email || !contactNo || !message) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Create a new instance of LeadModel
        const newLead = new LeadModel({
            name: leadName,
            email: email,
            contactNo: contactNo,
            message: message
        });

        // Save the new lead to the database
        await newLead.save();

        // Return a success response
        return res.status(201).json({ message: "Lead submitted successfully." });

    } catch (error) {
        console.error("Error submitting lead:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
});

export default router;
