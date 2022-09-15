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
            } else {
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
                // console.log(productData);
                const result = await productModel.findByIdAndUpdate({ _id: productData.id }, {
                    productName: productData.productName,
                    brandName: productData.brandName,
                    price: productData.price,
                    desc: productData.desc,
                    category: productData.category,
                    quantity: productData.quantity
                })
                // console.log(result);
                // console.log(imageData);
                if (imageData) {
                    console.log("reached here");
                    let images = []
                    imageData.map(i => {
                        images.push(i.filename);
                    })
                    result.img.map(element => {
                        fs.unlink(path.join(__dirname, '..', 'public', 'product-images', element), (err) => {
                            if (err) console.log(err);
                        })
                    })
                    await productModel.findOneAndUpdate({ _id: productData.id }, {
                        img: images
                    })
                }
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    },

    addProductToCart: (productID, userID) => {
        return new Promise(async (resolve, reject) => {
            try {
                const cart = await cartModel.findOne({ userId: userID }).lean()
                if (cart) {
                    let productExist = cart.products.findIndex(i => i.product == productID)
                    console.log(productExist);
                    if (productExist !== -1) {
                        await cartModel.updateOne({ userId: userID, "products.product": productID },
                            {
                                $inc: { "products.$.quantity": 1 }
                            })
                        // console.log(product);    
                    } else {
                        await cartModel.findOneAndUpdate({ userId: userID },
                            {
                                $push: { products: { product: productID } }
                            })
                    }
                    resolve();
                } else {
                    const cart = new cartModel({
                        userId: userID,
                        products: { product: productID }
                    });
                    await cart.save();
                    resolve();
                }
            } catch (error) {
                reject(error)
            }
        })
    },

    getCartItems: (userID) => {
        return new Promise(async (resolve, reject) => {
            try {
                const cartData = await cartModel.findOne({ userId: userID }).populate({ path: 'products.product' }).lean()
                resolve(cartData);
            } catch (error) {
                reject(error);
            }
        })
    },

    getCartProductsCount: (userID) => {
        return new Promise(async (resolve, reject) => {
            try {
                const cartItems = await cartModel.findOne({ userId: userID });
                if (cartItems) {
                    resolve(cartItems.products.length);
                } else {
                    resolve(cartItems)
                }
                console.log(cartItems.products.length);
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    },

    changeProductQuantity: (data) => {
        return new Promise(async (resolve, reject) => {
            // console.log(data.count);
            // console.log(count);
            try {
                const count = parseInt(data.count)
                if (count == -1 && data.quantity == 1) {
                    const result = await cartModel.updateOne({ "products._id": data.product },
                        {
                            $pull: { products: { _id: data.product } }
                        })
                    resolve({ removeProduct: true })
                    console.log(result);
                } else {
                    await cartModel.findOneAndUpdate({ "products._id": data.product },
                        {
                            $inc: { "products.$.quantity": count }
                        })
                    resolve(true);
                }
            } catch (error) {
                reject(error)
            }
        })
    },

    removeProduct: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                await cartModel.updateOne({ "products._id": data.prodObjId },
                    {
                        $pull: { "products": { _id: data.prodObjId } }
                    })
                resolve(true);
            } catch (error) {
                reject(error)
            }
        })
    },

    getTotalPrice: (userID) => {
        return new Promise(async (resolve, reject) => {
            try {
                const cartData = await cartModel.findOne({ userId: userID }).populate({ path: 'products.product' })
                const totalPrice = cartData.products.reduce((total,curr) => {
                    total = total + (curr.product.price * curr.quantity); 
                    return total;
                },0)
                // console.log(totalPrice);
                resolve(totalPrice)
            } catch (error) {
                reject(error);
            }
        })
    }
}