import express from 'express';
import adminController from '../controllers/adminController.js';
import upload from "../utils/multer.js";

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

adminRouter.get('/products', verifyAdmin, adminController.getAllProducts)
adminRouter.get('/product/add', verifyAdmin, adminController.showAddProduct)
adminRouter.post('/product/add',verifyAdmin,  upload.array("image", 3), adminController.addProduct)
adminRouter.get(`/product/delete/:id`, adminController.deleteProduct)

adminRouter.get('/users', verifyAdmin, adminController.showUsers)

adminRouter.get('/categories',verifyAdmin, adminController.showCategories)
adminRouter.post('/addcategoty', verifyAdmin, adminController.addCategoty)
adminRouter.get('/category/delete/:id', verifyAdmin, adminController.deleteCategory)
adminRouter.put('/category/edit/:id',adminController.editCategory)





export default adminRouter;