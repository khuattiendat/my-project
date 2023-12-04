const UsersController = require("../app/controllers/UserController");
const AuthController = require("../app/controllers/AuthController");
const {MiddlewareLogin} = require("../app/middleware/MiddlewareLogin");
const express = require('express');
const router = express.Router();
// [POST] /auth/register
router.post('/register', AuthController.registerUser)
// [POST] /auth/loginAdmin
router.post('/loginAdmin', AuthController.loginAdmin)
// [POST] /auth/loginUser
router.post('/loginUser', AuthController.loginUser)
// [POST] /auth/refresh
router.post('/refresh', AuthController.RefreshToken)
// [POST] /auth/logout
router.post('/logout', MiddlewareLogin.verifyToken, AuthController.logOut)
module.exports = router;