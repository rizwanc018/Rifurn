import adminHelper from "../helpers/adminHelper.js"

const adminController = {
    getLoginPage: (req, res) => {
        if (req.session.isAdmin) res.redirect('/admin/dashboard')
        else res.render('admin/login')
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
    doLogOut: (req, res) => {
        req.session.isAdmin = null
        res.redirect('/')
    }
}

export default adminController