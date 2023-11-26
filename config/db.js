import mongoose from "mongoose";


const key = "1zrS4lZtglCGzCaa"
const URI = `mongodb+srv://savchangasires:${key}@cluster0.9cy9m6q.mongodb.net/?retryWrites=true&w=majority`


const connectDB = async () => {
    const USER = process.env.DB_USER;
    const KEY = process.env.DB_KEY;
  // Use environment variable for connection URI
//   const URI = `mongodb+srv://savchangasires:1zrS4lZtglCGzCaa@cluster0.9cy9m6q.mongodb.net/?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(URI);
    console.log("Connected to MongoDB database");
  } catch (error) {
    console.error("Failed to connect to MongoDB database:", error);
  }
};

export default connectDB;