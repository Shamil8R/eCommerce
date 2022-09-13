const categoryHelper = require('../helpers/categoryHelper');

module.exports = {

    getAllCategories: async (req, res) => {
        try {
            const categories = await categoryHelper.getAllCategories();
            res.render('admin/Category/viewCategory', { layout: 'admin-layout', categories })
        } catch (error) {
            console.log(error);
            res.redirect('/admin/home')
        }
    },

    addCategory: async (req, res) => {
        try {
            await categoryHelper.addCategory(req.body);
            res.redirect('/admin/category')
        } catch (error) {
            console.log(error)
            res.redirect('/admin/home')
        }
    },

    deleteCategory: async (req, res) => {
        try {
            await categoryHelper.deleteCategory(req.params.id);
            res.redirect('/admin/category')
        } catch (err) {
            console.log(error)
            res.redirect('/admin/home')
        }
    }
}