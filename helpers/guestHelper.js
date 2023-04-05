import productHelper from "./productHelpers.js";

const guestHelper = {
    getAllProducts: (req, res) => {
        productHelper.getAllProducts()
            .then(products => {
                res.render("index", {products, isUserLoggedin: req.session.user?.loggedin })
            }).catch(err => {
                console.log(err);
            })
    }
}

export default guestHelper