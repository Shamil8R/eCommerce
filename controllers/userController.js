const productHelper = require('../helpers/productHelper');
const userHelper = require('../helpers/userHelper');

module.exports = {

    // Get User Home
    userHome: async (req, res) => {
        const featuredProducts = await productHelper.getFeaturedProducts()
        res.render('user/userHome', {featuredProducts, login: req.session.loggedIn});
    },


     // Get Signup Page
     getSignup: (req, res) => {
        console.log(req.session);
        res.render('user/userSignup',{signupErr: req.session.signupErr, errMessage: req.session.errMessage})
        req.session.signupErr = false;
    },

    // Post Signup Page
    userSignup: async (req, res) => {
        try { 
            const result = await userHelper.doSignup(req.body);
            if(result.userExists){
                req.session.signupErr = true;
                req.session.errMessage = result.errMessage;
                res.redirect('/signup');
            }else{
                res.redirect('/login')
            }
        }catch(err){
            console.log(err)
            res.redirect('/signup')
        }
    },


    // Get Login Page
    login: (req, res) => {
        res.render('user/userLogin',{loginErr: req.session.loginErr, errMessage: req.session.loginErrMessage});
    },
    //Post Login
    userLogin: (req, res) => {
        userHelper.doLogin(req.body).then((result) => {                    //can do it without promise too?
            if (result.status) {
                req.session.loggedIn = true;
                res.redirect('/');
            } else {
                req.session.loginErr = true;
                req.session.loginErrMessage= result.message;
                res.redirect('/login')
            }
        }).catch((err)=>{
            console.log(err);
        })
    },



   
}