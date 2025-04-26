export const checkEmail = (value) => {
    if (!value) {
        return true;
    }
    const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return !re.test(value.trim());
}
export const checkPhone = (value) => {
    if (!value) {
        return true;
    }
    const re = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    return !re.test(value.trim());
}
export const checkPasswordsMatch = (value1, value2) => {
    return value1.value !== value2.value;

}
export const checkDiscountValue = (value) => {
    if (!value) {
        return true;
    }
    return value > 0 && value <= 100;

}