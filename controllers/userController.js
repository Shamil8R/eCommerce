const productHelper = require('../helpers/productHelper');
const userHelper = require('../helpers/userHelper');
const categoryHelper = require('../helpers/categoryHelper');
const productModel = require('../models/productModel');
const addressHelper = require('../helpers/addressHelper');

module.exports = {

    // Get User Home
    userHome: async (req, res) => {
        try {
            const featuredProducts = await productHelper.getFeaturedProducts()
            if (req.session.user) {
                const [count, wishlistCount, userData] = await Promise.allSettled([
                    productHelper.getCartProductsCount(req.session.user._id),
                    productHelper.getWishlistProductsCount(req.session.user._id),
                    // userHelper.getUserData(req.session.user._id)
                ]);
                // req.session.user = await userData.value;
                req.session.user.cartCount = count.value;
                req.session.user.wishlistCount = wishlistCount.value;
                // console.log(req.session.user.cartCount);
            }
            res.render('user/userHome', { featuredProducts, user: req.session.user });
        } catch (error) {
            console.log(error);
            res.redirect('/login');
        }
    },


    // Get Signup Page
    getSignup: (req, res) => {
        // console.log(req.session);
        res.render('user/userSignup', { signupErr: req.session.signupErr, errMessage: req.session.errMessage })
        req.session.signupErr = false;
    },

    // Post Signup Page
    userSignup: async (req, res) => {
        try {
            const result = await userHelper.doSignup(req.body);
            if (result.userExists) {
                req.session.signupErr = true;
                req.session.errMessage = result.errMessage;
                res.redirect('/signup');
            } else {
                res.redirect('/login')
            }
        } catch (err) {
            console.log(err)
            res.redirect('/signup')
        }
    },


    // Get Login Page
    login: (req, res) => {
        if (req.session.userLoggedIn) {
            res.redirect('/')
        } else {
            res.render('user/userLogin', { loginErr: req.session.loginErr, errMessage: req.session.loginErrMessage });
            req.session.loginErr = false;
        }

    },
    //Post Login
    userLogin: (req, res) => {
        userHelper.doLogin(req.body).then((result) => {                    //can do it without promise too?
            if (result.status) {
                if (result.userDetails.isBlocked) {
                    req.session.loginErr = true;
                    req.session.loginErrMessage = "You are blocked! Please contact our team."
                    res.redirect('/login')
                } else {
                    req.session.user = result.userDetails
                    req.session.userLoggedIn = true;
                    res.redirect('/');
                }
            } else {
                req.session.loginErr = true;
                req.session.loginErrMessage = result.message;
                res.redirect('/login')
            }
        }).catch((err) => {
            console.log(err);
            res.redirect('/login')
        })
    },

    logout: (req, res) => {
        req.session.user = null;
        req.session.userLoggedIn = false;
        res.redirect('/')
    },

    userDetails: async (req, res) => {
        try {
            const [userData, cartCount, wishlistCount] = await Promise.allSettled([
                userHelper.getUserData(req.session.user._id),
                productHelper.getCartProductsCount(req.session.user._id),
                productHelper.getWishlistProductsCount(req.session.user._id)
            ])
            req.session.user = userData.value;
            req.session.user.wishlistCount = wishlistCount.value,
                req.session.user.cartCount = cartCount.value
            res.render('user/accDetails', { layout: 'user-layout', user: req.session.user })
        } catch (error) {
            console.log(error);
            res.redirect('/')
        }
    },

    editUserData: async (req, res) => {
        try {
            const result = await userHelper.updateUserData(req.body, req.session.user._id);
            if (result.status) {
                res.json({ status: true, result })
            } else {
                res.json({ status: false, result })
            }
        } catch (error) {
            console.log(error);
            res.redirect('/')
        }
    },

    getAddress: async (req, res) => {
        try {
            const addresses = await addressHelper.getAddresses(req.session.user._id);
            res.render('user/address', { addresses, user: req.session.user })
        } catch (error) {
            res.redirect('/')
        }
    },

    getProducts: async (req, res) => {
        try {
            // const products = await productHelper.getAllProducts();
            // const categories = await categoryHelper.getAllCategories();
            const [products, categories] = await Promise.allSettled([
                productHelper.getAllProducts(),
                categoryHelper.getAllCategories(),

            ]);
            if (req.session.user) {
                const [cartCount, wishlistCount] = await Promise.allSettled([
                    productHelper.getCartProductsCount(req.session.user._id),
                    productHelper.getWishlistProductsCount(req.session.user._id)
                ])
                req.session.user.cartCount = cartCount.value;
                req.session.user.wishlistCount = wishlistCount.value;
            }
            // console.log(products);
            // console.log(products[0].img);
            res.render('user/shop', { products: products.value, categories: categories.value, user: req.session.user });
        } catch (err) {
            console.log(err);
            res.redirect('/');
        }
    },

    productsByCategory: async (req, res) => {
        try {
            const [products, categories] = await Promise.allSettled([
                productModel.find({ category: req.params.id }).lean().populate('category'),
                categoryHelper.getAllCategories()
            ]);
            // console.log(products);
            res.render('user/productsByCat', { products: products.value, categories: categories.value, user: req.session.user })
        } catch (error) {
            console.log(error);
            res.redirect('/')
        }
    },

    productDetails: async (req, res) => {
        try {
            const product = await productModel.find({ _id: req.params.id }).lean()
            // console.log(product);
            res.render('user/productDetails', { product, user: req.session.user })
        } catch (error) {
            console.log(error)
            res.redirect('/');
        }
    },

    addProductToCart: async (req, res) => {
        try {
            if (req.session.userLoggedIn) {
                await productHelper.addProductToCart(req.body.productID, req.session.user._id)
                const cartCount = await productHelper.getCartProductsCount(req.session.user._id);
                // console.log(cartCount); Promise.allSettled not possible here
                res.json({ status: true, cartCount: cartCount })
            } else {
                res.json({ status: false, url: '/login' })
            }
        } catch (err) {
            console.log(err);
            res.redirect('/')
        }
    },

    viewCart: async (req, res) => {
        try {
            const [cartData, totalPrice, cartCount, wishlistCount] = await Promise.allSettled([
                productHelper.getCartItems(req.params.id),
                productHelper.getTotalPrice(req.session.user._id),
                productHelper.getCartProductsCount(req.session.user._id),
                productHelper.getWishlistProductsCount(req.session.user._id)
            ]);
            req.session.user.cartCount = cartCount.value;
            req.session.user.wishlistCount = wishlistCount.value;
            // console.log(cartData);
            // console.log(totalPrice.value);
            res.render('user/cart', { cartData: cartData.value, user: req.session.user, price: totalPrice.value })
        } catch (error) {
            console.log(error);
            res.redirect('/')
        }
    },

    changeProductQuantity: async (req, res) => {
        try {
            //Promise.allSettled not possible here because the price is depended on the changeProduct quantity.
            const result = await productHelper.changeProductQuantity(req.body);
            const totalPrice = await productHelper.getTotalPrice(req.session.user._id);
            res.json({ result, price: totalPrice })
        } catch (error) {
            console.log(error)
            res.redirect('/home')
        }
    },

    removeProduct: async (req, res) => {
        try {
            const [result, cartCount] = await Promise.allSettled([
                productHelper.removeProduct(req.body),
                productHelper.getCartProductsCount(req.session.user._id)
            ]);
            res.json({ result: result.value, cartCount: cartCount.value })
        } catch (error) {
            console.log(error);
            res.redirect('/home');
        }
    },

    addToWishlist: async (req, res) => {
        try {
            if (req.session.userLoggedIn) {
                const result = await productHelper.addToWishlist(req.body.productId, req.session.user._id);
                const wishlistCount = await productHelper.getWishlistProductsCount(req.session.user._id);
                res.json({ status: true, success: result.status, wishlistCount: wishlistCount, message: result.message })
            } else {
                res.json({ status: false, url: '/login' })
            }
        } catch (error) {
            console.log(error);
            res.redirect('/')
        }
    },

    getWishlist: async (req, res) => {
        try {
            // const wishlistItems = await productHelper.getWishlistItems(req.session.user._id);
            // const cartCount = await productHelper.getCartProductsCount(req.session.user._id);
            const [wishlistItems, cartCount, wishlistCount] = await Promise.allSettled([
                productHelper.getWishlistItems(req.session.user._id),
                productHelper.getCartProductsCount(req.session.user._id),
                productHelper.getWishlistProductsCount(req.session.user._id)
            ]);
            req.session.user.cartCount = cartCount.value;
            req.session.user.wishlistCount = wishlistCount.value;
            res.render('user/wishlist', { wishlistItems: wishlistItems.value, user: req.session.user });
        } catch (error) {
            console.log(error);
            res.redirect('/')
        }
    },

    removeWishlistProduct: async (req, res) => {
        try {
            const result = await productHelper.removeWishlistProduct(req.body)
            res.json(result)
        } catch (error) {
            console.log(error);
            res.redirect('/')
        }
    },

    checkout: async (req, res) => {
        try {
            const [cartData, totalPrice, cartCount, wishlistCount] = await Promise.allSettled([
                productHelper.getCartItems(req.session.user._id),
                productHelper.getTotalPrice(req.session.user._id),
                productHelper.getCartProductsCount(req.session.user._id),
                productHelper.getWishlistProductsCount(req.session.user._id)
            ]);
            req.session.user.cartCount = cartCount.value;
            req.session.user.wishlistCount = wishlistCount.value;
            // console.log(cartData.value.products);
            res.render('user/checkout', { cartData: cartData.value.products, user: req.session.user, totalPrice: totalPrice.value })
        } catch (error) {
            console.log(error)
        }
    },

    addAddress: async (req, res) => {
        try {
            console.log(req.body);
            const result = await addressHelper.addAddress(req.body, req.session.user._id);
            res.json({ status: result.status, message: result.message })
        } catch (error) {
            console.log(error);
            res.json({ status: false, message: "Sorry for the inconvenience. Please, try again later.", url: '/' })
        }
    },

    editAddress: async (req, res) => {
        try {
            const editAddress = await addressHelper.getOneAddress(req.body)
            res.json({ status: true, editAddress })
        } catch (error) {
            console.log(error);
            res.json({ status: false, message: "Sorry for the inconvenience. Please, try again later.", url: '/' })
        }
    },

    updateAddress: async (req,res) => {
        try {
            await addressHelper.updateAddress(req.body);
            res.json({status: true, message: "Your address have been updated."})
        } catch (error) {
            console.log(error);
            res.json({ status: false, message: "Sorry for the inconvenience. Please, try again later.", url: '/' })
        }
    },

    deleteAddress: async (req,res) => {
        try {
            await addressHelper.deleteAddress(req.body);
            res.json({status: true, message: "Successfully deleted."})
        } catch (error) {
            console.log(error);
            res.json({ status: false, message: "Sorry for the inconvenience. Please, try again later.", url: '/' })
        }
    }

}