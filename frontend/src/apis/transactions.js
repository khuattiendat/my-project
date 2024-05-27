export const getAllTransaction = async (accessToken, page, q, axiosJWT) => {
    try {
        const res = await axiosJWT.get("transactions", {
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
export const getTransactionByUserId = async (accessToken, page, userId, axiosJWT) => {
    try {
        const res = await axiosJWT.get("transactions/users", {
            params: {
                userId,
                page
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
export const getLatestTransaction = async (accessToken, axiosJWT) => {
    try {
        const res = await axiosJWT.get("transactions/latest", {
            headers: {
                token: `Bearer ${accessToken}`
            }
        })
        return res.data.data;
    } catch (error) {
        console.log(error);
    }
}
export const getTransactionById = async (accessToken, id, axiosJWT) => {

    return await axiosJWT.get("transactions/" + id, {
        headers: {
            token: `Bearer ${accessToken}`
        }
    })

}
