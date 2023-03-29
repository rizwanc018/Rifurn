import productHelper from "../helpers/productHelpers.js";
import categoryHelper from "../helpers/categoryHelper.js";

const productController = {
    showAddProduct: (req, res) => {
        categoryHelper.getAllCategories()
            .then(categories => {
                res.render("admin/addProduct", { isAdmin: req.session.isAdmin || true, categories: categories })
            }).catch(err => {
                console.log(err);
                res.status(400).redirect('/')
            })
    },
    addProduct: (req, res) => {
        productHelper.addProduct(req, res)
            .then(data => {
                res.redirect(`/admin/product/add`)
            }).catch(err => {
                res.redirect('/admin/product/add')
            })
    },
    getAllProducts: (req, res) => {
        productHelper.getAllProducts()
            .then(products => {
                res.render("admin/products", { isAdmin: true, products })
            }).catch(err => {
                console.log(err);
            })
    },
    deleteProduct: (req, res) => {
        productHelper.deleteProduct(req).then(response => {
            res.redirect("/admin/products")
        })
    },
}

export default productController