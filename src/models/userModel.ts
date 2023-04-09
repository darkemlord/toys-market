import { Schema, model, models } from "mongoose";

export enum UserRole {
  Admin = "admin",
  User = "user",
}

export interface IUserDocument extends Document {
  username: string;
  password: string;
  email: string;
  role: UserRole;
  id: string;
}

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = models.User || model("User", userSchema);

export default User;
