import express from 'express';
import guestHelper from '../helpers/guestHelper.js';
import productController from '../controllers/productController.js';

const guestRouter = express.Router()

guestRouter.get('/', guestHelper.getAllProducts)
guestRouter.get('/product/view/:id', productController.getSingleProduct)


export default guestRouter;