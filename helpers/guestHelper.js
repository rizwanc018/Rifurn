import productHelper from "./productHelpers.js";

const guestHelper = {
    getAllProducts: (req, res) => {
        productHelper.getAllProducts()
            .then(products => {
                res.render("index", {products })
            }).catch(err => {
                console.log(err);
            })
    }
}

export default guestHelper