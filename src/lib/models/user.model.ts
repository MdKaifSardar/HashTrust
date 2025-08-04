export interface User {
  uid: string;
  name: string;
  emailAddress: string;
  userImage?: string; // URL to jpeg/jpg/png (visible user photo)
  phoneNumber?: string;
  userAddress?: string; // User's address
  dateOfBirth?: string; // User's date of birth
  identityDocument?: string; // URL to pdf/jpeg (Aadhaar card or similar)
}
