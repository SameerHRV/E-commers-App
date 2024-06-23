import { Request } from "express";
import { rm } from "fs";
import { myCache } from "../app.js";
import { Product } from "../models/product.model.js";
import { BaseQuery, NewProductRequestBody, SearchRequestQuery } from "../types/types.js";
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
  let product;
  const id = req.params.id;
  if (myCache.has(`product-${id}`)) product = JSON.parse(myCache.get(`product-${id}`) as string);
  else {
    product = await Product.findById(id);

    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    myCache.set(`product-${id}`, JSON.stringify(product));
  }

  return res.status(200).json({
    success: true,
    product,
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

const getAllProducts = globalAsyncErrorHandler(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, sort, category, price } = req.query;

    const page = Number(req.query.page) || 1;
    // 1,2,3,4,5,6,7,8
    // 9,10,11,12,13,14,15,16
    // 17,18,19,20,21,22,23,24
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;

    const baseQuery: BaseQuery = {};

    if (search)
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };

    if (price)
      baseQuery.price = {
        $lte: Number(price),
      };

    if (category) baseQuery.category = category;

    const productsPromise = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const [products, filteredOnlyProduct] = await Promise.all([
      productsPromise,
      Product.find(baseQuery),
    ]);

    const totalPage = Math.ceil(filteredOnlyProduct.length / limit);

    return res.status(200).json({
      success: true,
      products,
      totalPage,
    });
  },
);

// const generateRandomProducts = async (count: number = 10) => {
//   const products = [];

//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       image: "public\\assets\\8f09a19a-ad8a-403b-bdba-11af2a21a9e9.jpg",
//       price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//       stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       __v: 0,
//     };

//     products.push(product);
//   }

//   await Product.create(products);

//   console.log({ succecss: true });
// };

// // generateRandomProducts(40);

// const deleteRandomsProducts = async (count: number = 10) => {
//   const products = await Product.find({}).skip(2);

//   for (let i = 0; i < products.length; i++) {
//     const product = products[i];
//     await product.deleteOne();
//   }

//   console.log({ succecss: true });
// };

// deleteRandomsProducts(40);

export {
  deletedProduct,
  getAdminProducts,
  getAllCategories,
  getAllProducts,
  getSingleProduct,
  latestProduct,
  newProduct,
  updateProduct,
};
