import express from 'express'
import { admin, protect } from '../middlewares/authMiddleware.js';
import { addOrderItems, changeOrderStatus, getOrders, getRecentOrders } from '../controllers/ordersControllers.js';


const router = express.Router();



router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route("/change-order-status").put(protect, admin, changeOrderStatus);
router.route("/recent").get(protect, admin, getRecentOrders);

export default router