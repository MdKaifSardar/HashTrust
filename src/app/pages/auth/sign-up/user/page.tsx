"use client";
import SignUpFormComponent from "../../../../../components/SignUpFormComponent";
import { ToastContainer } from "react-toastify";

const SignUpPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center w-full justify-center">
      <SignUpFormComponent />
      <ToastContainer />
    </div>
  );
};

export default SignUpPage;
