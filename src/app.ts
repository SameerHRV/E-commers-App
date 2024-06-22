import express from "express";
import userRouter from "./routes/user.router.js";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.use("/api/v1/users", userRouter);

export default app;
