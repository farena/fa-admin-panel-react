import {
  configureStore,
  createListenerMiddleware,
  isAnyOf,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer, { clearSession, setCredentials } from "./slices/authSlice";
import { api } from "./api";
import { saveCredentials } from "./storage/credentialsStorage";

// Keeps the credentials in localStorage in sync with the auth slice
const credentialsListener = createListenerMiddleware();
credentialsListener.startListening({
  matcher: isAnyOf(setCredentials, clearSession),
  effect: (_action, listenerApi) => {
    const { user, token } = (listenerApi.getState() as RootState).auth;
    saveCredentials(user && token ? { user, token } : null);
  },
});

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Cache of every RTK Query endpoint
    [api.reducerPath]: api.reducer,
  },
  // Handles caching, invalidation and polling of the RTK Query endpoints
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(credentialsListener.middleware)
      .concat(api.middleware),
});

// Enables refetchOnFocus / refetchOnReconnect on the endpoints that use them
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
