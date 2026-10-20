import { Suspense } from "react";
import OrgLoginForm from "@/components/OrgLoginForm";
import Loader from "@/components/Loader";

export default function OrganisationLoginPage() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-auth-gradient dark:bg-slate-950 transition-colors duration-200 relative">
      <Suspense fallback={<Loader />}>
        <OrgLoginForm />
      </Suspense>
    </div>
  );
}
