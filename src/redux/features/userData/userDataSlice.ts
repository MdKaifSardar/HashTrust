import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserAddress {
  po: string | null;
  district: string | null;
  state: string | null;
  pin: string | null;
}

export interface UserDataState {
  name: string | null;
  dob: string | null;
  phone: string | null;
  address: UserAddress;
}

const initialState: UserDataState = {
  name: null,
  dob: null,
  phone: null,
  address: {
    po: null,
    district: null,
    state: null,
    pin: null,
  },
};

const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<UserDataState>) {
      state.name = action.payload.name;
      state.dob = action.payload.dob;
      state.phone = action.payload.phone;
      state.address = action.payload.address;
    },
    resetUserData(state) {
      state.name = null;
      state.dob = null;
      state.phone = null;
      state.address = {
        po: null,
        district: null,
        state: null,
        pin: null,
      };
    },
  },
});

export const { setUserData, resetUserData } = userDataSlice.actions;

export const selectUserData = (state: { userData: UserDataState }) => state.userData;

export default userDataSlice.reducer;
