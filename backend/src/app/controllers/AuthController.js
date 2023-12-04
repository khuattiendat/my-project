const {ERROR_SUCCESS, ERROR_FAILED} = require('../common/messageList');
const {loginAdmin, loginUser, register, requestRefreshToken} = require('../services/userService');
let refreshTokens = [];
const AuthController = {
    // [POST] /auth/register
    registerUser: async (req, res) => {
        try {
            const data = req.body;
            const user = await register(data)
            if (user.error !== ERROR_SUCCESS) {
                res.status(200).send(user);
            } else {
                res.status(400).send(user);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    //[POST] /auth/loginUser
    loginAdmin: async (req, res) => {
        try {
            const data = req.body;
            const user = await loginAdmin(data)
            if (user.error !== ERROR_SUCCESS) {
                await res.cookie("refreshToken", user.data.refreshToken,
                    {
                        httpOnly: true,
                        secure: false,
                        sameSite: "strict"
                    }
                )
                res.status(200).send(user);
            } else {
                res.status(400).send(user);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    loginUser: async (req, res) => {
        try {
            const data = req.body;
            const user = await loginUser(data)
            if (user.error !== ERROR_SUCCESS) {
                // lưu mã token refreshToken vào cookies
                await res.cookie("refreshToken", user.data.refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "strict"
                })
                res.status(200).send(user);
            } else {
                res.status(400).send(user);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    //[POST] /auth/refresh
    RefreshToken: async (req, res) => {
        try {
            const refresh = await requestRefreshToken(req);
            if (refresh.error !== ERROR_SUCCESS) {
                res.cookie("refreshToken", refresh.data.refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "strict",
                });
                res.status(200).send(refresh)
            } else {
                res.status(400).send(refresh)
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    logOut: async (req, res) => {
        //Clear cookies when user logs out
        refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
        res.clearCookie("refreshToken");
        res.status(200).json({
            error: ERROR_FAILED,
            data: null,
            message: "Logged out successfully!"
        })
        ;
    },
}
module.exports = AuthController;