import { configureStore } from "@reduxjs/toolkit";
import idUploadReducer from "./idUploadSlice";
import stepReducer from "./stepSlice";

export const store = configureStore({
  reducer: {
    idUpload: idUploadReducer,
    step: stepReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// This file should only be imported in Client Components or _app/layout files, not in Server Components.
