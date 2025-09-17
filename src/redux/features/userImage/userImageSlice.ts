import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserImageState {
  image: string | null; // single image (base64 or object URL)
  userImagePreview?: string; // <-- add this
  latestUserImagePreview?: string; // <-- add this
  faceLiveness: boolean | null;
  faceLivenessScore: number | null;
}

const initialState: UserImageState = {
  image: null,
  userImagePreview: undefined, // <-- add this
  latestUserImagePreview: undefined, // <-- add this
  faceLiveness: null,
  faceLivenessScore: null,
};

const userImageSlice = createSlice({
  name: "userImage",
  initialState,
  reducers: {
    setImage(state, action: PayloadAction<string>) {
      state.image = action.payload;
    },
    setUserImagePreview(state, action: PayloadAction<string | undefined>) { // <-- add this
      state.userImagePreview = action.payload;
    },
    setLatestUserImagePreview(state, action: PayloadAction<string | undefined>) { // <-- add this
      state.latestUserImagePreview = action.payload;
    },
    setFaceLiveness(state, action: PayloadAction<{ isLive: boolean; score: number }>) {
      state.faceLiveness = action.payload.isLive;
      state.faceLivenessScore = action.payload.score;
    },
    resetImages(state) {
      state.image = null;
      state.userImagePreview = undefined; // <-- reset this
      state.latestUserImagePreview = undefined; // <-- reset this
      state.faceLiveness = null;
      state.faceLivenessScore = null;
    },
  },
});

export const { setImage, setUserImagePreview, setLatestUserImagePreview, setFaceLiveness, resetImages } = userImageSlice.actions;
export const selectUserImage = (state: { userImage: UserImageState }) => state.userImage.image;
export const selectUserImagePreview = (state: { userImage: UserImageState }) => state.userImage.userImagePreview;
export const selectLatestUserImagePreview = (state: { userImage: UserImageState }) => state.userImage.latestUserImagePreview; // <-- selector
export const selectFaceLiveness = (state: { userImage: UserImageState }) => state.userImage.faceLiveness;
export const selectFaceLivenessScore = (state: { userImage: UserImageState }) => state.userImage.faceLivenessScore;
export default userImageSlice.reducer;
