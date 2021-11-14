const express = require('express');
const router = express.Router();
const checkPassword = require("../middleware/password-validator")
const checkEmail = require("../middleware/email-validator")
const userCtrl = require('../controllers/user');

router.post('/signup', checkEmail, checkPassword, userCtrl.signup);
router.post('/login', userCtrl.login);
router.get("/:id", userCtrl.getOneUser);
router.put("/:id", userCtrl.modifyUser);

module.exports = router;