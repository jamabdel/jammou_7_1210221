const express = require('express');
const router = express.Router();
const checkPassword = require("../middleware/password-validator")
const checkEmail = require("../middleware/email-validator")
const userCtrl = require('../controllers/user');
const auth = require("../middleware/auth");
const multer = require('../middleware/multer-config');

router.post('/signup', checkEmail, checkPassword, userCtrl.signup);
router.post('/login', userCtrl.login);
router.get("/:id", auth, userCtrl.getOneUser);
router.put("/:id",auth, multer,userCtrl.updateUser);
router.delete("/:id", auth, userCtrl.deleteUser);

module.exports = router;