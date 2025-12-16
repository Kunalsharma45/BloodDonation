import mongoose from "mongoose";
import { env } from "./env.js";

const connectdb = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("Database Connected");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export default connectdb;
