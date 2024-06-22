import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model.js";
import { NewUserRequestBody } from "../types/types.js";
import { ErrorHandler } from "../utils/utility-classes.js";
import { globalAsyncErrorHandler } from "../utils/globalAsyncHandler.js";

const userRegister = globalAsyncErrorHandler(
  async (req: Request<object, object, NewUserRequestBody>, res: Response, next: NextFunction) => {
    const { username, email, image, _id, dob, gender, password } = req.body;

    if (!username || !email || !image || !dob || !gender || !password) {
      next(new ErrorHandler("Username, email, image, dob, gender and password are required", 400));
      return;
    }

    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (user) {
      next(new ErrorHandler("User already exists", 400));
      return;
    }

    const newUser = await User.create({
      _id,
      username,
      email,
      password,
      image,
      dob: new Date(dob),
      gender,
    });

    if (!newUser) {
      next(new ErrorHandler("User not created", 500));
    }

    const createdUser = await User.findById(newUser._id).select("-password");

    res.status(201).json({
      success: true,
      user: createdUser?.username,
      message: `User created successfully ${newUser.username}`,
    });
  },
);

export { userRegister };
