export const verifyAdmin = (req, res, next) => {
    req.session.isAdmin = true
    if (req.session.isAdmin) {
        next()
    } else {
        res.redirect('/')
    }
}