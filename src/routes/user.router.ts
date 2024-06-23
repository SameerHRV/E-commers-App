import { Router } from "express";
import { deleteUser, getAllUsers, getUser, userRegister } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post("/register", userRegister);

// Login user route
userRouter.get("/getAllUsers", authMiddleware, getAllUsers);
userRouter.get("/:id", getUser);
userRouter.route("/:id").get(getUser).delete(authMiddleware, deleteUser);

export default userRouter;
