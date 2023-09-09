import express from 'express'
import { admin, protect } from '../middlewares/authMiddleware.js';
import { addOrderItems, changeOrderStatus, getMyOrders, getOrders, getOrdersCount, getRecentOrders } from '../controllers/ordersControllers.js';


const router = express.Router();



router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route("/change-order-status").put(protect, admin, changeOrderStatus);
router.route("/recent").get(protect, admin, getRecentOrders);
router.route('/count').get(getOrdersCount);
router.route('/my-orders/:id').get(getMyOrders)


export default router