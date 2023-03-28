const { handleLogin } = require("../middlewares/authMiddlewares");
const express = require("express");
const router = express.Router();
const {v4 : uuidv4} = require('uuid')

const {saveData,renderForm}=require('../controllers/employee-dataController')

const multer  = require('multer');
const path = require('path');

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/upload_uncompressed');
    },
    filename:(req,file,cb)=>{
        const imgID = uuidv4()
        cb(null,Date.now()+imgID+path.extname(file.originalname));
    }
})

const upload = multer({ storage: storage});


router.get("/employee-form", handleLogin, renderForm);

router.post("/employee-form",handleLogin,upload.array('file',5),saveData);



module.exports = router;