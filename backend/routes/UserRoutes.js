const express = require('express');
const router = express.Router();
const {authenticated,authorization} = require('../utils/authorization');
const {createUser,getUserProfile,updateUserProfile,logoutUser,loginUser} = require('../controllers/UserController');

//a get request on /user/signup will call showsignupform function which in turn will render the html or ejs file
router.post('/signup',createUser);
router.get('/profile', authenticated,getUserProfile);
//a get request on /user/login will call showloginform function which in turn will render the html or ejs file

router.post('/login',loginUser);
router.put('/:id', authenticated, authorization('admin','user'), updateUserProfile);
router.get('/logout',authenticated,authorization('user','admin'),logoutUser);


module.exports=router;