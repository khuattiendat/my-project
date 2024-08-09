export const addPaymentByPaypal = async (accessToken, data, axiosJWT) => {
    const res = await axiosJWT.post("payments/payByPaypal", data, {
        headers: {
            token: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
        }
    })
    return res.data;
}
export const addPaymentByCash = async (accessToken, data, axiosJWT) => {
    const res = await axiosJWT.post("payments/payByCash", data, {
        headers: {
            token: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
        }
    })
    return res.data;
}