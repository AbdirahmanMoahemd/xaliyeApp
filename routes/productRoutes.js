import express from "express";
import { deleteProduct, getAllProducts, getProductById, getProductsByName, updateProduct } from "../controllers/productControllers.js";



const router = express.Router();


router.route('/').post(getAllProducts);
router.route('/:id').get(getProductById).post(updateProduct).delete(deleteProduct);
router.route('/:name').post(getProductsByName);



export default  router;




