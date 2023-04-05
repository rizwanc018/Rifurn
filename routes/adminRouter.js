import express from 'express';
import adminController from '../controllers/adminController.js';
import categoryController from '../controllers/categoryController.js';
import productController from '../controllers/productController.js';
import userController from '../controllers/userController.js';
import upload from "../utils/multer.js";


const adminRouter = express.Router()

const verifyAdmin = (req, res, next) => {
    if (req.session.isAdmin) {
        next()
    } else {
        res.redirect('/')
    }
}

adminRouter.get('/login', adminController.getLoginPage)
adminRouter.post('/login', adminController.doLogin)
adminRouter.get('/logout', adminController.doLogOut)
adminRouter.get('/dashboard',verifyAdmin, adminController.showDashboard)

adminRouter.get('/products', verifyAdmin, productController.getAllProducts)
adminRouter.get('/product/add', verifyAdmin, productController.showAddProduct)
adminRouter.post('/product/add',verifyAdmin,  upload.array("image", 3), productController.addProduct)
adminRouter.get(`/product/edit/:id`, verifyAdmin, productController.showProductEditPage)
adminRouter.put(`/product/edit/:id`, verifyAdmin, upload.array("image", 3), productController.editProduct)
adminRouter.get(`/product/delete/:id`, verifyAdmin, productController.deleteProduct)
adminRouter.get('/product/image/delete/:id', verifyAdmin, productController.deleteImage )

adminRouter.get('/users', verifyAdmin, userController.getAllUsers)
adminRouter.get('/user/delete/:id', verifyAdmin, userController.deleteUser)
adminRouter.get('/user/restrict/:id', verifyAdmin, userController.toggleUserRestriction)

adminRouter.get('/categories',verifyAdmin, categoryController.showCategories)
adminRouter.post('/addcategoty', verifyAdmin, categoryController.addCategoty)
adminRouter.get('/category/delete/:id', verifyAdmin, categoryController.deleteCategory)
adminRouter.put('/category/edit/:id',categoryController.editCategory)

export default adminRouter;