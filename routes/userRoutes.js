import express from 'express';
import { getUserProfileById, login, register } from '../controllers/userControllers.js';
import { protect } from '../middlewares/authMiddleware.js';


const router = express.Router();


router.route('/login').post(login);
router.route('/').post(register);
router.route('/profile/:id').post(protect, getUserProfileById);



export default router

 