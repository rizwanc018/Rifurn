import express from 'express';
import guestHelper from '../helpers/guestHelper.js';
import productController from '../controllers/productController.js';

const guestRouter = express.Router()

guestRouter.get('/', guestHelper.showHomePage)
guestRouter.get('/shop', guestHelper.showShop)
guestRouter.get('/shop/category/:id', guestHelper.showProductsByCategory)
guestRouter.get('/product/view/:id', productController.getSingleProduct)


export default guestRouter;