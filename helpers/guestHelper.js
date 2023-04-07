import productHelper from "./productHelpers.js";
import categoryHelper from "./categoryHelper.js"
import productModel from "../models/productModel.js";

const guestHelper = {
    showHomePage: (req, res) => {
        productHelper.getAllProducts()
            .then(products => {
                res.render("index", { products, isUserLoggedin: req.session.user?.loggedin })
            }).catch(err => {
                console.log(err);
            })
    },
    showShop: async (req, res) => {
        const categories = await categoryHelper.getAllCategories()
        productHelper.getAllProducts()
            .then(products => {
                res.render("shop", { products, categories, isUserLoggedin: req.session.user?.loggedin })
            }).catch(err => {
                console.log(err);
            })
    },
    showProductsByCategory: async (req, res) => {
        const categories = await categoryHelper.getAllCategories()
        const products = await productHelper.getAllProductsByCategory(req)
        res.render("shop", { products, categories, isUserLoggedin: req.session.user?.loggedin })
    }
}

export default guestHelper