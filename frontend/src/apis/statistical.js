const BASE_URL = process.env.REACT_APP_BASE_URL_SERVER;
export const getStatisticalCategoryProduct = async (accessToken, axiosJWT) => {
    return await axiosJWT.get(`${BASE_URL}api/statistical/category-product`, {
        headers: {
            token: `Bearer ${accessToken}`
        }
    });
}
export const getStatisticalInventory = async (accessToken, axiosJWT) => {
    return await axiosJWT.get(`${BASE_URL}api/statistical/inventory`, {
        headers: {
            token: `Bearer ${accessToken}`
        }
    });
}
export const getRevenueDaily = async (accessToken, axiosJWT) => {

    return await axiosJWT.get("statistical/revenue-daily", {
        headers: {
            token: `Bearer ${accessToken}`
        }
    })


}
export const getRevenueMonthly = async (accessToken, axiosJWT) => {

    return await axiosJWT.get("statistical/revenue-monthly", {
        headers: {
            token: `Bearer ${accessToken}`
        }
    })

}
export const getRevenueYearly = async (accessToken, axiosJWT, year) => {

    return await axiosJWT.get("statistical/revenue-yearly?year=" + year, {
        headers: {
            token: `Bearer ${accessToken}`
        }
    })

}