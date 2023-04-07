import express from 'express';
import { addToCart, getUserProfileById, login, register } from '../controllers/userControllers.js';
import { protect } from '../middlewares/authMiddleware.js';


const router = express.Router();


router.route('/login').post(login);
router.route('/').post(register);
router.route('/add-to-cart').post(protect, addToCart);
router.route('/profile/:id').get(getUserProfileById);



export default router

 