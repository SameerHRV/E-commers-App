import { Request } from "express";
import { rm } from "fs";
import { Product } from "../models/product.model.js";
import { NewProductRequestBody } from "../types/types.js";
import { globalAsyncErrorHandler } from "../utils/globalAsyncHandler.js";
import { ErrorHandler } from "../utils/utility-classes.js";

const newProduct = globalAsyncErrorHandler(
  async (req: Request<object, object, NewProductRequestBody>, res, next) => {
    const { name, category, price, stock } = req.body;
    const image = req.file;

    if (!name || !category || !price || !stock) {
      if (image) {
        rm(image.path, (err: any) => {
          console.log("File deleted");
        });
      }

      next(new ErrorHandler("Name, category, price and stock are required", 400));
      return;
    }

    if (!image) {
      next(new ErrorHandler("Please upload an image", 400));
      return;
    }

    const product = await Product.create({
      name,
      category: category.toLowerCase(),
      price,
      stock,
      image: image.path,
    });

    res.status(201).json({
      success: true,
      product,
      message: "Product created successfully",
    });
  },
);

const latestProduct = globalAsyncErrorHandler(async (req: Request, res, next) => {
  const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);

  if (!products) {
    next(new ErrorHandler("No products found", 500));
  }

  res.status(200).json({
    success: true,
    message: "Latest products fetched successfully",
    products,
  });
});

const getAllCategories = globalAsyncErrorHandler(async (req, res, next) => {
  const categories = await Product.distinct("category");

  if (!categories) {
    next(new ErrorHandler("No categories found", 500));
  }

  res.status(200).json({
    success: true,
    message: "All categories fetched successfully",
    categories,
  });
});

const getAdminProducts = globalAsyncErrorHandler(async (req, res, next) => {
  const products = await Product.find({});
  if (!products) {
    next(new ErrorHandler("No products found", 500));
  }

  res.status(200).json({
    success: true,
    message: "All products fetched successfully",
    products,
  });
});

const getSingleProduct = globalAsyncErrorHandler(async (req, res, next) => {
  const products = await Product.findById(req.params.id);
  if (!products) {
    next(new ErrorHandler("No products found", 500));
  }

  res.status(200).json({
    success: true,
    message: "All products fetched successfully",
    products,
  });
});
const updateProduct = globalAsyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category, price, stock } = req.body;
  const image = req.file;
  const productID = await Product.findById(id);

  if (!productID) {
    next(new ErrorHandler("invalid product id", 400));
  }

  if (image) {
    rm(productID.image, (err: any) => {
      console.log("old image deleted");
    });
    productID.image = image.path;
  }

  if (name) {
    productID.name = name;
  }

  if (category) {
    productID.category = category.toLowerCase();
  }

  if (price) {
    productID.price = price;
  }

  if (stock) {
    productID.stock = stock;
  }

  await productID.save();

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product: productID,
  });
});

const deletedProduct = globalAsyncErrorHandler(async (req, res, next) => {
  const products = await Product.findById(req.params.id);
  if (!products) {
    next(new ErrorHandler("No products found", 500));
  }

  rm(products.image as string, (err: any) => {
    console.log("old image deleted");
  });

  await Product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    products,
  });
});

export {
  deletedProduct,
  getAdminProducts,
  getAllCategories,
  getSingleProduct,
  latestProduct,
  newProduct,
  updateProduct,
};
