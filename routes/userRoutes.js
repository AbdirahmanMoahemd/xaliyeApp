import express from 'express';
import { addToCart, deleteCart, getUserProfileById, login, register, removeCartItem } from '../controllers/userControllers.js';
import { protect } from '../middlewares/authMiddleware.js';


const router = express.Router();


router.route('/login').post(login);
router.route('/').post(register);
router.route('/add-to-cart').post(protect, addToCart);
router.route('/profile/:id').post(getUserProfileById);
router.route('/remove-cartitem').delete(protect, removeCartItem);
router.route('/remove-from-cart/:id').delete(protect, deleteCart);



export default router

 