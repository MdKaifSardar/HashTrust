import crypto from "crypto";

export function generateUserDataHash(userData: any): string {
  // Remove sensitive fields if needed (e.g., password)
  const dataToHash = { ...userData };
  if ("password" in dataToHash) delete dataToHash.password;
  const jsonString = JSON.stringify(dataToHash);
  return crypto.createHash("sha256").update(jsonString).digest("hex");
}