"use client";
import OrgDashboardComp from "@/components/OrgDashComp";
import { ToastContainer } from "react-toastify";

export default function OrgDashboardPage() {
  return (
    <div>
      <ToastContainer />
      <OrgDashboardComp />
    </div>
  );
}
