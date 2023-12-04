import axios from 'axios'
import {showAlertError, showAlertSuccess} from '../utils/showAlert';

const BASE_URL_SERVER = process.env.REACT_APP_BASE_URL_SERVER;
export const getAllUsers = async (accessToken, page, q, axiosJWT) => {
    const res = await axiosJWT.get('users', {
        params: {
            page,
            q
        },
        headers: {
            token: `Bearer ${accessToken}`
        },
    })
    return res.data.data
}
export const getAllRole = async (accessToken, axiosJWT) => {
    const res = await axiosJWT.get("users/role", {
        headers: {
            token: `Bearer ${accessToken}`
        }
    })
    return res.data.data
}
export const getUserById = async (accessToken, id, axiosJWT) => {
    const res = await axiosJWT.get(`users/${id}`, {
        headers: {
            token: `Bearer ${accessToken}`
        }
    })
    return res.data.data
}
export const forgotPassword = async (data) => {
    await axios.put(`${BASE_URL_SERVER}api/users/forgotPassword`, data)
}
export const resetPassword = async (accessToken, data, axiosJWT, id) => {
    await axiosJWT.put(`users/resetPassword/${id}`, data, {
        headers: {
            token: `Bearer ${accessToken}`
        }
    })
}
export const addUser = async (data) => {
    const res = await axios.post(`${BASE_URL_SERVER}api/auth/register`, data)
}

export const deleteUser = async (accessToken, id, axiosJWT) => {
    await axiosJWT.delete("users/", {
        data: {
            id
        },
        headers: {
            token: `Bearer ${accessToken}`
        }
    })
}
export const updateUser = async (accessToken, data, id, axiosJWT) => {
    await axiosJWT.put("users/" + id, data, {
        headers: {
            token: `Bearer ${accessToken}`
        }
    })
}