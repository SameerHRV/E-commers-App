import mongoose, { Schema } from "mongoose";
import validator from "validator";

interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  isModified(path: string): boolean;
  image: string;
  role: "admin" | "user";
  gender: "male" | "female";
  dob: Date;
  cretedAt: Date;
  updatedAt: Date;
  // virtuals attribute
  age: number;
}

const userSchema = new Schema(
  {
    _id: {
      type: String,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
      validate: validator.default.isEmail,
    },
    image: {
      type: String,
      required: [true, "Please upload an image"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["male", "female"],
    },
    dob: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
  },
  { timestamps: true },
);
userSchema.virtual("age").get(function () {
  const today = new Date();
  const dob = this.dob;
  let age = today.getFullYear() - dob.getFullYear();

  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  ) {
    age--;
  }

  return age;
});

export const User = mongoose.model<IUser>("User", userSchema);
