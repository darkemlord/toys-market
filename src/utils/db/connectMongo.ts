import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_DB;

const connectMongo = async () => mongoose.connect(MONGO_URI as string);

export default connectMongo;
