import axios from 'axios'
import {loginFailed, loginStart, loginSuccess, logoutFailed, logoutStart, logoutSuccess} from '../redux/authSlice'
import {showAlertError} from '../utils/showAlert';

const BASE_URL_SERVER = process.env.REACT_APP_BASE_URL_SERVER;
export const loginAdmin = async (user, dispatch) => {
    dispatch(logoutSuccess())
    dispatch(loginStart());
    try {
        const res = await axios.post(`${BASE_URL_SERVER}api/auth/loginAdmin`, user, {
            withCredentials: true,
        });
        dispatch(loginSuccess(res.data));
        return res.data
    } catch (error) {
        console.log(error)
        dispatch(loginFailed());
        return error.response.data
    }
}
export const loginUser = async (user, dispatch, navigate) => {
    dispatch(logoutSuccess())
    dispatch(loginStart());
    try {
        const res = await axios.post(`${BASE_URL_SERVER}api/auth/loginUser`, user, {
            withCredentials: true,
        });
        dispatch(loginSuccess(res.data));
        return res.data
    } catch (error) {
        dispatch(loginFailed());
        return error.response.data
    }
}
export const logout = async (accessToken, axiosJWT, id) => {

    const res = await axiosJWT.post("auth/logout", id, {
        headers: {
            token: `Bearer ${accessToken}`
        }
    })
    return res.data
}


