import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductsByName,
  getProductsCount,
  updateProduct,
} from "../controllers/productControllers.js";
import { admin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(getAllProducts).post(protect, admin, createProduct).put(protect, admin, updateProduct);
router
  .route("/:id")
  .get(getProductById)
  .delete(protect, admin, deleteProduct);
router.route("/search/:name").get(getProductsByName);
router.route('/count/product').get(getProductsCount);


export default router;
