import axios from "axios";
import jwt_decode from "jwt-decode";

const BASE_URL_SERVER = process.env.REACT_APP_BASE_URL_SERVER;
const refreshToken = async () => {
    try {
        const res = await axios.post(`${BASE_URL_SERVER}api/auth/refresh`, {}, {
            withCredentials: true,
        });
        return res.data.data;
    } catch (err) {
        console.log(err);
    }
};
export const createAxios = (user, dispatch, stateSuccess) => {
    const newInstance = axios.create({
        baseURL: `${BASE_URL_SERVER}api/`
    });
    newInstance.interceptors.request.use(
        async (config) => {
            let date = new Date();
            const decodedToken = jwt_decode(user?.data.accessToken);
            if (decodedToken.exp < date.getTime() / 1000) {
                const dataRefresh = await refreshToken();
                let userData = user.data;
                let newUserData = {
                    ...userData,
                    accessToken: dataRefresh?.accessToken,
                    refreshToken: dataRefresh?.refreshToken
                }
                const refreshUser = {
                    ...user,
                    data: newUserData
                };
                dispatch(stateSuccess(refreshUser));
                config.headers["token"] = "Bearer " + dataRefresh?.accessToken;
            }
            return config;
        },
        (err) => {
            return Promise.reject(err);
        }
    );
    return newInstance;
}; 