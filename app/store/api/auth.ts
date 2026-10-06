import { api, refreshSession } from ".";
import {
  clearSession,
  markSessionChecked,
  setCredentials,
} from "../slices/authSlice";

export interface User {
  user_id: number;
  name: string;
  email: string;
  role: string;
}

export interface Credentials {
  user: User;
  token: string;
}

export interface LoginForm {
  email: string;
  password: string;
  // The backend uses it to decide if the refresh token cookie is persistent
  // (e.g. 30 days) or a session cookie removed when the browser closes
  remember: boolean;
}

// Mock authentication for demo purposes
const MOCK_AUTH = import.meta.env.VITE_MOCK_AUTH === "true";

const MOCK_CREDENTIALS: Credentials = {
  user: {
    user_id: 1,
    name: "admin",
    email: "admin@test.com",
    role: "admin",
  },
  token: "jwt_token_123",
};

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<Credentials, LoginForm>({
      queryFn: async (form, _api, _extraOptions, baseQuery) => {
        if (MOCK_AUTH) return { data: MOCK_CREDENTIALS };

        const result = await baseQuery({
          url: "login",
          method: "POST",
          body: form,
        });
        if (result.error) return { error: result.error };
        return { data: result.data as Credentials };
      },
      async onQueryStarted(_form, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch {
          // Already notified by the base query
        }
      },
    }),

    logout: build.mutation<void, void>({
      // The refresh token cookie is httpOnly, only the backend can remove it
      queryFn: async (_arg, _api, _extraOptions, baseQuery) => {
        if (!MOCK_AUTH) await baseQuery({ url: "logout", method: "POST" });
        // The session is cleared even if the backend call failed
        return { data: undefined };
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(clearSession());
        // Drop every cached response of the previous user
        dispatch(api.util.resetApiState());
      },
    }),

    // Called once on app start: restores the session from the refresh token
    // cookie, if the user logged in before with "Remember me"
    restoreSession: build.mutation<boolean, void>({
      queryFn: async (_arg, baseQueryApi) => ({
        data: await refreshSession(baseQueryApi),
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(markSessionChecked());
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRestoreSessionMutation,
} = authApi;
