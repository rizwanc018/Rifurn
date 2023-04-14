export const isUserLoggedin = (req, res, next) => {

    if (req.session.user && req.session.user.loggedin) {
        next()
    } else {
        // res.render('index', {products, showLogin: true})
        res.redirect('/')
    }
}