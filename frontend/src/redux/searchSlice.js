import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    user: [],
    product: [],
    order: [],
    isLoadingSearch: false
}
const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setSearchAll: (state, action) => {
            state.user = action.payload.user;
            state.product = action.payload.product;
            state.order = action.payload.order;
        },
        setIsLoadingSearch: (state, action) => {
            state.isLoadingSearch = action.payload;
        }
    }
})
export const {
    setSearchAll,
    setIsLoadingSearch
} = searchSlice.actions
export default searchSlice.reducer;