import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model.js";
import { NewUserRequestBody } from "../types/types.js";
import { globalAsyncErrorHandler } from "../utils/globalAsyncHandler.js";
import { ErrorHandler } from "../utils/utility-classes.js";

const userRegister = globalAsyncErrorHandler(
  async (req: Request<object, object, NewUserRequestBody>, res: Response, next: NextFunction) => {
    const { username, email, image, _id, dob, gender } = req.body;

    if (!username || !email || !image || !dob || !gender || !_id) {
      next(new ErrorHandler("Username, email, image, dob, gender and password are required", 400));
      return;
    }

    let LoginUser = await User.findById({ _id });

    if (LoginUser) {
      return res.status(200).json({
        success: true,
        message: "Welcome back",
      });
    }

    LoginUser = await User.create({
      _id,
      username,
      email,
      image,
      dob: new Date(dob),
      gender,
    });

    if (!LoginUser) {
      next(new ErrorHandler("User not created", 500));
    }

    const createdUser = await User.findById(LoginUser._id).select("-password");

    res.status(201).json({
      success: true,
      user: createdUser?.username,
      message: `User created successfully ${LoginUser.username}`,
    });
  },
);

const getAllUsers = globalAsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();

    if (!users) {
      next(new ErrorHandler("No users found", 500));
    }

    res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      users: users.map(user => {
        return {
          _id: user._id,
          username: user.username,
          email: user.email,
          image: user.image,
          dob: user.dob,
          gender: user.gender,
        };
      }),
    });
  },
);

const getUser = globalAsyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  const user = await User.findById(id);

  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    user,
  });
});

const deleteUser = globalAsyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const user = await User.findById(id);

    if (!user) {
      next(new ErrorHandler("User not found", 404));
    }

    await User.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  },
);

export { getAllUsers, getUser, userRegister, deleteUser };
