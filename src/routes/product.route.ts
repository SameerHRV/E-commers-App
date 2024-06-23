import { Router } from "express";
import {
  deletedProduct,
  getAdminProducts,
  getAllCategories,
  getSingleProduct,
  latestProduct,
  newProduct,
  getAllProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import { uploadImage } from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const productRouter = Router();

productRouter.post("/newProduct", authMiddleware, uploadImage, newProduct);
productRouter.get("/latestProduct", latestProduct);
productRouter.get("/category", getAllCategories);

productRouter.get("/admin-products", authMiddleware, getAdminProducts);

productRouter
  .route("/:id")
  .get(getSingleProduct)
  .put(authMiddleware, uploadImage, updateProduct)
  .delete(authMiddleware, deletedProduct);

productRouter.get("/all", getAllProducts);
export default productRouter;
