import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IdUploadState {
  identityDocumentFile?: File;
  faceImage?: string;
  extracting: boolean;
  extractError: string | null;
  previewUrl?: string;
  lastUploadedFile?: File;
}

const initialState: IdUploadState = {
  identityDocumentFile: undefined,
  faceImage: undefined,
  extracting: false,
  extractError: null,
  previewUrl: undefined,
  lastUploadedFile: undefined,
};

const idUploadSlice = createSlice({
  name: "idUpload",
  initialState,
  reducers: {
    setIdentityDocumentFile(state, action: PayloadAction<File | undefined>) {
      state.identityDocumentFile = action.payload;
    },
    setFaceImage(state, action: PayloadAction<string | undefined>) {
      state.faceImage = action.payload;
    },
    setExtracting(state, action: PayloadAction<boolean>) {
      state.extracting = action.payload;
    },
    setExtractError(state, action: PayloadAction<string | null>) {
      state.extractError = action.payload;
    },
    setPreviewUrl(state, action: PayloadAction<string | undefined>) {
      state.previewUrl = action.payload;
    },
    setLastUploadedFile(state, action: PayloadAction<File | undefined>) {
      state.lastUploadedFile = action.payload;
    },
    resetIdUpload(state) {
      state.identityDocumentFile = undefined;
      state.faceImage = undefined;
      state.extracting = false;
      state.extractError = null;
      state.previewUrl = undefined;
      state.lastUploadedFile = undefined;
    },
  },
});

export const {
  setIdentityDocumentFile,
  setFaceImage,
  setExtracting,
  setExtractError,
  setPreviewUrl,
  setLastUploadedFile,
  resetIdUpload,
} = idUploadSlice.actions;

// Selectors
export const selectIdentityDocumentFile = (state: {
  idUpload: IdUploadState;
}) => state.idUpload.identityDocumentFile;
export const selectFaceImage = (state: { idUpload: IdUploadState }) =>
  state.idUpload.faceImage;
export const selectExtracting = (state: { idUpload: IdUploadState }) =>
  state.idUpload.extracting;
export const selectExtractError = (state: { idUpload: IdUploadState }) =>
  state.idUpload.extractError;
export const selectPreviewUrl = (state: { idUpload: IdUploadState }) =>
  state.idUpload.previewUrl;
export const selectLastUploadedFile = (state: { idUpload: IdUploadState }) =>
  state.idUpload.lastUploadedFile;

export default idUploadSlice.reducer;
