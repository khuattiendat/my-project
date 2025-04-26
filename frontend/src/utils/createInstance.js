import axios from "axios";
import jwt_decode from "jwt-decode";

const BASE_URL_SERVER = process.env.REACT_APP_BASE_URL_SERVER;
const refreshToken = async () => {
    const res = await axios.post(`${BASE_URL_SERVER}api/auth/refresh`, {}, {
        withCredentials: true,
    });
    return res.data.data;
};
export const createAxios = (user, dispatch, stateSuccess) => {
    const newInstance = axios.create({
        baseURL: `${BASE_URL_SERVER}api/`
    });
    newInstance.interceptors.request.use(
        async (config) => {
            try {
                let date = new Date();
                const accessToken = user?.data.accessToken || localStorage.getItem("accessToken");
                if (!accessToken) {
                    return config;
                }
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
            } catch (e) {
                console.log(e);
            }

        },
        (err) => {
            return Promise.reject(err);
        }
    );
    return newInstance;
}; 