const fs = require('fs');
const path = require('path')
const productModel = require('../models/productModel');
const cartModel = require('../models/cartModel');

module.exports = {

    addProduct: (productData, imageData) => {
        return new Promise(async (resolve, reject) => {
            const product = new productModel({
                productName: productData.productName,
                brandName: productData.brandName,
                price: productData.price,
                desc: productData.desc,
                category: productData.category,
                quantity: productData.quantity
            });
            if (imageData) {
                imageData.map(i => {
                    // console.log(i.filename);
                    product.img.push(i.filename);
                });
                try {
                    await product.save()
                    resolve()
                } catch (err) {
                    reject(err)
                }
            }else{
                reject("Please insert images")
            }
        });
    },

    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            try {
                const products = await productModel.find({}).populate('category').lean();
                resolve(products);
            } catch (error) {
                reject(error);
            }

        })
    },

    getOneProduct: (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                const product = await productModel.find({ _id: id }).populate('category').lean();
                // console.log(product[0].img[0]);
                resolve(product);
            } catch (error) {
                reject(error);
            }
        })
    },

    deleteProduct: (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                const product = await productModel.findById({ _id: id }).lean();
                product.img.map(element => {
                    fs.unlink(path.join(__dirname, '..', 'public', 'product-images', element), (err) => {
                        if (err) console.log(err);
                    })
                })
                await productModel.deleteOne({ _id: id })
                resolve();
            } catch (error) {
                reject(error);
            }
        })
    },
    featuredOption: (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                const product = await productModel.findById({ _id: id }).lean()
                if (product.isFeatured) {
                    await productModel.findOneAndUpdate({ _id: id }, { $set: { isFeatured: false } })
                    resolve()
                } else {
                    await productModel.findOneAndUpdate({ _id: id }, { $set: { isFeatured: true } })
                    resolve()
                }
            } catch (error) {
                reject(error)
            }
        })
    },

    getFeaturedProducts: () => {
        return new Promise(async (resolve, reject) => {
            try {
                const featuredProducts = await productModel.find({ isFeatured: true }).lean()
                resolve(featuredProducts)
            } catch (error) {
                reject(error)
            }
        })
    },

    updateProductDetails: (productData, imageData) => {
        return new Promise(async (resolve, reject) => {
            try {
                console.log(productData);
                const result = await productModel.findByIdAndUpdate({ _id: productData.id }, {
                    productName: productData.productName,
                    brandName: productData.brandName,
                    price: productData.price,
                    desc: productData.desc,
                    category: productData.category,
                    quantity: productData.quantity
                })
                console.log(result);
                if(imageData){
                    let images = []
                    imageData.map(i => {
                        images.push(i.filename);
                    })
                    result.img.map(element => {
                        fs.unlink(path.join(__dirname, '..', 'public', 'product-images', element), (err) => {
                            if (err) console.log(err);
                        })
                    })
                    await productModel.findOneAndUpdate({_id: productData.id},{
                        img: images
                    })
                }
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    },

    addProductToCart: (productID,userID) => {
        return new Promise(async (resolve,reject) => {
            const cart = await cartModel.findOne({userId: userID})
            if(cart){

            }else{
                console.log("Creating new Cart");
                const cart = new cartModel({
                    userId: userID,
                    productId: productID,
                });
            }
        })
    }
}