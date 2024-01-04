import mongoose from "mongoose";

const designSchema = mongoose.Schema({
    title: String,
    image: {
        filename: String,
        filepath: String,
    },
    description: String
}, { timestamps: true });

// You can create a model using this schema
const DesignModel = mongoose.model("Design", designSchema);

export default DesignModel;
