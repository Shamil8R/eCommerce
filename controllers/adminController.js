const adminHelper = require('../helpers/adminHelper');
const categoryHelper = require('../helpers/categoryHelper');
const orderHelper = require('../helpers/orderHelper');
const productHelper = require('../helpers/productHelper');
const userHelper = require('../helpers/userHelper');
const couponHelper = require('../helpers/couponHelper');

module.exports = {

    // Get Login Page
    adminLogin: (req, res) => {
        if (req.session.adminLoggedIn) {
            res.redirect('/admin/home')
        } else {
            res.render('admin/login', { layout: 'layout' })
        }
    },

    checkAdminLogin: async (req, res) => {
        try {
            const result = await adminHelper.sudoAdminLoginCheck(req.body)
            if (result.status) {
                req.session.adminLoggedIn = true;
                res.redirect('/admin/home');
            } else {
                res.redirect('/admin')
            }
        } catch (err) {
            console.log(err)
            next(err);
        }
    },

    logout: (req, res) => {
        req.session.adminLoggedIn = false;
        res.redirect('/admin');
    },

    // Get Admin Home Page
    adminHome: (req, res) => {
        res.render('admin/adminHome', { layout: 'admin-layout' })
    },

    // View Products
    viewProducts: async (req, res,next) => {
        try {
            const products = await productHelper.getAllProducts();
            res.render('admin/viewProducts', { layout: 'admin-layout', products: products })
        } catch (error) {
            console.log(error)
            next(error);
        }
    },

    getAddProducts: async (req, res,next) => {
        try {
            const categories = await categoryHelper.getAllCategories();
            res.render('admin/addProduct', { layout: 'admin-layout', categories })
        } catch (error) {
            console.log(error)
            next(error);
        }
    },

    postAddProducts: async (req, res,next) => {
        try {
            await productHelper.addProduct(req.body, req.files['product-images'])
            res.redirect('/admin/viewProducts')
        } catch (err) {
            console.log(err)
            next(err);
        }
    },

    deleteProduct: async (req, res,next) => {
        try {
            await productHelper.deleteProduct(req.params.id);
            res.redirect('/admin/viewProducts');
        } catch (error) {
            console.log(error)
            next(error);
        }
    },

    viewEditProduct: async (req, res,next) => {
        try {
            const product = await productHelper.getOneProduct(req.params.id);
            const categories = await categoryHelper.getAllCategories();
            for (let i = 0; i < categories.length; i++) {
                if (product[0].category.name === categories[i].name) {
                    categories[i].flag = true
                }
            }
            const images = product[0].img;
            res.render('admin/editProducts', { layout: 'admin-layout', product, images, categories })
        } catch (error) {
            console.log(error)
            next(error);
        }
    },

    updateProductDetails: async (req, res,next) => {
        try {
            req.body.id = req.params.id;
            console.log(req.files);
            await productHelper.updateProductDetails(req.body, req.files['product-images']);
            res.redirect('/admin/viewProducts')
        } catch (error) {
            console.log(error)
            next(error);
        }
    },

    featuredProduct: async (req, res,next) => {
        try {
            await productHelper.featuredOption(req.params.id)
            res.redirect('/admin/viewProducts')
        } catch (error) {
            console.log(error)
            next(error);
        }
    },



    getUsersData: async (req, res,next) => {
        try {
            const userData = await userHelper.getAllUserData();
            res.render('admin/viewUsers', { layout: 'admin-layout', userData })
        } catch (error) {
            console.log(error)
            next(error);
        }
    },

    changeStatus: async (req, res, next) => {
        try {
            await userHelper.changeStatus(req.params.id)
            res.redirect('/admin/user')
        } catch (error) {
            console.log(error)
            next(error);
        }
    },

    viewOrders: async (req, res, next) => {
        try {
            const orders = await orderHelper.getAllOrders();
            res.render('admin/viewOrders', { layout: 'admin-layout', orders })
        } catch (error) {
            console.log("reached spot 1");
            console.log(error)
            next(error);
        }
    },

    getOrderedProducts: async (req,res,next) => {
        try {
            const orders = await orderHelper.getOrderDetails(req.params.id);
            res.render('admin/moreDetails', {layout: 'admin-layout', orders})
        } catch (error) {
            console.log(error);
            console.log("catch");
            next(error);
        }
    },

    changeDeliveryStatus: async (req,res,next) => {
        try {
            await orderHelper.changeDeliveryStatus(req.body.orderId)
            res.json(true);
        } catch (error) {
            console.log(error);
            next(error)
        }
    },

    changeOrderedProductStatus: async (req,res,next) => {
        try {
            await orderHelper.changeOrderStatusUser(req.body.orderedProductId, req.body.status);
            res.json({status: true})
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    getCoupons: async (req,res,next) => {
        try {
            await couponHelper.addCoupons(req.body);
        } catch (error) {
            console.log(error)
        }
    }
}