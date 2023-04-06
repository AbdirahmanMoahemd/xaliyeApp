import express from "express";
import { admin, protect } from "../middlewares/authMiddleware.js";
import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from "../controllers/categoryControllers.js";


const router = express.Router();



router.route("/").get(getCategories).post(protect, admin, createCategory);


router
  .route("/:id")
  .get(getCategoryById)
  .delete(protect, admin, deleteCategory)
  .put(protect, admin, updateCategory);



export default  router;
