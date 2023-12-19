export const checkEmail = (value) => {
    if (!value) {
        return true;
    }
    const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!re.test(value.trim())) {
        return true;
    }
    return false
}
export const checkPhone = (value) => {
    console.log(value)
    if (!value) {
        return true;
    }
    var re = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    return !re.test(value.trim());
}
export const checkPasswordsMatch = (value1, value2) => {
    if (value1.value !== value2.value) {
        return true;
    }
    return false
}
export const checkDiscountValue = (value) => {
    if (!value) {
        return true;
    }
    if (value > 0 && value <= 100) {
        return true;
    }
    return false;
}