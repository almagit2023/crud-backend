const express = require('express');
const router = express.Router();
const {signup, login} = require('../Controllers/AuthController')
const {loginValidation, signupValidation} = require('../Middlewares/AuthValidation')

router.post('/login',loginValidation, login)

router.post('/signup',signupValidation,signup)

module.exports = router