import OrgLoginForm from "@/components/OrgLoginForm";
import { ToastContainer } from "react-toastify";

export default function OrganisationLoginPage() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-auth-gradient dark:bg-slate-950 transition-colors duration-200 relative">
      <ToastContainer />
      <OrgLoginForm />
    </div>
  );
}
