const categoryModel = require("../models/categoryModel")
const productModel = require("../models/productModel")
const categoryHelper = require("./categoryHelper")

module.exports = {

    sudoAdminLoginCheck: (data) => {
        return new Promise((resolve,reject)=>{
            if(data.email === process.env.SUDO_ADMIN_EMAIL){
                if(data.password === process.env.SUDO_ADMIN_PASSWORD){
                    resolve({status: true})
                }else{
                    resolve({status: false})
                }
            }else{
                resolve({status: false})
            }       
        })
    },

    getAllCategoryNames: () => {
        return new Promise(async (resolve,reject) => {
            try {
                const categoryNames = await categoryModel.find({},{name:1}).lean();
                resolve(categoryNames);
            } catch (error) {
                reject();
            }
        })
    },

    getProductsCountByCategory: (categoryNames) => {
        return new Promise(async (resolve,reject) => {
            const obj = {
                categories: [],
                productCount: []
            }
            try {
                for(let i=0; i<categoryNames.length; i++){
                    const id = categoryNames[i]._id;
                    const count = await productModel.count({category:id});
                    obj.categories.push(categoryNames[i].name);
                    obj.productCount.push(count)
                }
                resolve(obj);
            } catch (error) {
                reject();
            }
        })
    },
}