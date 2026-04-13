import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:'user',
    initialState:{
        userData: [],
    },
    reducers:{
        setUserData: (state, action) => {
            state.userData = action.payload.user;
        }
    }
})

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;