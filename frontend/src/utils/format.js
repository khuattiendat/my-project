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