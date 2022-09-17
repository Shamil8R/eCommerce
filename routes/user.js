const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');


// const trial=(req,res,next)=>{
//     console.log("working--------------");
//     next()
//   }

const userAuth = (req, res, next) => {
    if (req.session.userLoggedIn) {
        next();
    } else {
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

//User Details
router.get('/userDetails', userController.userDetails);

//Products
router.get('/products', userController.getProducts);
router.get('/category/:id', userController.productsByCategory);
router.get('/productDetails/:id', userController.productDetails);
router.post('/addToCart', userController.addProductToCart);
router.get('/cart/:id', userController.viewCart);
router.post('/changeProductQuantity', userController.changeProductQuantity);
router.post('/removeProduct', userController.removeProduct);
router.get('/checkout', userController.checkout);
router.get('/addToWishlist/:id', userController.addToWishlist);
router.get('/wishlist', userAuth, userController.getWishlist);
router.post('/removeWishlistProduct', userController.removeWishlistProduct);

module.exports = router;
