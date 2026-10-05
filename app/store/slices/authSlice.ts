import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Credentials, User } from "../api/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  // False until the app has tried to restore a previous session from the
  // refresh token cookie, so layouts don't redirect before knowing
  sessionChecked: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  sessionChecked: false,
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
    markSessionChecked(state) {
      state.sessionChecked = true;
    },
  },
  selectors: {
    selectUser: (state) => state.user,
    selectToken: (state) => state.token,
    selectIsAuthenticated: (state) => !!state.token,
    selectSessionChecked: (state) => state.sessionChecked,
  },
});

export const { setCredentials, clearSession, markSessionChecked } =
  authSlice.actions;
export const {
  selectUser,
  selectToken,
  selectIsAuthenticated,
  selectSessionChecked,
} = authSlice.selectors;

export default authSlice.reducer;
