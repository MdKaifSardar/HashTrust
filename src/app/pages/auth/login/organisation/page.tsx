import OrgLoginForm from "@/components/OrgLoginForm";
import { ToastContainer } from "react-toastify";

export default function OrganisationLoginPage() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <ToastContainer />
      <OrgLoginForm />
    </div>
  );
}
