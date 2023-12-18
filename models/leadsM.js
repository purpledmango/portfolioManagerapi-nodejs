import { Schema, model } from "mongoose";

const leadScheama = Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    contactNo: { type: String, required: true },
    message: { type: String, required: true },

})

const LeadModel = model("lead", leadScheama)

export default LeadModel;