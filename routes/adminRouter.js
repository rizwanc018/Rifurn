import express from 'express';
import adminController from '../controllers/adminController.js';

const adminRouter = express.Router()

adminRouter.get('/login', adminController.getLoginPage)
adminRouter.post('/login', adminController.doLogin)

export default adminRouter;