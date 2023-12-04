export const addPaymentByPaypal = async (accessToken, data, axiosJWT) => {
    const res = await axiosJWT.post("payments/payByPaypal", data, {
        headers: {
            token: `Bearer ${accessToken}`
        }
    })
    return res.data;
}
export const addPaymentByCash = async (accessToken, data, axiosJWT) => {
    const res = await axiosJWT.post("payments/payByCash", data, {
        headers: {
            token: `Bearer ${accessToken}`
        }
    })
    return res.data;
}