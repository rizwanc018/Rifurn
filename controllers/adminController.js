import adminHelper from "../helpers/adminHelper.js"

const adminController = {
    getLoginPage: (req, res) => {
        res.render('admin/login')
    },
    doLogin: (req, res) => {
        adminHelper.doLogin(req, res)
            .then(isAdmin => {
                req.session.isAdmin = isAdmin
                res.redirect('/admin/dashboard')
            }).catch(err => {
                res.redirect('/')
            })
    },
    showDashboard: (req, res) => {
        res.render('admin/dashboard', { isAdmin: req.session.isAdmin })
    },
    // showAddProduct: (req, res) => {
    //     adminHelper.getAllCategories()
    //         .then(categories => {
    //             res.render("admin/addProduct", { isAdmin: req.session.isAdmin || true, categories: categories })
    //         }).catch(err => {
    //             console.log(err);
    //             res.status(400).redirect('/')
    //         })
    // },
    // addProduct: (req, res) => {
    //     adminHelper.addProduct(req, res)
    //         .then(data => {
    //             res.redirect(`/admin/product/add`)
    //         }).catch(err => {
    //             res.redirect('/admin/product/add')
    //         })
    // },
    // getAllProducts: (req, res) => {
    //     adminHelper.getAllProducts()
    //     .then(products => {
    //         res.render("admin/products", { isAdmin: true, products })
    //     }).catch(err => {
    //         console.log(err);
    //     })
    // },
    // deleteProduct: (req, res) => {
    //     adminHelper.deleteProduct(req).then(response => {
    //         res.redirect("/admin/products")
    //     })
    // },
    showUsers: (req, res) => {
        res.send("Users")
    }
}

export default adminController