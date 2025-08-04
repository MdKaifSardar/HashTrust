import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface StepState {
  currentStep: number;
}

const initialState: StepState = {
  currentStep: 0,
};

const stepSlice = createSlice({
  name: "step",
  initialState,
  reducers: {
    setCurrentStep(state, action: PayloadAction<number>) {
      state.currentStep = action.payload;
    },
    resetStep(state) {
      state.currentStep = 0;
    },
  },
});

export const { setCurrentStep, resetStep } = stepSlice.actions;
export const selectCurrentStep = (state: { step: StepState }) => state.step.currentStep;
export default stepSlice.reducer;
