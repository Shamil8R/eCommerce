const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const adminController = require('../controllers/adminController');
const categoryController = require('../controllers/categoryController');

const storage = multer.diskStorage({
      destination: function (req, file, cb) {
            cb(null, 'public/product-images/')
      },
      filename: function (req, file, cb) {
            const nameOfImage = Math.round(Math.random() * 1E9) + '-' + Date.now() + path.extname(file.originalname)
            cb(null, nameOfImage)
      }
})
const upload = multer({ storage: storage })
const multipleUpload = upload.fields([{ name: 'product-images', maxCount: 4 }])



/*Admin Login. */

router.get('/', adminController.adminLogin)
router.post('/', adminController.checkAdminLogin)     

// GET Admin Home
router.get('/home', adminController.adminHome)

// Products
router.get('/viewProducts', adminController.viewProducts);
router.get('/addProduct', adminController.getAddProducts);
router.post('/addProduct', multipleUpload, adminController.postAddProducts);
router.get('/deleteProducts/:id', adminController.deleteProduct);
router.get('/editProducts/:id', adminController.viewEditProduct);
router.post('/editProducts/:id',multipleUpload,adminController.updateProductDetails);
router.get('/featuredProduct/:id', adminController.featuredProduct);


// User
router.get('/user', adminController.getUsersData)




// Categories
router.get('/category',categoryController.getAllCategories);
router.post('/addCategory',categoryController.addCategory);
router.get('/categoryDelete/:id',categoryController.deleteCategory);


//Orders
router.get('/orders', (req, res) => {
      res.render('admin/viewOrders', { layout: 'admin-layout' })
})

router.get('/logout', ((req, res) => {
      res.redirect('/admin')
}))

module.exports = router;
