import { configureStore } from "@reduxjs/toolkit";
import idUploadReducer from "./features/idUpload/idUploadSlice";
import stepReducer from "./features/signUpSteps/stepSlice";
import userDataReducer from "./features/userData/userDataSlice";
import userImageReducer from "./features/userImage/userImageSlice";

export const store = configureStore({
  reducer: {
    idUpload: idUploadReducer,
    step: stepReducer,
    userData: userDataReducer,
    userImage: userImageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// This file should only be imported in Client Components or _app/layout files, not in Server Components.
