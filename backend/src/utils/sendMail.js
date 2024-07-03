const nodemailer = require('nodemailer');
const { ERROR_SUCCESS, MESSAGE_ERROR, ERROR_FAILED, MESSAGE_SUCCESS } = require('../app/common/messageList');
require("dotenv").config();
const sendEmail = async (email, subject, html) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });

    return await transporter.sendMail({
        from: process.env.EMAIL_NAME, // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        html: html, // html body
    }, (err) => {
        let result;
        if (err) {
            result = {
                error: ERROR_SUCCESS,
                message: MESSAGE_ERROR,
                err
            };
            return result;
        }
        result = {
            error: ERROR_FAILED,
            message: MESSAGE_SUCCESS,
        };
        return result;
    });
}
module.exports = sendEmail;