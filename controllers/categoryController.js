import categoryHelper from "../helpers/categoryHelper.js"

const categoryController = {
    addCategoty: (req, res) => {
        categoryHelper.addCategory(req, res)
            .then(status => {
                res.status(200).send("Category Created Successfully")
            }).catch(err => {
                res.status(400).send(err)
            })
    },
    deleteCategory: (req, res) => {
        categoryHelper.deleteCategory(req, res).then(() => {
            res.status(200).send("Deleted Successfully")
        }).catch(err => {
            res.status(400).send(err)
        })
    },
    editCategory: (req, res) => {
        categoryHelper.editCategory(req, res).then((status) => {
            res.status(200).send(status.acknowledged)
        }).catch(err => {
            res.status(400).send(err)
        })
    },
    showCategories: (req, res) => {
        categoryHelper.getAllCategories()
            .then(data => {
                res.render("admin/categories", { isAdmin: req.session.isAdmin, categories: data })
            }).catch(err => {
                console.log(err);
                res.status(400).redirect('/')
            })
    },
}

export default categoryController