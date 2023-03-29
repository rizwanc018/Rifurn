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
    addCategoty: (req, res) => {
        adminHelper.addCategory(req, res)
            .then(status => {
                res.status(200).send("Category Created Successfully")
            }).catch(err => {
                res.status(400).send(err)
            })
    },
    deleteCategory: (req, res) => {
        adminHelper.deleteCategory(req, res).then(() => {
            res.status(200).redirect('/admin/categories')
        }).catch(err => {
            res.redirect('/')
        })
    },
    editCategory: (req, res) => {
        adminHelper.editCategory(req, res).then((status) => {
            res.status(200).send(status.acknowledged)
        }).catch(err => {
            res.redirect('/')
        })
    },
    showCategories: (req, res) => {
        adminHelper.getAllCategories()
            .then(data => {
                res.render("admin/categories", { isAdmin: req.session.isAdmin, categories: data })
            }).catch(err => {
                console.log(err);
                res.status(400).redirect('/')
            })
    },
    showAddProduct: (req, res) => {
        adminHelper.getAllCategories()
            .then(categories => {
                res.render("admin/addProduct", { isAdmin: true, categories: categories })
            }).catch(err => {
                console.log(err);
                res.status(400).redirect('/')
            })
    },
    addProduct: (req, res) => {
        adminHelper.addProduct(req, res)
            .then(data => {
                res.redirect(`/admin/product/add`)
            }).catch(err => {
                res.redirect('/admin/product/add')
            })
    },
    showProducts: (req, res) => {
        res.render("admin/products", { isAdmin: true })
    },
    showUsers: (req, res) => {
        res.send("Users")
    }
}

export default adminController