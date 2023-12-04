const {MiddlewareLogin} = require("../app/middleware/MiddlewareLogin");
const UserController = require("../app/controllers/UserController");
const UsersController = require("../app/controllers/UserController");
const express = require('express')
const router = express.Router();
// [GET] /users/id
router.get("/search", MiddlewareLogin.verifyTokenAndAdmin, UserController.searchUser)
router.get("/role", MiddlewareLogin.verifyTokenAndAdmin, UserController.getAllRoleUsers)
router.get("/:id", MiddlewareLogin.verifyTokenAndAdmin, UserController.getUserById)
router.put("/forgotPassword", UserController.forgotPassword)
router.put("/resetPassword/:id", MiddlewareLogin.verifyToken, UserController.resetPassword)
router.put("/:id", MiddlewareLogin.verifyTokenAndAdmin, UserController.updateUser)
router.delete("/", MiddlewareLogin.verifyTokenAndAdmin, UserController.deleteUser)
// [GET] /users/
router.get("/", MiddlewareLogin.verifyTokenAndAdmin, UsersController.getAllUser)
module.exports = router;