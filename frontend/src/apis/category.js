import axios from "axios"
import {showAlertError, showAlertSuccess} from "../utils/showAlert";
import {enqueueSnackbar} from "notistack";

const Base_URL = process.env.REACT_APP_BASE_URL_SERVER;

export const getAllCategory = async () => {
    try {
        const res = await axios.get(`${Base_URL}api/categories`)
        return res.data.data;
    } catch (error) {
        console.log(error);
    }
}
export const getAllCategoryByPaging = async (page, q = "") => {
    try {
        const res = await axios.get(`${Base_URL}api/categories/paging`, {
            params: {
                page,
                q
            }
        })
        return res.data.data
    } catch (error) {
        console.log(error);
    }
}
export const addCategory = async (accessToken, data, navigate, axiosJWT) => {
    try {
        await axiosJWT.post("categories", data, {
            headers: {
                token: `Bearer ${accessToken}`
            }
        })
        enqueueSnackbar("Thêm thành công", {variant: "success", autoHideDuration: 1000})
        navigate("/admin/categories")
    } catch (error) {
        console.log(error);
        let messageError = JSON.stringify(error.response.data.message)
        enqueueSnackbar(messageError, {variant: "error", autoHideDuration: 1000,})
    }
}
export const deleteCategory = async (accessToken, id, navigate, axiosJWT) => {
    try {
        await axiosJWT.delete("categories", {
            data: {
                id: id,
            },
            headers: {
                token: `Bearer ${accessToken}`
            }
        })
        enqueueSnackbar("Xóa thành công", {variant: "success", autoHideDuration: 1000})
        navigate("/admin/categories", {
            state: id,
        });
    } catch (error) {
        console.log(error);
    }
}
export const getCategoryById = async (id) => {
    try {
        const res = await axios.get(`${Base_URL}api/categories/${id}`)
        return res.data.data;
    } catch (error) {
        console.log(error);
    }
}
export const updateCategory = async (accessToken, data, id, navigate, axiosJWT) => {
    try {
        await axiosJWT.put("categories/" + id, data, {
            headers: {
                token: `Bearer ${accessToken}`
            }
        })
        enqueueSnackbar("Cập nhật thành công", {variant: "success", autoHideDuration: 1000})
        navigate("/admin/categories")
    } catch (error) {
        let message = error.response.data.message;
        enqueueSnackbar(JSON.stringify(message), {variant: "error", autoHideDuration: 1000})
        console.log(error);
    }
}