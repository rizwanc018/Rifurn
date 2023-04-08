export const isUserLoggedin = (req, res, next) => {
    req.session.user = {}
    req.session.user.loggedin = true
    if (req.session.user && req.session.user.loggedin) {
        next()
    } else {
        res.redirect('/')
    }
}