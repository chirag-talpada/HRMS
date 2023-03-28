const express = require("express");
const router=express.Router();

const {leavesController, addleavesController, getLeaveByStatus} = require("../controllers/leavesController.js");
const { handleLogin } = require("../middlewares/authMiddlewares");

router.get("/", handleLogin, leavesController);
router.post("/addleaves", handleLogin, addleavesController);
router.get("/leave-status/:status", handleLogin, getLeaveByStatus);



module.exports = router;