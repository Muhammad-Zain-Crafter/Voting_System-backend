import mongoose from "mongoose";

const db_name = "voting_system";
const db_connect = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${db_name}`
    );
    console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("error connecting to MongoDB", error);
    process.exit(1);
  }
};
export default db_connect;
