
import LeadModel from "../models/leadsM.js";


export const addLead = async (req, res) => {
    try {
        // Check if the user is authenticated

        const { name, email, contactNo, message } = req.body;
        console.log(req.body)
        // Validate if required fields are present
        if (!name || !email || !contactNo || !message) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Create a new lead
        const newLead = new LeadModel({
            name,
            email,
            contactNo,
            message
        });

        // Save the lead to the database
        const savedLead = await newLead.save();

        // Return the saved lead details
        return res.status(201).json(savedLead);

    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
};


export const getLeadController = async (req, res) => {
    try {
        const { leadId } = req.params;

        const fetchedLead = await LeadModel.findById(leadId);

        if (fetchedLead && fetchedLead.read !== true) {
            // Update the lead only if read is not already true
            await LeadModel.findByIdAndUpdate(leadId, { $set: { read: true } }, { new: true });

            // Fetch the updated lead
            const updatedLead = await LeadModel.findById(leadId);

            res.status(200).json({
                message: "Lead Fetched",
                data: updatedLead,
            });
        } else {
            res.status(404).json({ message: "Lead not found or already read" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error });
    }
};



export const updateLeadController = async (req, res) => {
    try {
        // Check if the user is authenticated
        if (req.session.user && req.session.user.authenticated) {
            // Assuming your request body contains the lead data and ID
            const { name, email, contactNo } = req.body;

            // Validate if required fields are present
            if (!name || !email || !contactNo) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            // Find the lead by ID
            const existingLead = await LeadModel.findById(_id);

            // Check if the lead exists
            if (!existingLead) {
                return res.status(404).json({ message: "Lead not found" });
            }

            // Update lead information
            existingLead.name = name;
            existingLead.email = email;
            existingLead.contactNo = contactNo;

            // Save the updated lead to the database
            const updatedLead = await existingLead.save();

            // Return the updated lead details
            return res.status(200).json(updatedLead);
        } else {
            return res.status(401).json({ message: "Unauthorized" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
};


export const deleteLeadsController = async (req, res) => {
    try {
        const { leadId } = req.params;

        const deletedUser = await LeadModel.deleteOne({ _id: leadId })

        if (!deletedUser) {
            return res.status(200).json({ message: "Lead deleted successfully" });
        } else {
            return res.status(404).json({ message: "Lead not found" });
        }

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error });
    }
};

export const fetchUnreadLeads = async (req, res) => {
    try {
        const allLeads = await LeadModel.find();

        // Filter leads where read is false
        const allUnreadLeads = allLeads.filter((lead) => lead.read !== true);

        console.log('Number of Unread Leads Found:', allUnreadLeads.length);

        if (allUnreadLeads.length === 0) {
            return res.status(404).json({ message: "No Unread Leads Found" });
        }

        res.status(200).json({ message: "Unread Leads Fetched", data: allUnreadLeads });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const fetchAllLeads = async (req, res) => {
    try {
        const allLeads = await LeadModel.find({})

        if (!allLeads) {
            res.status(404).json({ message: "Error While Fetching Leads" });
        }
        res.status(200).json({ message: "All Leads Fetched", data: allLeads });
    } catch (error) {
        res.status(500).json({ message: "Internal Serer Error", error: error });
    }
}
