export const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"})
}
export const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(price);
}
export const formatPriceDiscount = (price, discount) => {
    let newPrice = price - (price * discount / 100)
    return new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(newPrice);
}
export const formatCurrencyNumberWithDecimal = (amount) => {
    const p = amount.toFixed(2).split(".");

    return p[0].split("").reverse().reduce(function (acc, amount, i, orig) {
        return amount + (amount != "-" && i && !(i % 3) ? "," : "") + acc;
    }, "");
};
export const formatCurrencyNumber = (price) => {
    const match = price.match(/[0-9,.]*/);
    let amount = 0;
    if (match !== null) {
        amount = parseFloat(match[0].replace(/,/g, '')); // replace , thousands separator
    }
    return amount;
};