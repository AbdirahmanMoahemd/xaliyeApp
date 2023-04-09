import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductsByName,
  updateProduct,
} from "../controllers/productControllers.js";
import { admin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(getAllProducts).post(protect, admin, createProduct);
router
  .route("/:id")
  .get(getProductById)
  .post(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);
router.route("/search/:name").get(getProductsByName);

export default router;
