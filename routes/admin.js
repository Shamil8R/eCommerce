const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');


const adminController = require('../controllers/adminController');
const categoryHelper = require('../helpers/categoryHelper');
const productHelper = require('../helpers/productHelper');

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


// User
router.get('/user', (req, res) => {
      res.render('admin/viewUsers', { layout: 'admin-layout' })
})


// Products
router.get('/viewProducts', adminController.viewProducts);
router.get('/addProduct', adminController.getAddProducts);
router.post('/addProduct', multipleUpload, adminController.postAddProducts);
router.get('/deleteProducts/:id', adminController.deleteProduct);
router.get('/editProducts/:id', adminController.viewEditProduct);

router.post('/editProducts/:id',multipleUpload,async (req,res) => {
      try {
            req.body.id = req.params.id;
            await productHelper.updateProductDetails(req.body, req.files['product-images']);
            res.redirect('/admin/viewProducts')
      } catch (error) {
            console.log(error)
            res.redirect('/admin/home')
      }
})

router.get('/featuredProduct/:id',async (req,res) => {
      await productHelper.featuredOption(req.params.id)
      res.redirect('/admin/viewProducts')
})








// Categories

router.get('/category',async (req, res) => {
      try {
            const categories = await categoryHelper.getAllCategories();
            res.render('admin/Category/viewCategory', { layout: 'admin-layout', categories })
      } catch (error) {
            console.log(error);
            res.redirect('/admin/home')
      }
})

router.get('/addCategory', (req, res) => {
      res.render('admin/Category/addCategory', { layout: 'admin-layout' });
})

router.post('/addCategory', async (req, res) => {
      try {
            await categoryHelper.addCategory(req.body);
            res.redirect('/admin/category')
      } catch (error) {
            console.log(error)
            res.redirect('/admin/home')
      }
})

// router.get('/productsByCat',(req,res)=>{
//       res.render('')
// })

router.get('/categoryDelete/:id',async (req,res) => {
      try{
            await categoryHelper.deleteCategory(req.params.id);
            res.redirect('/admin/category')
      }catch(err){
            console.log(error)
            res.redirect('/admin/home')
      }
})




router.get('/orders', (req, res) => {
      res.render('admin/viewOrders', { layout: 'admin-layout' })
})

router.get('/logout', ((req, res) => {
      res.redirect('/admin')
}))

module.exports = router;
