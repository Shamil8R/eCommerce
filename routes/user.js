const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const categoryHelper = require('../helpers/categoryHelper');
const productHelper = require('../helpers/productHelper');
const productModel = require('../models/productModel');



/* User Home Page. */
router.get('/', userController.userHome);


/*User Login Page*/
router.get('/login',userController.login);
router.post('/login',userController.userLogin)

router.get('/logout',(req,res)=>{
    res.redirect('/login')
})


// User Signup Page
router.get('/signup', userController.getSignup);
router.post('/signup',userController.userSignup);


router.get('/products', async (req,res) => {
    try {
        const products = await productHelper.getAllProducts();
        const categories = await categoryHelper.getAllCategories();
        // console.log(products);
        // console.log(products[0].img);
        res.render('user/shop', {products, categories});
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
})

router.get('/:id', async (req,res) => {
    try {
        const products = await productModel.find({category: req.params.id}).lean().populate('category')
        const categories = await categoryHelper.getAllCategories();
        // console.log(products);
        res.render('user/productsByCat', {products, categories})
    } catch (error) {
        
    }
})

router.get('/productDetails/:id', async (req,res) => {
    try {
        const product = await productModel.find({_id: req.params.id}).lean()
        console.log(product);
        res.render('user/productDetails', {product})
    } catch (error) {
        console.log(error)
        res.redirect('/home');
    }
})


module.exports = router;
