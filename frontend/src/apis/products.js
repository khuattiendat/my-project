import axios from "axios";
import {showAlertSuccess} from "../utils/showAlert";
import {enqueueSnackbar} from "notistack";

const BASE_URL = process.env.REACT_APP_BASE_URL_SERVER;
export const getAllProducts = async () => {
    try {
        const res = await axios.get(`${BASE_URL}api/products`);
        return res.data.data
    } catch (error) {
        console.log(error);
    }
}
export const getProductByCategoryId = async (id) => {
    try {
        const res = await axios.get(`${BASE_URL}api/products/categories/${id}`);
        return res.data.data
    } catch (error) {
        console.log(error);
    }
}
export const getBestsellerProducts = async () => {
    try {
        const res = await axios.get(`${BASE_URL}api/products/best-sellers`);
        return res.data.data
    } catch (error) {
        console.log(error);
    }
}
export const getNewest = async () => {
    try {
        const res = await axios.get(`${BASE_URL}api/products/newest`);
        return res.data.data
    } catch (error) {
        console.log(error);
    }
}
export const getProductByPaging = async (page, q) => {
    try {
        const res = await axios.get(`${BASE_URL}api/products/paging`, {
            params: {
                page,
                q
            }
        });
        return res.data.data
    } catch (error) {
        console.log(error);
    }
}
export const getProductById = async (id) => {
    try {
        const res = await axios.get(`${BASE_URL}api/products/${id}`);
        return res.data.data;
    } catch (error) {
        console.log(error);
    }
}
export const deleteProduct = async (accessToken, id, navigate, axiosJWT) => {
    try {
        await axiosJWT.delete("products", {
            data: {
                id
            },
            headers: {
                token: `Bearer ${accessToken}`
            }
        })
        enqueueSnackbar("Xóa thành công", {variant: "success", autoHideDuration: 1000})
        navigate("/admin/products", {
            state: id,
        });
    } catch (error) {
        console.log(error);
    }
}
export const addProduct = async (accessToken, data, navigate, axiosJWT) => {
    try {
        await axiosJWT.post("products", data, {
            headers: {
                token: `Bearer ${accessToken}`,
                "Content-Type": "multipart/form-data"
            }
        })
        enqueueSnackbar("thêm mới thành công", {variant: "success", autoHideDuration: 1000})
        navigate("/admin/products")
    } catch (error) {
        console.log(error);
    }
}
export const getListImages = async (id) => {
    try {
        const res = await axios.get(`${BASE_URL}api/products/gallery/${id}`);
        return res.data.data;
    } catch (error) {
        console.log(error);
    }
}
export const updateProduct = async (accessToken, data, id, navigate, axiosJWT) => {
    try {
        await axiosJWT.put("products/" + id, data, {
            headers: {
                token: `Bearer ${accessToken}`
            }
        })
        enqueueSnackbar("sửa thành công", {variant: "success", autoHideDuration: 1000})
        navigate("/admin/products")
    } catch (error) {
        console.log(error);
    }

}
export const fillterProduct = async (price, orderBy, categories, page = 1) => {
    try {
        const res = await axios.get(`${BASE_URL}api/products/filter`, {
            params: {
                price,
                orderBy,
                categories,
                page
            },
            paramsSerializer: {
                indexes: true
            }
        });
        return res.data.data;
    } catch (error) {
        console.log(error)
    }

}