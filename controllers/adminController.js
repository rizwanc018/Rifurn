import adminHelper from "../helpers/adminHelper.js"


const adminController = {
    getLoginPage: (req, res) => {
        res.render('admin/login')
    },
    doLogin: (req, res) => {
        adminHelper.doLogin(req, res)
            .then(data => { 
                res.render('admin/dashboard')
            }).catch(data => {
                res.redirect('/')
            })
    }
}

export default adminController