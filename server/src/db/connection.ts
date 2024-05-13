import { connect, disconnect } from "mongoose";

async function connectToMongoDB() {
  try {
    await connect(process.env.MONGODB_URL);
  } catch (error) {
    console.log("error:", error);
    throw new Error("Error connecting to MongoDB");
  }
}

async function disconnectToMongoDB() {
  try {
    await disconnect();
  } catch (error) {
    console.log("error:", error);
    throw new Error("Error disconnecting from MongoDB");
  }
}

export { connectToMongoDB, disconnectToMongoDB };
