export const isUserLoggedin = (req, res, next) => {
    // req.session.user = {}
    // req.session.user.id = "642ffea86ea921b9d50ba3cb"
    // req.session.user.loggedin = true
    if (req.session.user && req.session.user.loggedin) {
        next()
    } else {
        res.redirect('/')
    }
}