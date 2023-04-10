import express from 'express';
import { addToCart, addToWishlist, deleteCart, getUserProfileById, getUsers, getUsersCount, login, register, removeCartItem, removeWishlistItem } from '../controllers/userControllers.js';
import { protect } from '../middlewares/authMiddleware.js';


const router = express.Router();


router.route('/login').post(login);
router.route('/').post(register).get(getUsers);
router.route('/add-to-cart').post(protect, addToCart);
router.route('/profile/:id').post(getUserProfileById);
router.route('/remove-cartitem').delete(protect, removeCartItem);
router.route('/remove-from-cart/:id').delete(protect, deleteCart);
router.route('/add-to-wishlist').post(protect, addToWishlist)
router.route('/remove-wishlistItem').delete(protect, removeWishlistItem)
router.route('/count').get(getUsersCount);




export default router

 