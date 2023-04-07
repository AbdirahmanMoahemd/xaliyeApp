import express from "express";
import { deleteProduct, getAllProducts, getProductById, getProductsByName, updateProduct } from "../controllers/productControllers.js";



const router = express.Router();


router.route('/').get(getAllProducts);
router.route('/:id').get(getProductById).post(updateProduct).delete(deleteProduct);
router.route('/:name').get(getProductsByName);



export default  router;




