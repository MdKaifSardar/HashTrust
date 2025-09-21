"use server";

import * as admin from "firebase-admin";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  User as FirebaseUser,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";
import { getContract } from "@/utils/contract";
import { generateUserDataHash } from "@/utils/generateDataHash";
import { uploadHash } from "@/utils/uploadHash";

// Firebase config
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY!,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.FIREBASE_PROJECT_ID!,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.FIREBASE_APP_ID!,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID!,
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

export interface UserImageCloudinary {
  url: string;
  public_id: string;
}
export interface User {
  uid: string;
  name: string;
  emailAddress: string;
  userImage: UserImageCloudinary | null;
  phoneNumber?: string;
  userAddress?: string;
  dateOfBirth?: string;
  identityDocument?: UserImageCloudinary | null;
}

export interface CreateUserResult {
  user: User | null;
  idToken: string | null;
  error: string | null;
}

// Modified Cloudinary upload to extract public_id
async function uploadAndExtract(file: File, uploadPreset: string) {
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Failed to upload file to Cloudinary");
  }

  const data = await res.json();
  return {
    url: data.secure_url as string,
    public_id: data.public_id as string,
  };
}

export async function createUser(
  name: string,
  emailAddress: string,
  password: string,
  userImageFile?: File | string,
  phoneNumber?: string,
  userAddress?: string,
  dateOfBirth?: string,
  identityDocumentFile?: File | string,
  verificationStatus?: {
    faceLiveness?: { status: string; score: number | null };
    faceSimilarity?: { status: string; score: number | null };
    // add more if needed
  },
  role = "user" // default role
): Promise<CreateUserResult & { message?: string; hash?: string; blockchainTxHash?: string }> {
  try {
    // ✅ Convert base64 to File
    const base64ToFile = (base64: string, filename: string): File => {
      const arr = base64.split(",");
      const mime = arr[0].match(/:(.*?);/)?.[1] || "application/octet-stream";
      const bstr = atob(arr[1]);
      const u8arr = new Uint8Array(bstr.length);
      for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
      return new File([u8arr], filename, { type: mime });
    };

    // ✅ Step 1: Create Firebase Auth user
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(
        auth,
        emailAddress,
        password
      );
    } catch (err: any) {
      if (err?.code === "auth/email-already-in-use") {
        return {
          user: null,
          idToken: null,
          error: "This email is already registered. Please use another email or log in.",
          message: "This email is already registered. Please use another email or log in.",
        };
      }
      return {
        user: null,
        idToken: null,
        error: err?.message || "Failed to create user.",
        message: err?.message || "Failed to create user.",
      };
    }
    const firebaseUser: FirebaseUser = userCredential.user;

    // Step 2: Prepare files for Cloudinary
    const userImageFileObj =
      typeof userImageFile === "string" && userImageFile.startsWith("data:")
        ? base64ToFile(userImageFile, "user-image.jpg")
        : userImageFile instanceof File
        ? userImageFile
        : undefined;

    let identityDocumentFileObj: File | undefined = undefined;
    if (identityDocumentFile) {
      if (typeof identityDocumentFile === "string") {
        if (identityDocumentFile.startsWith("data:")) {
          identityDocumentFileObj = base64ToFile(
            identityDocumentFile,
            "identity-document.jpg"
          );
        }
      } else if (identityDocumentFile instanceof File) {
        identityDocumentFileObj = identityDocumentFile;
      }
    }

    let userImageUrl: string | undefined;
    let userImagePublicId: string | undefined;
    let identityDocumentUrl: string | undefined;
    let identityDocumentPublicId: string | undefined;

    // Step 3: Upload user image to Cloudinary
    if (userImageFileObj) {
      try {
        const result = await uploadAndExtract(userImageFileObj, "user_images");
        userImageUrl = result.url;
        userImagePublicId = result.public_id;
      } catch (err: any) {
        return {
          user: null,
          idToken: null,
          error: "Failed to upload user image: " + (err.message || "Unknown error"),
          message: "User image upload failed. Please try again.",
        };
      }
    } else {
      return {
        user: null,
        idToken: null,
        error: "User image not provided or invalid.",
        message: "User image is required.",
      };
    }

    // Step 4: Upload identity document to Cloudinary
    if (identityDocumentFileObj) {
      try {
        const result = await uploadAndExtract(
          identityDocumentFileObj,
          "identity_documents"
        );
        identityDocumentUrl = result.url;
        identityDocumentPublicId = result.public_id;
      } catch (err: any) {
        return {
          user: null,
          idToken: null,
          error: "Failed to upload identity document: " + (err.message || "Unknown error"),
          message: "Identity document upload failed. Please try again.",
        };
      }
    } else {
      return {
        user: null,
        idToken: null,
        error: "Identity document not provided or invalid.",
        message: "Identity document is required.",
      };
    }

    // Step 5: Update Firebase Auth profile
    try {
      await updateProfile(firebaseUser, {
        displayName: name,
        photoURL: userImageUrl,
      });
    } catch (err: any) {
      return {
        user: null,
        idToken: null,
        error: "Failed to update user profile: " + (err.message || "Unknown error"),
        message: "Failed to update user profile.",
      };
    }

    // Step 6: Get ID token
    let idToken: string | null = null;
    try {
      idToken = await firebaseUser.getIdToken();
    } catch (err: any) {
      return {
        user: null,
        idToken: null,
        error: "Failed to get authentication token: " + (err.message || "Unknown error"),
        message: "Failed to get authentication token.",
      };
    }

    // Step 7: Save user data in Firestore
    const db = getFirestore(firebaseApp);
    // Step 8: Generate hash of user data
    const userDataHash = generateUserDataHash({
      uid: firebaseUser.uid,
      name,
      emailAddress,
      userImage:
        userImageUrl && userImagePublicId
          ? { url: userImageUrl, public_id: userImagePublicId }
          : null,
      phoneNumber,
      userAddress,
      dateOfBirth,
      identityDocument:
        identityDocumentUrl && identityDocumentPublicId
          ? { url: identityDocumentUrl, public_id: identityDocumentPublicId }
          : null,
      verificationStatus: verificationStatus || null,
      createdAt: new Date().toISOString(),
    });
    const userDoc = {
      uid: firebaseUser.uid,
      name,
      emailAddress,
      userImage:
        userImageUrl && userImagePublicId
          ? { url: userImageUrl, public_id: userImagePublicId }
          : null,
      phoneNumber,
      userAddress,
      dateOfBirth,
      identityDocument:
        identityDocumentUrl && identityDocumentPublicId
          ? { url: identityDocumentUrl, public_id: identityDocumentPublicId }
          : null,
      verificationStatus: verificationStatus || null, // <-- save verification status object
      createdAt: new Date().toISOString(),
      hash: userDataHash, // <-- save the hash in the user document
      role, // <-- save role
    };

    try {
      await addDoc(collection(db, "users"), userDoc);
    } catch (err: any) {
      return {
        user: null,
        idToken,
        error: "Failed to save user data to Firestore: " + (err.message || "Unknown error"),
        message: "Failed to save user data. Please try again.",
      };
    }

    // Step 9: Save hash to blockchain using uploadHash utility
    const blockchainResult = await uploadHash(userDataHash);

    // Step 10: Return success
    return {
      user: {
        uid: firebaseUser.uid,
        name,
        emailAddress,
        userImage:
          userImageUrl && userImagePublicId
            ? { url: userImageUrl, public_id: userImagePublicId }
            : null,
        phoneNumber,
        userAddress,
        dateOfBirth,
        identityDocument:
          identityDocumentUrl && identityDocumentPublicId
            ? { url: identityDocumentUrl, public_id: identityDocumentPublicId }
            : null,
      },
      idToken,
      error: blockchainResult.success ? null : blockchainResult.error || null,
      message: blockchainResult.success
        ? "User created, data saved, and hash uploaded to blockchain! " + (blockchainResult.message || "")
        : "User created and data saved, but failed to upload hash to blockchain. " + (blockchainResult.message || ""),
      hash: userDataHash,
      blockchainTxHash: blockchainResult.txHash,
    };
  } catch (err: any) {
    let errorMsg = err?.message || "Unknown error occurred";
    if (
      typeof err?.message === "string" &&
      (err.message.includes("PERMISSION_DENIED") ||
        err.message.includes("Missing or insufficient permissions"))
    ) {
      errorMsg =
        "Firestore permission denied. Please check your Firestore security rules to allow writing to the 'users' collection.";
    }
    return {
      user: null,
      idToken: null,
      error: errorMsg,
      message: errorMsg,
    };
  }
}

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

export async function authenticateUserWithIdToken(idToken: string, role = "user") {
  try {
    if (typeof window !== "undefined") {
      throw new Error("This function must be called from the server.");
    }

    const adminApp = getOrInitAdminApp();
    if (!adminApp) {
      throw new Error(
        "Admin SDK not initialized. This function must be called from the server."
      );
    }
    const adminAuth = adminApp.auth();
    const adminDb = adminApp.firestore();

    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Fetch user data from Firestore
    const userDocSnap = await adminDb
      .collection("users")
      .where("uid", "==", uid)
      .where("role", "==", role) // <-- check role
      .limit(1)
      .get();

    if (userDocSnap.empty) {
      return { ok: false, error: "User not found in database for this role." };
    }

    const userData = userDocSnap.docs[0].data();

    return {
      ok: true,
      user: userData,
      message: "User authenticated successfully.",
    };
  } catch (err: any) {
    let errorMsg = err?.message || "Authentication failed.";
    if (err?.code === "auth/argument-error") {
      errorMsg = "Invalid or expired token.";
    }
    return { ok: false, error: errorMsg };
  }
}

// Fetch all users from Firestore, requires admin privileges and a valid idToken
export async function fetchAllUsersWithIdToken(idToken: string, role = "user") {
  try {
    // Only run admin SDK code on server
    if (typeof window !== "undefined") {
      throw new Error("This function must be called from the server.");
    }
    getOrInitAdminApp();
    const adminAuth = getAdminAuth();
    const adminDb = getAdminFirestore();

    // Verify the ID token and get the user's UID
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Fetch only the user document for this UID and role
    const userDocSnap = await adminDb
      .collection("users")
      .where("uid", "==", uid)
      .where("role", "==", role) // <-- check role
      .limit(1)
      .get();

    if (userDocSnap.empty) {
      return {
        ok: false,
        error: "User not found in database for this role.",
        user: null,
      };
    }

    // Exclude password field if present
    const userData = userDocSnap.docs[0].data();
    if ("password" in userData) {
      delete userData.password;
    }

    return {
      ok: true,
      user: userData,
      message: "Fetched user successfully.",
    };
  } catch (err: any) {
    let errorMsg = err?.message || "Failed to fetch user.";
    if (err?.code === "auth/argument-error") {
      errorMsg = "Invalid or expired token.";
    }
    return {
      ok: false,
      error: errorMsg,
      user: null,
    };
  }
}

export async function loginUser(
  email: string,
  password: string,
  role = "user" // default role
): Promise<{ ok: boolean; idToken?: string; error?: string; message?: string }> {
  try {
    // 1. Find user in Firestore by email and role
    const adminDb = getAdminFirestore();
    const userSnap = await adminDb.collection("users")
      .where("emailAddress", "==", email)
      .where("role", "==", role)
      .limit(1)
      .get();
    if (userSnap.empty) {
      return {
        ok: false,
        error: "No user found with this email and role.",
        message: "No user found with this email and role.",
      };
    }
    const userData = userSnap.docs[0].data();

    // 2. Use the saved hash from Firestore
    const userDataHash = userData.hash;
    if (!userDataHash) {
      return {
        ok: false,
        error: "No hash found for this user in Firestore.",
        message: "No hash found for this user. Please contact support.",
      };
    }

    // 3. Check hash on blockchain
    const contract = getContract();
    const hashExists = await contract.verifyHash(userDataHash);
    if (!hashExists) {
      return {
        ok: false,
        error: "User data hash not found on blockchain. Cannot login.",
        message: "User data hash not found on blockchain. Please contact support.",
      };
    }

    // 4. Proceed to Firebase Auth login
    let userCredential;
    try {
      userCredential = await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      // Always return a generic message for incorrect credentials
      return {
        ok: false,
        error: "Incorrect credentials.",
        message: "Incorrect credentials.",
      };
    }
    const firebaseUser = userCredential.user;
    const idToken = await firebaseUser.getIdToken();
    return {
      ok: true,
      idToken,
      message: "Login successful! Redirecting to your dashboard...",
    };
  } catch (err: any) {
    return {
      ok: false,
      error: "Server error. Please try again later.",
      message: "Server error. Please try again later.",
    };
  }
}
