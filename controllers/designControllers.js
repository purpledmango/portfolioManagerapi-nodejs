import DesignModel from '../models/designM.js'; // Import your Design model

export const addDesign = async (req, res) => {
    try {
        const { title, description } = req.body;
        const image = req.file;

        console.log({ title, description, image });
        console.log("Filename", image.originalname);

        // Create a new design instance using the Design model
        const newDesign = new DesignModel({
            title,
            image: {
                filename: image.filename,
                filepath: image.path // Set the actual file path or URL
            },
            description,
        });

        // Save the new design instance to the database
        const savedDesign = await newDesign.save();

        // Respond with the saved design data
        res.status(201).json(savedDesign);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getDesign = async (req, res) => {
    try {
        const { designId } = req.params
        const requestedDesign = await DesignModel.findById(designId)

        if (!requestedDesign) {
            res.status(404).json({ message: "Unable to find the design you are looking for" })
        }

        res.status(200).json({ message: "Design Fetched Successfully!", data: requestedDesign._doc })

    } catch (error) {

    }
}
export const updateDesign = async (req, res) => {
    try {
        const { title, description } = req.body;
        const image = req.file;
        const { designId } = req.params; // Extract designId from request parameters

        // Check if the requested design exists
        const requestedDesign = await DesignModel.findById(designId);

        if (!requestedDesign) {
            return res.status(404).json({ message: "Unable to find the design you are looking for" });
        }

        // Update the design fields with new data
        requestedDesign.title = title || requestedDesign.title;
        requestedDesign.description = description || requestedDesign.description;
        requestedDesign.image = {
            filename: image.filename || requestedDesign.image.filename,
            filepath: image.path,
        };

        // Save the updated design
        const updatedDesign = await requestedDesign.save();

        return res.status(200).json({ message: "Design Updated Successfully!", data: updatedDesign._doc });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const deleteDesign = async (req, res) => {
    try {
        const { designId } = req.params; // Extract designId from request parameters

        // Use findByIdAndDelete to find and delete the design by its ID
        const deletedDesign = await DesignModel.findByIdAndDelete(designId);

        if (!deletedDesign) {
            return res.status(404).json({ message: "Unable to find the design you want to delete" });
        }

        return res.status(200).json({ message: "Design Deleted Successfully!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
