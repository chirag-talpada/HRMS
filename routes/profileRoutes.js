const profileController = require("../controllers/profileController");
const express = require("express");
const router=express.Router();


router.get('/',profileController);

module.exports = router;