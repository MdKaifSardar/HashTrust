import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserImageState {
  images: string[]; // base64 or object URLs
}

const initialState: UserImageState = {
  images: [],
};

const userImageSlice = createSlice({
  name: "userImage",
  initialState,
  reducers: {
    setImages(state, action: PayloadAction<string[]>) {
      state.images = action.payload;
    },
    resetImages(state) {
      state.images = [];
    },
  },
});

export const { setImages, resetImages } = userImageSlice.actions;
export const selectUserImages = (state: { userImage: UserImageState }) => state.userImage.images;
export default userImageSlice.reducer;
