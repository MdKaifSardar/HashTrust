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

let adminInitialized = false;

function getOrInitAdminApp() {
  if (typeof window !== "undefined") return; // Never run admin SDK on client
  if (!adminInitialized && !admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
    adminInitialized = true;
  }
  return admin;
}

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
      idToken = await firebaseUser.getIdToken();
    } catch (err: any) {
      return { ok: false, message: "Failed to get authentication token." };
    }
    const db = getFirestore(firebaseApp);
    const q = query(
      collection(db, "organisations"),
      where("email", "==", email),
      where("role", "==", role)
    );
    const orgSnap = await getDocs(q);
    if (orgSnap.empty) {
      return {
        ok: false,
        message: "Organisation with this role not found in database.",
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
  sessionCookie: string,
  role = "organisation"
): Promise<{ ok: boolean; organisation?: any; message?: string }> {
  try {
    if (typeof window !== "undefined") {
      throw new Error("This function must be called from the server.");
    }
    const adminApp = getOrInitAdminApp();
    if (!adminApp) {
      return { ok: false, message: "Admin SDK not initialized. Server-side operation required." };
    }
    const adminAuth = adminApp.auth();
    const adminDb = adminApp.firestore();
    // Verify the session cookie
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    const uid = decodedToken.uid;
    // Fetch organisation data from Firestore
    const orgDocSnap = await adminDb
      .collection("organisations")
      .where("uid", "==", uid)
      .where("role", "==", role)
      .limit(1)
      .get();
    if (orgDocSnap.empty) {
      return { ok: false, message: "Organisation not found in database for this role." };
    }
    let organisation = orgDocSnap.docs[0].data();

    // Convert Firestore Timestamp fields to ISO strings
    if (organisation.createdAt && organisation.createdAt.toDate) {
      organisation.createdAt = organisation.createdAt.toDate().toISOString();
    }
    // Convert apiKeys array timestamps
    if (Array.isArray(organisation.apiKeys)) {
      organisation.apiKeys = organisation.apiKeys.map((key: any) => ({
        ...key,
        createdAt:
          key.createdAt && key.createdAt.toDate
            ? key.createdAt.toDate().toISOString()
            : key.createdAt,
      }));
    }

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