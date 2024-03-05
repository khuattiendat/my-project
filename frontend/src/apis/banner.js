import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL_SERVER;
export const getAllBanner = async (page) => {
    return await axios.get(`${BASE_URL}api/banners`, {
        params: {
            page
        }
    });
}
export const addBanner = async (accessToken, data, axiosJWT) => {
    await axiosJWT.post(`${BASE_URL}api/banners`, data, {
        headers: {
            token: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data"
        }
    });
}
export const getBannerById = async (id) => {
    return await axios.get(`${BASE_URL}api/banners/${id}`);
}
export const deleteBanner = async (accessToken, id, axiosJWT) => {
    await axiosJWT.delete(`${BASE_URL}api/banners`, {
        data: {
            id: id,
        },
        headers: {
            token: `Bearer ${accessToken}`
        }
    });
}
export const updateBanner = async (accessToken, data, id, axiosJWT) => {
    await axiosJWT.put(`banners/${id}`, data, {
        headers: {
            token: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data"
        }
    });
}
export const updateIsActiveBanner = async (accessToken, id, data, axiosJWT) => {
    await axiosJWT.put(`banners/isActive/${id}`, data, {
        headers: {
            token: `Bearer ${accessToken}`
        }
    });
}
export const getAllBannerIsActive = async () => {
    return await axios.get(`${BASE_URL}api/banners/isActive`);
}