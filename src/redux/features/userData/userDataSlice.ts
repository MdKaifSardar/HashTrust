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
  email?: string | null;
  address: UserAddress;
  password?: string | null;
  idNumber?: string | null; // Aadhaar number
}

const initialState: UserDataState = {
  name: null,
  dob: null,
  phone: null,
  email: null,
  address: {
    po: null,
    district: null,
    state: null,
    pin: null,
  },
  password: null,
  idNumber: null,
};

const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<Partial<UserDataState>>) {
      // Merge partial updates
      Object.assign(state, action.payload);
    },
    resetUserData(state) {
      state.name = null;
      state.dob = null;
      state.phone = null;
      state.email = null;
      state.address = {
        po: null,
        district: null,
        state: null,
        pin: null,
      };
      state.password = null;
      state.idNumber = null;
    },
  },
});

export const { setUserData, resetUserData } = userDataSlice.actions;

export const selectUserData = (state: { userData: UserDataState }) => state.userData;

export default userDataSlice.reducer;
