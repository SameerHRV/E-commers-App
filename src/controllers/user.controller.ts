import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model.js";

const userRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email } = req.body;

    const newUser = await User.create({
      username,
      email,
    });

    res.status(201).json({
      success: true,
      user: newUser,
      message: `User created successfully ${newUser.username}`,
    });
  } catch (error) {}
};

export { userRegister };
