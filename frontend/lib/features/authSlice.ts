import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type User = { _id: string; email: string; role: string };
interface AuthState {
    user: User | null;
    token: string | null;
    role: string | null;
}
const initialState: AuthState = {
    user: null,
    token: null,
    role: null
}
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.role = action.payload.user.role;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.role = null;
        },
        updateResturantMenu: (state, action) => {
            const { menuId, price } = action.payload;
            if (state.user && state.user.menu) {
                const menuItem = state.user.menu.find(item => item._id === menuId);
                if (menuItem) {
                    menuItem.price = price;
                }
            }
        }
    }
})

export const { setCredentials, logout,updateResturantMenu} = authSlice.actions;
export default authSlice.reducer;