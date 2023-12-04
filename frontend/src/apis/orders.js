import {showAlertSuccess} from "../utils/showAlert";
import {enqueueSnackbar} from "notistack";

export const getAllOrder = async (accessToken, page, q, axiosJWT) => {
    try {
        const res = await axiosJWT.get("orders", {
            params: {
                page,
                q
            },
            headers: {
                token: `Bearer ${accessToken}`
            }
        })
        return res.data.data
    } catch (error) {
        console.log(error);
    }
}

export const deleteOrder = async (accessToken, id, navigate, axiosJWT) => {
    try {
        await axiosJWT.delete("orders", {
            data: {
                id
            },
            headers: {
                token: `Bearer ${accessToken}`
            }
        })
        enqueueSnackbar("Xóa thành công", {variant: "success", autoHideDuration: 1000})
        navigate("/admin/orders", {
            state: id,
        });
    } catch (error) {
        console.log(error);
    }
}
export const getOrderById = async (accessToken, id, axiosJWT) => {
    try {
        const res = await axiosJWT.get("orders/" + id, {
            headers: {
                token: `Bearer ${accessToken}`
            }
        })
        return res.data.data;
    } catch (error) {
        console.log(error);
    }
}
export const getOrderDetailByOrderId = async (accessToken, id, axiosJWT) => {
    try {
        const res = await axiosJWT.get("orders/order-detail/" + id, {
            headers: {
                token: `Bearer ${accessToken}`
            }
        })
        return res.data.data;
    } catch (error) {
        console.log(error);
    }
}
export const getOrderByUserId = async (accessToken, id, axiosJWT, page, q) => {
    const res = await axiosJWT.get("orders/users/" + id, {
        params: {
            page,
            q
        },
        headers: {
            token: `Bearer ${accessToken}`
        }
    })
    return res.data.data;
}
export const updateOrder = async (accessToken, data, navigate, axiosJWT) => {
    try {
        await axiosJWT.put("orders", data, {
            headers: {
                token: `Bearer ${accessToken}`
            }
        })
        enqueueSnackbar("Cập nhật thành công", {variant: "success", autoHideDuration: 1000})
    } catch (error) {
        console.log(error);
    }
}