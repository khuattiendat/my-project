const nodemailer = require('nodemailer');
const isNullOrWhiteSpace = (input) => {
    if (!input) {
        return true;
    }
    const temp = String(input).trim();
    return !temp;

};
const isNullOrEmptyArray = (arrayInput) => {
    if (!arrayInput) {
        return true;
    }
    return arrayInput.length === 0;

};
const customDateTime = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1
    }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

module.exports = {
    isNullOrEmptyArray,
    isNullOrWhiteSpace,
    customDateTime,
}