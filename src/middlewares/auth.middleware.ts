import { User } from "../models/user.model.js";
import { globalAsyncErrorHandler } from "../utils/globalAsyncHandler.js";

export const authMiddleware = globalAsyncErrorHandler(async (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    return res.status(401).json({
      success: false,
      message: "User not found Please login",
    });
  }

  const user = await User.findById(id);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not found Please login",
    });
  }

  if (user.role !== "admin") {
    return res.status(401).json({
      success: false,
      message: "You are not authorized to access this resource",
    });
  }

  next();
});
