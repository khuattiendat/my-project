import axios from "axios";

const URL_PROVINCE = "https://online-gateway.ghn.vn/shiip/public-api/master-data";
const TOKEN_PROVINCE = "36201674-df0a-11ee-8586-12380ed2f541";
export const getProvinces = async () => {
    const res = await axios.get(`${URL_PROVINCE}/province`, {
        headers: {
            Token: TOKEN_PROVINCE,
            "Content-Type": "application/json"
        }
    })
    return res.data.data;
}
export const getDistricts = async (provinceID) => {
    const res = await axios.get(`${URL_PROVINCE}/district`, {
        params: {
            province_id: provinceID
        },
        headers: {
            Token: TOKEN_PROVINCE,
            "Content-Type": "application/json"
        }
    })
    return res.data.data;
}
export const getWards = async (districtID) => {
    const res = await axios.get(`${URL_PROVINCE}/ward`, {
        params: {
            district_id: districtID
        },
        headers: {
            Token: TOKEN_PROVINCE,
            "Content-Type": "application/json"
        }
    })
    return res.data.data;
}