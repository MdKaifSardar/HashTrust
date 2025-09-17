import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FaceSimilarityCheckState {
  idFaceImage: string | null;
  userFaceImage: string | null;
  similarityScore: number | null;
  isMatch: boolean | null;
  loading: boolean;
  error: string | null;
  apiResult: any; // <-- add this
  hasChecked: boolean; // <-- add this
}

const initialState: FaceSimilarityCheckState = {
  idFaceImage: null,
  userFaceImage: null,
  similarityScore: null,
  isMatch: null,
  loading: false,
  error: null,
  apiResult: null, // <-- add this
  hasChecked: false, // <-- add this
};

const faceSimilarityCheckSlice = createSlice({
  name: "faceSimilarityCheck",
  initialState,
  reducers: {
    setIdFaceImage(state, action: PayloadAction<string | null>) {
      state.idFaceImage = action.payload;
    },
    setUserFaceImage(state, action: PayloadAction<string | null>) {
      state.userFaceImage = action.payload;
    },
    setSimilarityResult(state, action: PayloadAction<{ score: number; isMatch: boolean }>) {
      state.similarityScore = action.payload.score;
      state.isMatch = action.payload.isMatch;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setApiResult(state, action: PayloadAction<any>) { // <-- add this
      state.apiResult = action.payload;
    },
    setHasChecked(state, action: PayloadAction<boolean>) { // <-- add this
      state.hasChecked = action.payload;
    },
    resetFaceSimilarityCheck(state) {
      // state.idFaceImage = null;
      // state.userFaceImage = null;
      state.similarityScore = null;
      state.isMatch = null;
      state.loading = false;
      state.error = null;
      state.apiResult = null; // <-- reset this
      state.hasChecked = false; // <-- reset this
    },
  },
});

export const {
  setIdFaceImage,
  setUserFaceImage,
  setSimilarityResult,
  setLoading,
  setError,
  setApiResult, // <-- export this
  setHasChecked, // <-- export this
  resetFaceSimilarityCheck,
} = faceSimilarityCheckSlice.actions;

export const selectFaceSimilarityCheck = (state: { faceSimilarityCheck: FaceSimilarityCheckState }) =>
  state.faceSimilarityCheck;

export default faceSimilarityCheckSlice.reducer;
