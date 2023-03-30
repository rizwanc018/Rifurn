import express from 'express';
import guestHelper from '../helpers/guestHelper.js';

const guestRouter = express.Router()

guestRouter.get('/', guestHelper.getAllProducts)
guestRouter.get('/single', (req, res) => {
    res.render('singleProduct')
})


export default guestRouter;