"use client";
import SignUpFormComponent from "../../../../../components/SignUpFormComponent";
import { ToastContainer } from "react-toastify";

const SignUpPage: React.FC = () => {
  return (
    <div>
      <SignUpFormComponent />
      <ToastContainer />
    </div>
  );
};

export default SignUpPage;
