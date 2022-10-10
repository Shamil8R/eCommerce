const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');


// const trial=(req,res,next)=>{
//     console.log("working--------------");
//     next()
//   }

const userAuth = (req, res, next) => {
    if (req.session.userLoggedIn && !req.session.user.isBlocked) {
        next();
    } else {
        req.session.user = null;
        req.session.userLoggedIn = false;
        res.redirect('/login')
    }
}


// router.use(trial)

/* User Home Page. */
router.get('/', userController.userHome);

/*User Login Page*/
router.get('/login', userController.login);
router.post('/login', userController.userLogin)
router.get('/logout', userController.logout)


// User Signup Page
router.get('/signup', userController.getSignup);
router.post('/signup', userController.userSignup);
router.post('/otpVerify', userController.otpVerification);

//User Details
router.get('/userDetails',userAuth, userController.userDetails)
router.post('/updateUserDetails', userController.editUserData)
router.get('/address',userAuth, userController.getAddress);
router.post('/addAddress',userController.addAddress);
router.post('/editAddress', userController.editAddress);
router.post('/updateAddress', userController.updateAddress);
router.post('/deleteAddress',userController.deleteAddress);
router.get('/moreDetails/:id', userController.getSingleOrder)
router.get('/viewOrderedProducts/:id', userController.getSingleOrder)

//Products
router.get('/products', userController.getProducts);
router.get('/category/:id', userController.productsByCategory);
router.get('/productDetails/:id', userController.productDetails);


//Cart
router.post('/addToCart', userController.addProductToCart);
router.get('/cart', userController.viewCart);
router.post('/changeProductQuantity', userController.changeProductQuantity);
router.post('/removeProduct', userController.removeProduct);
router.get('/checkout',userAuth, userController.checkout);

//Orders
router.post('/placeOrder', userController.placeOrder);
router.get('/orderPlaced',userAuth,userController.orderPlaced);
router.post('/verifyPayment', userController.verifyPayment);
router.post('/changeOrderStatus', userController.changeOrderStatus);
router.get('/orders',userController.getOrders);


//Coupons
router.post('/applyCoupon',userController.verifyCoupon);

// Wishlist
router.post('/addToWishlist', userController.addToWishlist);
router.get('/wishlist', userAuth, userController.getWishlist);
router.post('/removeWishlistProduct', userController.removeWishlistProduct);


module.exports = router;
