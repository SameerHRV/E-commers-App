import mongoose from "mongoose";
import { config } from "../configs/config.js";

export const connectDB = async () => {
  try {
    mongoose.connection.on("error", error => {
      console.log("Error While connecting to DB", error);
    });

    mongoose.connection.on("connected", () => {
      console.log("MongoDB Connected Successfully 😁");
    });

    const dbInstance = await mongoose.connect(config.mongoDB.uri as string, {
      dbName: config.mongoDB.databaseName,
    });

    console.log("Connected to DB and Its HOST IS", dbInstance.connection.host);
  } catch (error) {
    console.log(error);
  }
};
