import productHelper from "./productHelpers.js";
import categoryHelper from "./categoryHelper.js"
import productModel from "../models/productModel.js";

const guestHelper = {
    showHomePage: (req, res) => {
        productHelper.getAllProducts()
            .then(products => {
                if (req.session.user?.loggedin) {
                    res.render("index", { products, isUserLoggedin: req.session.user.loggedin })

                } else {
                    res.render("index", { products, showLogin: true })
                }
            }).catch(err => {
                console.log(err);
            })
    },
    showShop: async (req, res) => {
        // const categories = await categoryHelper.getAllCategories()
        const categories = await productHelper.getCategoriesAndCountOfProducts()
        productHelper.getAllProducts()
            .then(products => {
                res.render("shop", { products, categories, isUserLoggedin: req.session.user?.loggedin })
            }).catch(err => {
                console.log(err);
            })
    },
    showProductsByCategory: async (req, res) => {
        const categories = await productHelper.getCategoriesAndCountOfProducts()
        const products = await productHelper.getAllProductsByCategory(req)
        res.render("shop", { products, categories, isUserLoggedin: req.session.user?.loggedin })
    },
    getProductsBySearch: async (req, res) => {
        const searchWord = '^' + req.query.q
        const result = await productModel.find({ productName: { $regex: new RegExp(searchWord, "i") } })
            .populate('category');
        console.log("🚀 ~ file: guestHelper.js:37 ~ getProductsBySearch: ~ result:", result)
        res.status(200).send(result)
    }
}

export default guestHelper