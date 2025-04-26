const Role = require("../models/Role");
const User = require("../models/User");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const {
    ERROR_SUCCESS,
    MESSAGE_SUCCESS,
    ERROR_FAILED,
    MESSAGE_EXIST_USER_NAME,
    MESSAGE_EMPTY,
    MESSAGE_EXIST,
    MESSAGE_ALL_EMPTY,
} = require("../common/messageList");
const {
    isNullOrWhiteSpace,
    isNullOrEmptyArray,
    customDateTime,
} = require("../common/utils");
const {Op} = require("sequelize");
const sendEmail = require("../../utils/sendMail");
const Order = require("../models/Order");
const OrderDetail = require("../models/OrderDetail");
const {decrypt} = require("dotenv");
String.format = function () {
    let s = arguments[0];
    for (let i = 0; i < arguments.length - 1; i++) {
        const reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
};
const refreshTokens = [];
// tạo token mới khi người dùng đăng nhập
const generateAccessToken = (user, isAdmin) => {
    return jwt.sign({
        id: user.id,
        isAdmin: isAdmin
    }, process.env.JWT_ACCESS_KEY, {
        // token hết hạn sau 1 tuần
        expiresIn: '7d'
    })
}
// tạo token làm mới token
const generateRefreshToken = (user, isAdmin) => {
    return jwt.sign(
        {
            id: user.id,
            isAdmin: isAdmin
        },
        process.env.JWT_REFRESH_KEY,
        {expiresIn: "14d"}
    )
}
const loginAdmin = async (data) => {
    try {
        const messages = [];
        let isAdmin = false;
        if (isNullOrWhiteSpace(data.phone_number)) {
            messages.push(String.format(MESSAGE_EMPTY, "phone_number"));
        }
        if (isNullOrWhiteSpace(data.password)) {
            messages.push(String.format(MESSAGE_EMPTY, "password"));
        }
        if (!isNullOrEmptyArray(messages)) {
            return {
                error: ERROR_SUCCESS,
                data: null,
                message: messages,
            };
        }

        // lấy ra user trên database
        const user = await User.findOne({
            where: {
                phone_number: data.phone_number
            }
        })
        if (!user) {
            return {
                error: ERROR_SUCCESS,
                message: MESSAGE_EXIST_USER_NAME,
            };
        }
        // check admin
        const admin = await Role.findOne({
            where: {
                id: user.role_id
            }
        });
        if (admin) {
            isAdmin = admin.name === 'admin';
        }
        const validPassword = await bcrypt.compare(
            data.password,
            user.password
        );
        if (!user || !validPassword || !isAdmin) {
            return {
                error: ERROR_SUCCESS,
                message: "Tài khoản hoặc mật khẩu không đúng !!!",
            };
        }
        if (user && validPassword) {
            //Generate access token
            const accessToken = generateAccessToken(user, isAdmin);
            //  Generate refresh token
            const refreshToken = generateRefreshToken(user, isAdmin);
            refreshTokens.push(refreshToken);
            return {
                error: ERROR_FAILED,
                data: {accessToken, user, refreshToken},
                message: MESSAGE_SUCCESS,
            };
        }
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        }
    }
}
const loginUser = async (data) => {
    try {
        let isAdmin = false;
        if (!data.phone_number || !data.password) {
            return {
                error: ERROR_SUCCESS,
                message: String.format(MESSAGE_ALL_EMPTY, "phone number", "password")
            };
        }
        const messages = [];
        if (isNullOrWhiteSpace(data.phone_number)) {
            messages.push(String.format(MESSAGE_EMPTY, "phone_number"));
        }
        if (isNullOrWhiteSpace(data.password)) {
            messages.push(String.format(MESSAGE_EMPTY, "password"));
        }
        if (!isNullOrEmptyArray(messages)) {
            return {
                error: ERROR_SUCCESS,
                data: null,
                message: messages,
            };
        }
        // lấy ra user trên database
        const user = await User.findOne({
            where: {
                phone_number: data.phone_number
            }
        })
        if (!user) {
            return {
                error: ERROR_SUCCESS,
                message: MESSAGE_EXIST_USER_NAME,
            };
        }
        // check admin
        const admin = await Role.findOne({
            where: {
                id: user.role_id
            }
        });
        if (admin) {
            isAdmin = admin.name === 'admin';
        }
        const validPassword = await bcrypt.compare(
            data.password,
            user.password
        );
        if (!validPassword) {
            return {
                error: ERROR_SUCCESS,
                message: MESSAGE_EXIST_USER_NAME,
            };
        }

        if (user && validPassword) {
            //Generate access token
            const accessToken = generateAccessToken(user, isAdmin);
            //Generate refresh token
            const refreshToken = generateRefreshToken(user, isAdmin);
            refreshTokens.push(refreshToken);
            return {
                error: ERROR_FAILED,
                data: {accessToken, user, refreshToken},
                message: MESSAGE_SUCCESS,
            };
        }
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }
}
const register = async (data) => {
    try {
        const messages = [];
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(data.password, salt);
        const checkPhoneNumber = await User.findAll({
            where: {
                phone_number: data.phone_number,
            }
        })
        if (isNullOrWhiteSpace(data.name)) {
            messages.push(String.format(MESSAGE_EMPTY, "name"));
        }
        if (isNullOrWhiteSpace(data.email)) {
            messages.push(String.format(MESSAGE_EMPTY, "email"));
        }
        if (isNullOrWhiteSpace(data.address)) {
            messages.push(String.format(MESSAGE_EMPTY, "address"));
        }
        if (isNullOrWhiteSpace(data.phone_number)) {
            messages.push(String.format(MESSAGE_EMPTY, "phone_number"));
        }
        if (isNullOrWhiteSpace(data.password)) {
            messages.push(String.format(MESSAGE_EMPTY, "password"));
        }
        if (isNullOrWhiteSpace(data.gender)) {
            messages.push(String.format(MESSAGE_EMPTY, "gender"));
        }
        if (checkPhoneNumber.length > 0) {
            messages.push("Số điện thoại đã tồn tại !!!");
        }
        if (!isNullOrEmptyArray(messages)) {
            return {
                error: ERROR_SUCCESS,
                data: null,
                message: messages,
            };
        }
        // create user
        const newUser = await User.create({
            name: data.name,
            email: data.email,
            address: data.address,
            phone_number: data.phone_number,
            password: hashed,
            gender: data.gender,
            role_id: data.role_id,
        })

        await newUser.save()
        return {
            error: ERROR_FAILED,
            data: null,
            message: MESSAGE_SUCCESS,
        };
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        }
    }
}
const requestRefreshToken = async (req) => {
    try {
        //Take refresh token from user
        const refreshToken = req.cookies.refreshToken;
        //Send error if token is not valid
        if (!refreshToken) {
            return {
                error: ERROR_SUCCESS,
                data: null,
                message: "You're not authenticated"
            };
        }
        if (!refreshTokens.includes(refreshToken)) {
            return {
                error: ERROR_SUCCESS,
                data: null,
                message: "Refresh token is not valid"
            };
        }
        return jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, async (err, user) => {
            if (err) {
                console.log(err);
            }
            // refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
            // //create new access token, refresh token and send to user
            // console.log(refreshTokens);
            const newAccessToken = generateAccessToken(user, user.isAdmin);
            const newRefreshToken = generateRefreshToken(user, user.isAdmin);
            refreshTokens.push(newRefreshToken);
            return {
                error: ERROR_FAILED,
                data: {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                },
                message: MESSAGE_SUCCESS
            };
        });
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }

}
const getAllUser = async (page, value) => {
    try {
        if (!page) {
            return {
                error: ERROR_SUCCESS,
                message: String.format(MESSAGE_EMPTY, "page")
            };
        }
        let totalPage;
        let totalUser;
        let users = []
        let pageSize = parseInt(process.env.PAGE_SIZE);
        let offset = (page - 1) * pageSize;
        if (page < 1) {
            page = 1;
        }
        if (!value) {
            const {rows, count} = await User.findAndCountAll({
                limit: pageSize,
                offset: offset
            })
            await rows.forEach((item) => {
                users.push(item.dataValues)
            })
            totalPage = Math.ceil(count / pageSize);
            totalUser = count;
        } else {
            const {count, rows} = await User.findAndCountAll({
                where: {
                    [Op.or]: [
                        {name: {[Op.like]: '%' + value.trim() + '%'}},
                        {email: {[Op.like]: '%' + value.trim() + '%'}},
                        {phone_number: {[Op.like]: '%' + value.trim() + '%'}},
                        {address: {[Op.like]: '%' + value.trim() + '%'}},
                        {gender: {[Op.like]: '%' + value.trim() + '%'}},
                    ]
                },
                limit: pageSize,
                offset: offset
            })
            await rows.forEach((item) => {
                users.push(item.dataValues);
            })
            totalPage = Math.ceil(count / pageSize)
            totalUser = count;
        }
        return {
            error: ERROR_FAILED,
            data: {
                users: users,
                totalPage: totalPage,
                totalUser: totalUser
            },
            message: MESSAGE_SUCCESS
        };
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message,
        };
    }
}
const getUserById = async (id) => {
    try {
        const users = await User.findOne({
            where: {
                id: id,
            }
        })
        if (!users) {
            return {
                error: ERROR_SUCCESS,
                data: null,
                message: String.format(MESSAGE_EXIST, "user")
            };
        }
        const {password, ...user} = users.dataValues;
        return {
            error: ERROR_FAILED,
            data: user,
            message: MESSAGE_SUCCESS
        };
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        }
    }
}
const getAllRoleUser = async () => {
    try {
        const roles = await Role.findAll({})
        return {
            error: ERROR_FAILED,
            data: roles,
            message: MESSAGE_SUCCESS
        };
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        }
    }
}
const updateUser = async (id, data) => {
    try {
        const messages = [];
        const checkPhoneNumber = await User.findAll({
            where: {
                phone_number: data.phone_number,
                id: {
                    [Op.not]: id
                }
            },
        })
        const checkEmail = await User.findAll({
            where: {
                email: data.email,
                id: {
                    [Op.not]: id
                }
            },
        })

        if (isNullOrWhiteSpace(data.name)) {
            messages.push(String.format(MESSAGE_EMPTY, "name"));
        }
        if (isNullOrWhiteSpace(data.email)) {
            messages.push(String.format(MESSAGE_EMPTY, "email"));
        }
        if (isNullOrWhiteSpace(data.address)) {
            messages.push(String.format(MESSAGE_EMPTY, "address"));
        }
        if (isNullOrWhiteSpace(data.phone_number)) {
            messages.push(String.format(MESSAGE_EMPTY, "phone_number"));
        }
        if (isNullOrWhiteSpace(data.gender)) {
            messages.push(String.format(MESSAGE_EMPTY, "gender"));
        }
        if (checkPhoneNumber.length > 0) {
            messages.push("Số điện thoại đã tồn tại !!!");
        }
        if (checkEmail.length > 0) {
            messages.push("Email đã tồn tại !!!");
        }
        if (!isNullOrEmptyArray(messages)) {
            return {
                error: ERROR_SUCCESS,
                data: null,
                message: messages,
            };
        }
        const row = await User.findOne({
            where: {
                id: id,
            }
        })
        if (row) {
            await User.update({
                name: data.name,
                email: data.email,
                address: data.address,
                phone_number: data.phone_number,
                gender: data.gender,
                role_id: data.role_id,
            }, {
                where: {
                    id: id,
                }
            })
            return {
                error: ERROR_FAILED,
                data: null,
                message: MESSAGE_SUCCESS,
            };
        } else {
            return {
                error: ERROR_SUCCESS,
                data: null,
                message: "user does not exist",
            };
        }

    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }
}
const deleteUser = async (id) => {
    try {
        const row = await User.findAll({
            where: {id: id},
        });
        if (row.length > 0) {
            const orderId = (await Order.findAll({where: {user_id: id}})).map(item => item.dataValues.id);
            await OrderDetail.destroy({where: {order_id: [...orderId]}});
            await Order.destroy({where: {id: [...orderId]}});
            await User.destroy({
                where: {
                    id: id,
                }
            })
            return {
                error: ERROR_FAILED,
                data: null,
                message: MESSAGE_SUCCESS,
            };
        } else {
            return {
                error: ERROR_SUCCESS,
                message: "user does not exist"
            };
        }
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }
}
const searchUser = async (value, page) => {
    try {
        if (!value || !page) {
            return {
                error: ERROR_SUCCESS,
                message: String.format(MESSAGE_ALL_EMPTY, "value", "page")
            }
        }
        let users = [];
        let pageSize = parseInt(process.env.PAGE_SIZE);
        let offset = (page - 1) * pageSize;
        if (page < 1) {
            page = 1;
        }
        const {count, rows} = await User.findAndCountAll({
            where: {
                [Op.or]: [
                    {name: {[Op.like]: '%' + value.trim() + '%'}},
                    {email: {[Op.like]: '%' + value.trim() + '%'}},
                    {phone_number: {[Op.like]: '%' + value.trim() + '%'}},
                    {address: {[Op.like]: '%' + value.trim() + '%'}},
                    {gender: {[Op.like]: '%' + value.trim() + '%'}},
                ]
            },
            limit: pageSize,
            offset: offset
        })
        await rows.forEach((item) => {
            users.push(item.dataValues);
        })
        let totalPage = Math.ceil(count / pageSize)
        if (rows) {
            return {
                error: ERROR_FAILED,
                data: {
                    users: users,
                    totalPage: totalPage,

                },
                message: MESSAGE_SUCCESS
            };
        } else {
            return {
                error: ERROR_SUCCESS,
                message: String.format(MESSAGE_EXIST, "user")
            };
        }
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }
}
const resetPassword = async (id, data) => {
    try {
        let {oldPassword} = data;
        let messages = [];
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(data.newPassword, salt);
        if (isNullOrWhiteSpace(oldPassword)) {
            messages.push(String.format(MESSAGE_EMPTY, "old password"));
        }
        if (isNullOrWhiteSpace(data.newPassword)) {
            messages.push(String.format(MESSAGE_EMPTY, "new password"));
        }
        if (!isNullOrEmptyArray(messages)) {
            return {
                error: ERROR_SUCCESS,
                data: null,
                message: messages,
            };
        }
        const user = await User.findOne({
            where: {
                id: id
            }
        })
        if (!user) {
            return {
                error: ERROR_SUCCESS,
                message: MESSAGE_EXIST_USER_NAME,
            };
        }
        const validPassword = await bcrypt.compare(
            oldPassword,
            user.password
        );
        if (!validPassword) {
            messages.push(String.format(MESSAGE_EMPTY, "Mật khẩu không đúng"));
            return {
                error: ERROR_SUCCESS,
                message: messages,
            };
        }
        await User.update({
            password: newPassword,
            updatedAt: customDateTime()
        }, {
            where: {
                id: id
            }
        })
        return {
            error: ERROR_FAILED,
            data: null,
            message: MESSAGE_SUCCESS,
        };
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }
}
const randomNewPassword = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
const forgotPassword = async (data) => {
    try {
        let messages = [];
        const {phone_number, email} = data;
        const passwordRandom = randomNewPassword(6);
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(passwordRandom, salt);
        if (isNullOrWhiteSpace(phone_number)) {
            messages.push(String.format(MESSAGE_EMPTY, "phone number"));
        }
        if (isNullOrWhiteSpace(email)) {
            messages.push(String.format(MESSAGE_EMPTY, "email"));
        }
        if (!isNullOrEmptyArray(messages)) {
            return {
                error: ERROR_SUCCESS,
                data: null,
                message: messages,
            };
        }
        const user = await User.findOne({
            where: {
                phone_number: phone_number,
                email: email
            }
        })
        if (!user) {
            return {
                error: ERROR_SUCCESS,
                message: MESSAGE_EXIST_USER_NAME,
            };
        }
        let html = `
        <h1> Chào bạn <h1/>
        <h2> Bạn vừa yêu cầu đổi mật khẩu trên 
        trang bán hàng trang sức pandona, mật khẩu mới của bạn là: 
        <span style="color:	#32CD32;">${passwordRandom}</span>
        </h2>
        `
        await sendEmail(email, "Quên mật khẩu", html)
        await User.update({
            password: newPassword,
            updatedAt: customDateTime()
        }, {
            where: {
                phone_number: phone_number
            }
        })
        return {
            error: ERROR_FAILED,
            data: null,
            message: MESSAGE_SUCCESS,
        };

    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }
}
module.exports = {
    loginAdmin,
    loginUser,
    register,
    getAllUser,
    getUserById,
    updateUser,
    deleteUser,
    searchUser,
    requestRefreshToken,
    resetPassword,
    forgotPassword,
    getAllRoleUser
}