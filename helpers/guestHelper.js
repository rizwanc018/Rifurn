import productHelper from "./productHelpers.js";
import categoryHelper from "./categoryHelper.js"
import productModel from "../models/productModel.js";

const guestHelper = {
    showHomePage: (req, res) => {
        productHelper.getAllProducts()
            .then(products => {
                if(req.session.user?.loggedin) {
                    res.render("index", { products, isUserLoggedin: req.session.user.loggedin})

                } else {
                    res.render("index", { products, showLogin: true})
                }
            }).catch(err => {
                console.log(err);
            })
    },
    showShop: async (req, res) => {
        const categories = await categoryHelper.getAllCategories()
        // console.log("🚀 ~ file: guestHelper.js:16 ~ showShop: ~ categories:", categories)
        // const obj = {}
        // for(const c of categories) {
        //     let count = await productModel.count({category: c._id})
        //     obj[c.category] = c
        //     obj[c.category].count = count
        //     console.log("🚀 ~ file: guestHelper.js:22 ~ showShop: ~ obj[c.category]:", obj[c.category])
        // }
        // console.log("🚀 ~ file: guestHelper.js:18 ~ showShop: ~ obj:", obj)
        // productHelper.getAllProducts()
        // .then(products => {
        //     res.render("shop", { products, categories : obj, isUserLoggedin: req.session.user?.loggedin })
        // }).catch(err => {
        //     console.log(err);
        // })
        
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