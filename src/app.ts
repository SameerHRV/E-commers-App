import express from "express";
import userRouter from "./routes/user.router.js";
import morgan from "morgan";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import productRouter from "./routes/product.route.js";
const app = express();

app.use(morgan("dev"));

app.use(
  express.json({
    limit: "50mb",
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use("/public/assets", express.static("public/assets"));

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);

app.use(globalErrorHandler);
export default app;
