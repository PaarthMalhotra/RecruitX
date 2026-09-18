import { createSlice } from "@reduxjs/toolkit";

const savedRole = typeof window !== "undefined" ? (localStorage.getItem("recruitx_role") || localStorage.getItem("recruitech_role")) : null;

const initialState = {
  role: savedRole,
  details: null,
  isAuthenticated: !!savedRole,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
      if (action.payload) {
        localStorage.setItem("recruitx_role", action.payload);
        state.isAuthenticated = true;
      } else {
        localStorage.removeItem("recruitx_role");
        localStorage.removeItem("recruitech_role");
        state.isAuthenticated = false;
      }
    },
    setUserDetails: (state, action) => {
      state.details = action.payload;
      if (action.payload?.role) {
        state.role = action.payload.role;
        localStorage.setItem("recruitx_role", action.payload.role);
        state.isAuthenticated = true;
      }
    },
    logout: (state) => {
      state.role = null;
      state.details = null;
      state.isAuthenticated = false;
      localStorage.removeItem("recruitx_role");
      localStorage.removeItem("recruitech_role");
    },
  },
});

export const { setRole, setUserDetails, logout } = userSlice.actions;

export default userSlice.reducer;