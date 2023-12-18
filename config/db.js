import mongoose from "mongoose";

const connectDB = async () => {

  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Connected to MongoDB database");
  } catch (error) {
    console.error("Failed to connect to MongoDB database:", error);
  }
};

export default connectDB;