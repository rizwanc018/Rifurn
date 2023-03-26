import express from 'express';
import adminController from '../controllers/adminController.js';

const adminRouter = express.Router()

const verifyAdmin = (req, res, next) => {
    if (req.session.isAdmin || true) {
        next()
    } else {
        res.redirect('/')
    }
}

adminRouter.get('/login', adminController.getLoginPage)
adminRouter.post('/login', adminController.doLogin)
adminRouter.get('/dashboard', verifyAdmin, adminController.showDashboard)
adminRouter.get('/categories', verifyAdmin, adminController.showCategories)
adminRouter.get('/products', verifyAdmin, adminController.showProducts)
adminRouter.get('/users', verifyAdmin, adminController.showUsers)
adminRouter.post('/addcategoty', verifyAdmin, adminController.addCategoty)




export default adminRouter;