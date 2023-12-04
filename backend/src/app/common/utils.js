const nodemailer = require('nodemailer');
const isNullOrWhiteSpace = (input) => {
    if (!input) {
        return true;
    }
    const temp = String(input).trim();
    if (!temp) {
        return true;
    }
    return false;
};
const isNullOrEmptyArray = (arrayInput) => {
    if (!arrayInput) {
        return true;
    }
    if (arrayInput.length == 0) {
        return true;
    }
    return false
};
const customDateTime = () => {
    var date = new Date();
    var result = `${date.getFullYear()}-${date.getMonth() + 1
    }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    return result;
};

module.exports = {
    isNullOrEmptyArray,
    isNullOrWhiteSpace,
    customDateTime,
}