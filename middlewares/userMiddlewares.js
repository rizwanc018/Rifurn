export const isUserLoggedin = (req, res, next) => {
    req.session.user = {}
    req.session.user.id = '6437cd8200a3ad42cea10acc'
    req.session.user.loggedin = true
    req.session.user.discount = 2000
    if (req.session.user && req.session.user.loggedin) {
        next()
    } else {
        // res.render('index', {products, showLogin: true})
        res.redirect('/')
    }
}