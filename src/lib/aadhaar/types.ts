// UIDAI Secure QR Code specification types and constants

export interface AadhaarSecureQRData {
  referenceId: string;
  name: string;
  dob: string;
  gender: string;
  careOf?: string;
  district?: string;
  landmark?: string;
  house?: string;
  location?: string;
  postOffice?: string;
  state?: string;
  street?: string;
  subDistrict?: string;
  vtc?: string;
  pinCode?: string;
  photoBase64?: string;
  rawSignatureHex?: string;
  isSignatureVerified: boolean;
  signatureError?: string;
}

export interface AadhaarCrossMatchResult {
  isAuthentic: boolean;
  isTampered: boolean;
  nameMatch: boolean;
  dobMatch: boolean;
  genderMatch?: boolean;
  photoVerified: boolean;
  visualData: {
    name?: string;
    dob?: string;
    idNumber?: string;
  };
  qrData?: AadhaarSecureQRData;
  discrepancies: string[];
}
