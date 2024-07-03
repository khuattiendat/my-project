export const checkStatusPayment = (status) => {
    const statusPayment = ["Chưa thanh toán", "Đã thanh toán", "Đã hủy"];
    return statusPayment[status];
}
export const checkStatusDelivery = (status) => {
    const statusDelivery = ["Chưa giao", "Đang giao hàng", "Giao hàng thành công", "Đã hủy"];
    return statusDelivery[status];
}
export const checkPaymentMethod = (status) => {
    const paymentMethod = ["Thanh toán khi nhận hàng", "Thanh toán qua thẻ"];
    return paymentMethod[status];
}
export const checkGender = (gender) => {
    const genderList = ["Nữ", "Nam"];
    return genderList[gender];
}
export const checkActiveBanner = (status) => {
    const activeBanner = ["Không", "Sử dụng"];
    return activeBanner[status];
}