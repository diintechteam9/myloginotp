const express=require('express');
const router=express.Router();

const {generateOtp}=require('../controllers/otpgeneratorcontroller');

router.post('/generate-otp',generateOtp);

module.exports=router;