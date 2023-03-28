const express = require("express");
const router=express.Router();
const { handleLogin } = require("../middlewares/authMiddlewares");
const {checkInHandler, checkOutHandler, breakInHandler, breakOutHander, addcommentControllers} = require("../controllers/activityController");


router.get("/check-in", handleLogin, checkInHandler);
router.get("/check-out", handleLogin, checkOutHandler);
router.get("/break-in", handleLogin, breakInHandler);
router.get("/break-out", handleLogin, breakOutHander);
router.post("/add-comment", handleLogin, addcommentControllers);


module.exports = router;