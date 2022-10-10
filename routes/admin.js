const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const categoryController = require('../controllers/categoryController');
const imgUpload = require('../config/multer');


const adminAuth = (req,res,next) => {
      if(req.session.adminLoggedIn){
            next();
      }else{
            res.redirect('/admin')
      }
}



/*Admin Login. */
router.get('/', adminController.adminLogin)
router.post('/', adminController.checkAdminLogin)     
router.get('/logout', adminController.logout)


// GET Admin Home
router.get('/home',adminAuth, adminController.adminHome)
router.get('/revenue',adminController.revenue)
router.get('/productsByCat',adminController.productsByCategoryGraph)
router.get('/paymentCount',adminController.paymentCount)


// Products
router.get('/viewProducts',adminAuth, adminController.viewProducts);
router.get('/addProduct',adminAuth, adminController.getAddProducts);
router.post('/addProduct',adminAuth, imgUpload.multipleUpload, adminController.postAddProducts);
router.get('/deleteProducts/:id',adminAuth, adminController.deleteProduct);
router.get('/editProducts/:id',adminAuth, adminController.viewEditProduct);
router.post('/editProducts/:id',adminAuth,imgUpload.multipleUpload,adminController.updateProductDetails);
router.get('/featuredProduct/:id',adminAuth, adminController.featuredProduct);


// User
router.get('/user',adminAuth, adminController.getUsersData)
router.get('/changeUserStatus/:id',adminAuth,adminController.changeStatus)




// Categories
router.get('/category',adminAuth, categoryController.getAllCategories);
router.post('/addCategory', adminAuth, categoryController.addCategory);
router.get('/categoryDelete/:id',adminAuth, categoryController.deleteCategory);


//Orders
router.get('/orders', adminAuth, adminController.viewOrders);
router.get('/viewProducts/:id',adminAuth, adminController.getOrderedProducts);
router.post('/changeDeliveryStatus',adminController.changeDeliveryStatus);
router.post('/changeOrderStatus',adminController.changeOrderedProductStatus);


// Coupons
router.get('/coupons',adminAuth,adminController.getCoupons)
      .post('/coupons',adminController.addCoupon);
router.get('/deleteCoupon/:id',adminController.deleteCoupon);

router.use((req,res,next) => {
      next(createError(404))
})

router.use((err,req,res,next) => {
      console.log("admin error route handler");
      res.status(err.status || 500);
      res.render('admin/adminError', {layout: 'layout'})
})

module.exports = router;
