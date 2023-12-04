import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    product: {
        listProduct: [],
    }
}
const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        getProduct: (state, action) => {
            state.product.listProduct = action.payload;
        }
    }
})
export const {
    getProductStart,
    getProduct,
    getProductFailed
} = productSlice.actions
export default productSlice.reducer;