const categoryModel = require('../models/categoryModel')

module.exports = {

    addCategory: (data) => {
        return new Promise((resolve, reject) => {
            const category = new categoryModel({
                name: data.categoryName
            })
            try {
                category.save()
                resolve('success')
            } catch (error) {
                reject(error)
            }
        })
    },

    getAllCategories: async () => {
        return new Promise( (resolve, reject) => {
            try {
                const categories = categoryModel.find({}).lean()
                resolve(categories)
            } catch (error) {
                reject(error)
            }
        })
    },

    deleteCategory: (id) => {
        return new Promise(async (resolve,reject) => {
            try{
                await categoryModel.deleteOne({_id: id});
                resolve();
            }catch(error){
                reject();
            }
        })
    }
}