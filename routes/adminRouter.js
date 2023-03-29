import express from 'express';
import adminController from '../controllers/adminController.js';
import categoryController from '../controllers/categoryController.js';
import productController from '../controllers/productController.js';
import upload from "../utils/multer.js";

const adminRouter = express.Router()

const verifyAdmin = (req, res, next) => {
    if (req.session.isAdmin || true) {
        next()
    } else {
        res.redirect('/')
    }
}

// const verifyLogin = (req, res, next) => {
//     if (req.session.userloggedIn) {
//         next()
//     } else {
//         res.redirect('/login')
//     }
// }


adminRouter.get('/login', adminController.getLoginPage)
adminRouter.post('/login', adminController.doLogin)
adminRouter.get('/dashboard', verifyAdmin, adminController.showDashboard)

adminRouter.get('/products', verifyAdmin, productController.getAllProducts)
adminRouter.get('/product/add', verifyAdmin, productController.showAddProduct)
adminRouter.post('/product/add',verifyAdmin,  upload.array("image", 3), productController.addProduct)
adminRouter.get(`/product/edit/:id`, productController.getProductEditPage)
adminRouter.put(`/product/edit/:id`, upload.array("image", 3), productController.editProduct)
adminRouter.get(`/product/delete/:id`, productController.deleteProduct)
adminRouter.get('/product/image/delete/:id', productController.deleteImage )

adminRouter.get('/users', verifyAdmin, adminController.showUsers)

adminRouter.get('/categories',verifyAdmin, categoryController.showCategories)
adminRouter.post('/addcategoty', verifyAdmin, categoryController.addCategoty)
adminRouter.get('/category/delete/:id', verifyAdmin, categoryController.deleteCategory)
adminRouter.put('/category/edit/:id',categoryController.editCategory)





export default adminRouter;