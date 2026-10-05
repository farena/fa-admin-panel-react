import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Credentials, User } from "../api/auth";

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<Credentials>) {
      state.user = action.payload.user ?? null;
      state.token = action.payload.token ?? null;
    },
    clearSession(state) {
      state.user = null;
      state.token = null;
    },
  },
  selectors: {
    selectUser: (state) => state.user,
    selectToken: (state) => state.token,
    selectIsAuthenticated: (state) => !!state.token,
  },
});

export const { setCredentials, clearSession } = authSlice.actions;
export const { selectUser, selectToken, selectIsAuthenticated } =
  authSlice.selectors;

export default authSlice.reducer;
