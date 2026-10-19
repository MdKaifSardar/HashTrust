"use client";
import React, { useEffect, useState } from "react";
import { authenticateUserWithSessionCookie } from "@/lib/actions/user.actions";
import Loader from "@/components/Loader";
import { toast, ToastContainer } from "react-toastify";

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const verifyUser = async () => {
      setLoading(true);
      setAuthError(null);
      try {
        // Get session cookie from browser if available
        const sessionCookie = document.cookie
          .split(";")
          .map((row) => row.trim())
          .find((row) => row.startsWith("session="))
          ?.slice("session=".length);

        // Fetch the user using the session cookie or server HTTP cookie fallback
        const userRes = await authenticateUserWithSessionCookie(sessionCookie);
        if (userRes.ok && userRes.user) {
          setUser(userRes.user);
        } else {
          setUser(null);
          const errorMsg = userRes.message || "Failed to fetch user details.";
          setAuthError(errorMsg);
          toast.error(errorMsg);
        }
      } catch (e: any) {
        const errorMsg = e?.message || "Authentication failed.";
        setUser(null);
        setAuthError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors p-4">
        <ToastContainer />
        <div className="text-xl text-red-600 dark:text-red-400 font-semibold mb-2">
          Not authenticated
        </div>
        {authError && (
          <div className="text-xs sm:text-sm text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950/50 border border-red-300 dark:border-red-900 rounded-lg px-4 py-2 mb-4 max-w-md text-center font-mono">
            {authError}
          </div>
        )}
        <div className="text-gray-600 dark:text-slate-300 mb-2">
          Please{" "}
          <a
            href="/pages/auth/sign-up/user"
            className="text-blue-600 dark:text-cyan-400 underline font-semibold"
          >
            sign up
          </a>{" "}
          or{" "}
          <a
            href="/pages/auth/login/user"
            className="text-blue-600 dark:text-cyan-400 underline font-semibold"
          >
            log in
          </a>{" "}
          to access your dashboard.
        </div>
      </div>
    );
  }

  // Parse address if it's a JSON string
  let address = user.userAddress;
  try {
    if (typeof address === "string") {
      address = JSON.parse(address);
    }
  } catch {
    // leave as is
  }

  return (
    <>
      <ToastContainer />
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors py-10 px-4">
        <div className="w-full sm:w-full md:max-w-3xl mx-auto rounded-xl shadow-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-0 overflow-hidden transition-colors">
          <div className="flex flex-col md:flex-row">
            {/* Left: User Image */}
            <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-slate-800/60 px-8 py-10 md:w-1/3 border-b md:border-b-0 md:border-r border-gray-200 dark:border-slate-800 transition-colors">
              <div className="mb-4">
                {user.userImage && user.userImage.url ? (
                  <img
                    src={user.userImage.url}
                    alt="User"
                    className="w-32 h-32 object-cover rounded-full border-4 border-blue-500 dark:border-cyan-500 shadow-md"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-gray-400 dark:text-slate-400 border-4 border-gray-300 dark:border-slate-600">
                    No Image
                  </div>
                )}
              </div>
              <div className="text-lg font-bold text-blue-700 dark:text-slate-100">{user.name}</div>
              <div className="text-gray-500 dark:text-slate-400 text-sm">{user.emailAddress}</div>
            </div>
            {/* Right: User Info */}
            <div className="flex-1 px-8 py-10">
              <h2 className="text-2xl font-bold text-blue-700 dark:text-cyan-400 mb-6 transition-colors">
                Profile Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <div className="text-gray-500 dark:text-slate-400 text-sm">Phone</div>
                  <div className="font-medium text-gray-800 dark:text-slate-200">
                    {user.phoneNumber || (
                      <span className="text-red-500">Not available</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-slate-400 text-sm">Date of Birth</div>
                  <div className="font-medium text-gray-800 dark:text-slate-200">
                    {user.dateOfBirth || (
                      <span className="text-red-500">Not available</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-slate-400 text-sm">Aadhaar Number</div>
                  <div className="font-medium text-gray-800 dark:text-slate-200">
                    {user.idNumber || (
                      <span className="text-red-500">Not available</span>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-gray-500 dark:text-slate-400 text-sm">Address</div>
                  <div className="font-medium text-gray-800 dark:text-slate-200">
                    {address && typeof address === "object" ? (
                      <span>
                        {address.po && <span>PO: {address.po}, </span>}
                        {address.district && (
                          <span>District: {address.district}, </span>
                        )}
                        {address.state && <span>State: {address.state}, </span>}
                        {address.pin && <span>Pin: {address.pin}</span>}
                      </span>
                    ) : (
                      <span className="text-red-500">Not available</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-slate-400 text-sm">Identity Document</div>
                  {user.identityDocument && user.identityDocument.url ? (
                    <img
                      src={user.identityDocument.url}
                      alt="Identity Document"
                      className="w-28 h-20 object-cover rounded border border-gray-200 dark:border-slate-700 mt-2 shadow-sm"
                    />
                  ) : (
                    <div className="text-red-500 mt-2">Not available</div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <div className="text-gray-500 dark:text-slate-400 text-sm mb-1">
                    Verification Status
                  </div>
                  <div className="flex flex-col gap-2">
                    {user.verificationStatus ? (
                      <>
                        <div>
                          <span className="font-semibold text-gray-700 dark:text-slate-300">Face Liveness:</span>{" "}
                          <span
                            className={
                              user.verificationStatus.faceLiveness?.status ===
                              "LIVE"
                                ? "text-green-600 dark:text-emerald-400 font-semibold"
                                : user.verificationStatus.faceLiveness
                                    ?.status === "NOT LIVE"
                                ? "text-red-600 dark:text-rose-400 font-semibold"
                                : "text-yellow-600 dark:text-amber-400 font-semibold"
                            }
                          >
                            {user.verificationStatus.faceLiveness?.status ||
                              "Not checked"}
                          </span>
                          {user.verificationStatus.faceLiveness?.score !==
                            null &&
                            user.verificationStatus.faceLiveness?.score !==
                              undefined && (
                              <span className="ml-2 text-xs text-gray-500 dark:text-slate-400">
                                (Score:{" "}
                                {user.verificationStatus.faceLiveness.score}/10)
                              </span>
                            )}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700 dark:text-slate-300">
                            Face Similarity:
                          </span>{" "}
                          <span
                            className={
                              user.verificationStatus.faceSimilarity?.status ===
                              "MATCH"
                                ? "text-green-600 dark:text-emerald-400 font-semibold"
                                : user.verificationStatus.faceSimilarity
                                    ?.status === "NO MATCH"
                                ? "text-red-600 dark:text-rose-400 font-semibold"
                                : "text-yellow-600 dark:text-amber-400 font-semibold"
                            }
                          >
                            {user.verificationStatus.faceSimilarity?.status ||
                              "Not checked"}
                          </span>
                          {user.verificationStatus.faceSimilarity?.score !==
                            null &&
                            user.verificationStatus.faceSimilarity?.score !==
                              undefined && (
                              <span className="ml-2 text-xs text-gray-500 dark:text-slate-400">
                                (Score:{" "}
                                {user.verificationStatus.faceSimilarity.score})
                              </span>
                            )}
                        </div>
                      </>
                    ) : (
                      <span className="text-yellow-600 dark:text-amber-400">
                        No verification data available.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
