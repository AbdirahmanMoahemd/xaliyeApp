import express from 'express'
import { protect } from '../middlewares/authMiddleware.js';
import { addOrderItems, getOrders } from '../controllers/ordersControllers.js';


const router = express.Router();



router.route('/').post(protect, addOrderItems);



export default router