"use server";

import * as admin from "firebase-admin";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firebaseApp } from "../database/firebase";

import { getOrInitAdminApp } from "@/lib/database/AdminApp";

export async function createOrganisation({
  orgName,
  email,
  password,
  contactPerson,
  role = "organisation",
}: {
  orgName: string;
  email: string;
  password: string;
  contactPerson: string;
  role?: string;
}): Promise<{ ok: boolean; message: string; sessionCookie?: string }> {
  try {
    getOrInitAdminApp(); // <-- Ensure Admin SDK is initialized at the start
    if (!orgName || !email || !password || !contactPerson) {
      return { ok: false, message: "All fields are required." };
    }
    const auth = getAuth(firebaseApp);
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
    } catch (err: any) {
      if (err?.code === "auth/email-already-in-use") {
        return {
          ok: false,
          message:
            "This email is already registered. Please use another email or log in.",
        };
      }
      return {
        ok: false,
        message: err?.message || "Failed to create organisation account.",
      };
    }
    const firebaseUser = userCredential.user;
    let idToken: string | undefined;
    try {
      await updateProfile(firebaseUser, { displayName: orgName });
      idToken = await firebaseUser.getIdToken();
      // Set custom claim for role
      const adminApp = getOrInitAdminApp();
      if (adminApp) {
        const adminAuth = adminApp.auth();
        await adminAuth.setCustomUserClaims(firebaseUser.uid, { role });
      }
    } catch (err: any) {
      return {
        ok: false,
        message: "Failed to update organisation profile or get token.",
      };
    }
    const db = getFirestore(firebaseApp);
    const orgDoc = {
      uid: firebaseUser.uid,
      orgName,
      email,
      contactPerson,
      createdAt: new Date().toISOString(),
      role, // <-- save role
    };
    try {
      await addDoc(collection(db, "organisations"), orgDoc);
    } catch (err: any) {
      return {
        ok: false,
        message: "Failed to save organisation data. Please try again.",
      };
    }

    // Create session cookie
    const adminApp = getOrInitAdminApp();
    if (!adminApp) {
      return {
        ok: false,
        message: "Admin SDK not initialized. Server-side operation required.",
      };
    }
    const adminAuth = adminApp.auth();
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    // Re-fetch ID token to ensure custom claims are present
    if (idToken) {
      idToken = await firebaseUser.getIdToken(true);
    }
    const sessionCookie = await adminAuth.createSessionCookie(idToken!, {
      expiresIn,
    });

    // Return session cookie (to be set in HTTP-only cookie by API route)
    return {
      ok: true,
      message: "Organisation account created successfully!",
      sessionCookie,
    };
  } catch (err: any) {
    return {
      ok: false,
      message: err?.message || "Server error. Please try again later.",
    };
  }
}

export async function loginOrganisation({
  email,
  password,
  role = "organisation",
}: {
  email: string;
  password: string;
  role?: string;
}): Promise<{ ok: boolean; message: string; sessionCookie?: string }> {
  try {
    getOrInitAdminApp(); // <-- Ensure Admin SDK is initialized at the start
    if (!email || !password) {
      return { ok: false, message: "Email and password are required." };
    }
    // Use firebaseApp for client-side auth
    const auth = getAuth(firebaseApp);
    let userCredential;
    try {
      userCredential = await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      if (
        err?.code === "auth/user-not-found" ||
        err?.code === "auth/wrong-password"
      ) {
        return { ok: false, message: "Invalid email or password." };
      }
      return { ok: false, message: err?.message || "Failed to login." };
    }
    const firebaseUser = userCredential.user;
    let idToken: string | undefined;
    try {
      const adminApp = getOrInitAdminApp();
      if (adminApp) {
        const adminAuth = adminApp.auth();
        await adminAuth.setCustomUserClaims(firebaseUser.uid, { role });
      }
      idToken = await firebaseUser.getIdToken(true);
    } catch (err: any) {
      return { ok: false, message: "Failed to get authentication token." };
    }
    const db = getFirestore(firebaseApp);
    const q = query(
      collection(db, "organisations"),
      where("email", "==", email)
    );
    const orgSnap = await getDocs(q);
    if (orgSnap.empty) {
      return {
        ok: false,
        message: "Organisation with this email not found in database.",
      };
    }
    const orgData = orgSnap.docs[0].data();
    if (orgData.role && orgData.role !== role) {
      return {
        ok: false,
        message: "Account not registered as an organisation.",
      };
    }

    // Use admin SDK for session cookie creation
    const adminApp = getOrInitAdminApp();
    if (!adminApp) {
      return {
        ok: false,
        message: "Admin SDK not initialized. Server-side operation required.",
      };
    }
    const adminAuth = adminApp.auth();
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken!, {
      expiresIn,
    });

    return { ok: true, message: "Organisation login successful!", sessionCookie };
  } catch (err: any) {
    return {
      ok: false,
      message: err?.message || "Server error. Please try again later.",
    };
  }
}

export async function authenticateOrgWithSessionCookie(
  sessionCookie?: string
): Promise<{ ok: boolean; organisation?: any; message?: string }> {
  try {
    getOrInitAdminApp(); // <-- Ensure Admin SDK is initialized at the start
    const adminApp = getOrInitAdminApp();
    if (!adminApp) {
      return { ok: false, message: "Admin SDK not initialized. Server-side operation required." };
    }
    const adminAuth = adminApp.auth();
    const adminDb = adminApp.firestore();

    let cookie = sessionCookie;
    if (!cookie) {
      try {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        cookie = cookieStore.get("session")?.value;
      } catch (e) {
        // Not in server request context
      }
    }

    if (!cookie) {
      return { ok: false, message: "No session cookie found. Please log in." };
    }

    // Verify the session cookie with fallback to ID token verification
    const cleanCookie = typeof cookie === "string"
      ? decodeURIComponent(cookie).trim().replace(/^["']|["']$/g, "")
      : cookie;

    let decodedToken: any;
    try {
      decodedToken = await adminAuth.verifySessionCookie(cleanCookie, false);
    } catch (cookieErr: any) {
      console.warn("verifySessionCookie failed, trying verifyIdToken fallback:", cookieErr?.code, cookieErr?.message);
      try {
        decodedToken = await adminAuth.verifyIdToken(cleanCookie, false);
      } catch (idTokenErr: any) {
        console.error("Both verifySessionCookie and verifyIdToken failed:", {
          sessionErr: cookieErr?.message,
          sessionCode: cookieErr?.code,
          idErr: idTokenErr?.message,
          idCode: idTokenErr?.code,
          cookieLength: cleanCookie?.length,
        });
        return {
          ok: false,
          message: `Invalid or expired session cookie (${cookieErr?.code || "AUTH_ERROR"}): ${cookieErr?.message || "Verification failed"}`,
        };
      }
    }

    const uid = decodedToken.uid;
    const tokenRole = decodedToken.role;

    if (tokenRole && tokenRole !== "organisation") {
      return { ok: false, message: `Access denied. Account has role '${tokenRole}', not 'organisation'.` };
    }

    // Fetch organisation data from Firestore using UID
    let orgDocSnap = await adminDb
      .collection("organisations")
      .where("uid", "==", uid)
      .limit(1)
      .get();

    let organisation: any = null;
    let docRef: any = null;
    if (!orgDocSnap.empty) {
      docRef = orgDocSnap.docs[0].ref;
      organisation = orgDocSnap.docs[0].data();
    } else {
      const directDoc = await adminDb.collection("organisations").doc(uid).get();
      if (directDoc.exists) {
        docRef = directDoc.ref;
        organisation = directDoc.data();
      } else if (decodedToken.email) {
        const emailSnap = await adminDb
          .collection("organisations")
          .where("email", "==", decodedToken.email)
          .limit(1)
          .get();
        if (!emailSnap.empty) {
          docRef = emailSnap.docs[0].ref;
          organisation = emailSnap.docs[0].data();
          try {
            await docRef.update({ uid });
          } catch (e) {}
        }
      }
    }

    if (!organisation) {
      return { ok: false, message: "Organisation not found in database for this account." };
    }

    const orgRole = organisation.role || "organisation";
    if (orgRole !== "organisation") {
      return { ok: false, message: "Account is registered as a user, not an organisation." };
    }

    // Backfill custom claims in auth if not yet present
    if (!tokenRole || tokenRole !== "organisation") {
      try {
        await adminAuth.setCustomUserClaims(uid, { role: "organisation" });
      } catch (e) {
        // Non-blocking
      }
    }

    // Convert Firestore Timestamp fields to ISO strings
    if (organisation.createdAt) {
      if (organisation.createdAt.toDate && typeof organisation.createdAt.toDate === "function") {
        organisation.createdAt = organisation.createdAt.toDate().toISOString();
      } else if (typeof organisation.createdAt === "object" && organisation.createdAt._seconds) {
        organisation.createdAt = new Date(organisation.createdAt._seconds * 1000).toISOString();
      }
    }
    // Convert apiKeys array timestamps
    if (Array.isArray(organisation.apiKeys)) {
      organisation.apiKeys = organisation.apiKeys.map((key: any) => {
        let keyDate = key.createdAt;
        if (keyDate) {
          if (keyDate.toDate && typeof keyDate.toDate === "function") {
            keyDate = keyDate.toDate().toISOString();
          } else if (typeof keyDate === "object" && keyDate._seconds) {
            keyDate = new Date(keyDate._seconds * 1000).toISOString();
          }
        }
        return {
          ...key,
          createdAt: keyDate || null,
        };
      });
    }

    // Sanitize to plain object for server action return
    organisation = JSON.parse(JSON.stringify(organisation));

    return {
      ok: true,
      organisation,
      message: "Organisation authenticated successfully.",
    };
  } catch (err: any) {
    let errorMsg = err?.message || "Authentication failed.";
    return { ok: false, message: errorMsg };
  }
}