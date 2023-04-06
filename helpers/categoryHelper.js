import categoryModel from "../models/categoryModel.js"

const categoryHelper = {
    addCategory: (req, res) => {
        let { category } = req.body
        category = category.charAt(0).toUpperCase() + category.slice(1);
        return new Promise(async (resolve, reject) => {
            if (category) {
                const isExist = await categoryModel.exists({ category: category })
                if (isExist) {
                    reject("Category alredy exist")
                } else {
                    categoryModel.create({ category: category }).then(status => {
                        resolve(status)
                    }).catch(err => {
                        reject(err)
                    })
                }
            } else {
                reject("Category not provided")
            }
        })
    },
    deleteCategory: (req) => {
        return new Promise(async (resolve, reject) => {
            categoryModel.deleteOne({ _id: req.params.id }).then(status => {
                resolve(status)
            }).catch(err => {
                reject(err)
            })
        })
    },
    editCategory: (req) => {
        let { category } = req.body
        category = category.charAt(0).toUpperCase() + category.slice(1);
        return new Promise(async (resolve, reject) => {
            const isExist = await categoryModel.exists({ category: category })
            if (isExist) {
                reject("Category already exist")
            } else {
                categoryModel.updateOne({ _id: req.params.id }, { category: category }).then(status => {
                    resolve(status)
                }).catch(err => {
                    reject(err)
                })
            }
        })
    },
    getAllCategories: () => {
        return new Promise(async (resolve, reject) => {
            categoryModel.find({})
                .then(categories => {
                    resolve(categories)
                }).catch(err => {
                    reject(err)
                })
        })
    }
}

export default categoryHelper