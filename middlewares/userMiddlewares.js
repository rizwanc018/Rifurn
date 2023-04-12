export const isUserLoggedin = (req, res, next) => {
    req.session.user = {}
    req.session.user.loggedin = true
    req.session.user.id = '642ffea86ea921b9d50ba3cb'
    if (req.session.user && req.session.user.loggedin) {
        next()
    } else {
        // res.render('index', {products, showLogin: true})
        res.redirect('/')
    }
}