const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../Middlewares/Auth')

router.get('/',ensureAuthenticated,(req, res)=>{
    res.status(200).json([
        {
          name : "Shirts",
          price : "120$"    
        },
        {
          name : "Pants",
          price : "100$"
        }
    ])
})

module.exports = router;