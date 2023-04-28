export const verifyAdmin = (req, res, next) => {
    if (req.session.isAdmin) {
        next()
    } else {
        res.redirect('/')
    }
}