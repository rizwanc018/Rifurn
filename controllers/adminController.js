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
        // res.render('admin/dashboard', {isAdmin: req.session.isAdmin})
        res.render('admin/dashboard', { isAdmin: true })
    },
    addCategoty: (req, res) => {
        adminHelper.addCategory(req,res)
        .then(status => {
            res.status(200).send("Category Created Successfully")
        }).catch(err => {
            res.status(400).send(err)
        })
    },
    showCategories: (req, res) => {
        // res.render("admin/categories", {isAdmin: req.session.isAdmin})
        adminHelper.getAllCategories()
        .then(data => {
            res.render("admin/categories", { isAdmin: true, categories: data })
        }).catch(err => {
            console.log(err);
            res.status(400).redirect('/')
        })
    },
    showProducts: (req, res) => {
        res.send("products")
    },
    showUsers: (req, res) => {
        res.send("Users")
    }
}

export default adminController