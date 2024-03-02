const {
    ERROR_FAILED,
    MESSAGE_SUCCESS,
    ERROR_SUCCESS,
    MESSAGE_EMPTY,
    MESSAGE_IS_PHONE_NUMBER
} = require('../common/messageList');
const {sendEmail} = require('../common/utils');
const User = require('../models/User');
const {
    getAllUser,
    getUserById,
    updateUser,
    deleteUser,
    searchUser,
    resetPassword,
    forgotPassword,
    getAllRoleUser
} = require('../services/userService');
String.format = function () {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
};
const UserController = {
    //[GET] /users/
    getAllUser: async (req, res) => {
        try {
            const page = req.query.page;
            const value = req.query.q;
            const users = await getAllUser(page, value);
            if (users.error != ERROR_SUCCESS) {
                res.status(200).send(users);
            } else {
                res.status(400).send(users);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    getUserById: async (req, res) => {
        try {
            const id = req.params.id;
            const user = await getUserById(id);
            if (user.error != ERROR_SUCCESS) {
                return res.status(200).send(user);
            } else {
                return res.status(400).send(user);
            }
        } catch (error) {
            return res.status(500).send(error.message);
        }
    },
    getAllRoleUsers: async (req, res) => {
        try {
            const users = await getAllRoleUser();
            if (users.error != ERROR_SUCCESS) {
                res.status(200).send(users);
            } else {
                res.status(400).send(users);
            }
        } catch (error) {
            return res.status(500).send(error.message);
        }
    },
    updateUser: async (req, res) => {
        try {
            const id = req.params.id;
            const data = req.body;
            const user = await updateUser(id, data);
            if (user.error != ERROR_SUCCESS) {
                res.status(200).send(user);
            } else {
                res.status(400).send(user);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }

    },
    deleteUser: async (req, res) => {
        try {
            const id = req.body.id;
            const user = await deleteUser(id);
            if (user.error != ERROR_SUCCESS) {
                res.status(200).send(user);
            } else {
                res.status(400).send(user);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    searchUser: async (req, res) => {
        try {
            const value = req.query.q;
            const page = req.query.page
            const user = await searchUser(value, page);
            if (user.error != ERROR_SUCCESS) {
                res.status(200).send(user);
            } else {
                res.status(400).send(user);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    resetPassword: async (req, res) => {
        try {
            const id = req.params.id;
            const data = req.body;
            const reset = await resetPassword(id, data);
            if (reset.error != ERROR_SUCCESS) {
                res.status(200).send(reset);
            } else {
                res.status(400).send(reset);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    forgotPassword: async (req, res) => {
        try {
            const data = req.body;
            const reset = await forgotPassword(data);
            if (reset.error != ERROR_SUCCESS) {
                res.status(200).send(reset);
            } else {
                res.status(400).send(reset);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}
module.exports = UserController;