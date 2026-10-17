# HashTrust: Decentralized Identity Verification & Fraud Prevention Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-3C3C3D?style=for-the-badge&logo=ethereum)](https://ethereum.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Admin%20%26%20Firestore-FFA611?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

## 📌 Executive Summary

**HashTrust** is an enterprise-grade, decentralized Identity Verification (KYC) and Anti-Fraud platform. It bridges artificial intelligence with decentralized ledger technology (DLT) to eliminate identity theft, document tampering, and biometric spoofing.

Sensitive identity records are never exposed in plain text on public ledgers. Instead, personal data is cryptographically hashed using **SHA-256** and anchored to the **Ethereum (Sepolia) blockchain** via an immutable smart contract. Verified users receive tamper-proof digital credentials, while registered enterprise organizations can authenticate and verify users programmatically via secure B2B API keys.

---

## 🏗️ System Architecture

The following diagram illustrates how user requests, AI inference engines, storage layers, and the blockchain ledger interact within HashTrust:

```mermaid
flowchart TD
    subgraph Client["Client Tier"]
        U["End User (KYC Applicant)"]
        ORG["Enterprise Organization"]
    end

    subgraph AppServer["Application Tier (Next.js 15 Fullstack)"]
        UI["React 19 & Tailwind UI / Redux Store"]
        SA["Server Actions & API Routes"]
        AUTH["Session & API Key Validator (Firebase Admin)"]
    end

    subgraph AIEngines["Multi-Modal AI Pipeline"]
        GEMINI["Google Gemini 2.5 Flash<br/>(Document OCR & Field Extraction)"]
        CLARIFAI["Clarifai Anti-Spoofing<br/>(Silent Face Liveness Detection)"]
        FACEPP["Face++ Biometric API<br/>(1:1 Facial Similarity Matching)"]
    end

    subgraph StorageLedger["Persistence & Ledger Tier"]
        CLOUDINARY["Cloudinary<br/>(Encrypted Media Storage)"]
        FIRESTORE["Firebase Firestore<br/>(User Data & Audit Logs)"]
        SEPOLIA["Ethereum Sepolia Testnet<br/>(HashStorage Smart Contract)"]
    end

    U -->|Uploads Document & Captures Selfie| UI
    ORG -->|API Requests with API Key| SA

    UI --> SA
    SA --> AUTH

    SA -->|Extract text from Aadhaar ID| GEMINI
    SA -->|Verify selfie liveness| CLARIFAI
    SA -->|Compare ID photo vs Selfie| FACEPP

    SA -->|Upload sanitized media| CLOUDINARY
    SA -->|Store profile & session| FIRESTORE
    SA -->|Commit SHA-256 hash| SEPOLIA
```

---

## 🔄 Core Workflows

### 1. Multi-Stage User KYC Onboarding Pipeline

The user verification journey uses a state-driven wizard managed by Redux Toolkit:

```mermaid
flowchart LR
    A["1. Upload ID<br/>(Aadhaar Card)"] --> B["2. Gemini OCR<br/>(Data Extraction)"]
    B --> C["3. Live Selfie<br/>(Clarifai Anti-Spoof)"]
    C --> D["4. Face Match<br/>(Similarity Check &gt;= 70%)"]
    D --> E["5. Set Credentials<br/>(Password Creation)"]
    E --> F["6. Blockchain Anchor<br/>(SHA-256 Hash on Sepolia)"]
    F --> G["7. Verified Identity<br/>(User Dashboard)"]

    style A fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#fff
    style B fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#fff
    style C fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#fff
    style D fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#fff
    style E fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#fff
    style F fill:#0f766e,stroke:#14b8a6,stroke-width:2px,color:#fff
    style G fill:#14532d,stroke:#22c55e,stroke-width:2px,color:#fff
```

1. **Document Upload**: User uploads an official identification card (e.g., Aadhaar card).
2. **Gemini 2.5 Flash OCR**: Extracts Name, Date of Birth, Phone Number, ID Number, and Address fields in structured JSON format.
3. **Anti-Spoofing Liveness Detection**: Clarifai inspects the live selfie to prevent presentation attacks (printed photos, screen replays, 3D masks).
4. **Biometric Face Match**: Face++ compares the portrait extracted from the ID against the live selfie. Verification proceeds only if confidence exceeds the 70% threshold.
5. **Credential Creation**: Generates account credentials and registers the identity profile.
6. **Decentralized Hash Anchoring**: The system computes a canonical SHA-256 hash of the sanitized profile and executes `storeHash(hash)` on the `HashStorage` smart contract.

---

### 2. B2B Organisation Authentication Flow

Third-party enterprise clients integrate with HashTrust to verify and authenticate users securely:

```mermaid
sequenceDiagram
    autonumber
    actor OrgClient as "Enterprise Client"
    participant API as "HashTrust API (/api/v1/login/user)"
    participant Auth as "Key & Session Validator"
    participant DB as "Firebase Firestore"
    participant Chain as "Sepolia Smart Contract"

    OrgClient->>API: POST /api/v1/login/user (email, password, apiKey)
    API->>Auth: Verify apiKey against database
    alt Invalid or Revoked API Key
        Auth-->>API: Authentication Error
        API-->>OrgClient: 401 Unauthorized (Invalid API Key)
    else Valid API Key
        Auth->>DB: Fetch user credentials
        API->>DB: Log API request metadata & timestamp
        API->>Chain: Verify identity integrity hash (verifyHash)
        Chain-->>API: Returns boolean status (valid/tampered)
        API-->>OrgClient: 200 OK + Set HttpOnly Session Cookie
    end
```

---

## 💎 Key Features

| Capability                        | Technical Implementation                    | Benefit                                                                        |
| :-------------------------------- | :------------------------------------------ | :----------------------------------------------------------------------------- |
| **Tamper-Proof Ledger**           | Ethereum Sepolia EVM + Ethers.js v6         | Identity records cannot be altered, spoofed, or deleted once hashed.           |
| **Multi-Modal AI Verification**   | Gemini 2.5 Flash + Clarifai + Face++        | Eliminates manual document inspection and prevents identity fraud.             |
| **Enterprise API Management**     | Dynamic API key provisioning with Firestore | Single-use/active API keys with granular deletion and audit logging.           |
| **Real-Time Analytics Dashboard** | Recharts + Server-side usage tracking       | Visual inspection of API traffic, status codes, and request logs.              |
| **Enterprise Session Security**   | Firebase Admin SDK + HttpOnly Cookies       | Eliminates client-side JWT token leakage and Cross-Site Scripting (XSS) risks. |

---

## 📜 Smart Contract Specification

The decentralized integrity layer uses **`HashStorage.sol`** deployed on Ethereum Sepolia.

- **Contract Address:** `0xbb6eCa83e82eA3C252373DA5F5A113561c3b5e55`
- **Network:** Ethereum Sepolia Testnet

### Contract Interface

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HashStorage {
    mapping(string => bool) public storedHashes;
    event HashStored(string hash);

    function storeHash(string memory hash) public {
        require(!storedHashes[hash], "Hash already exists");
        storedHashes[hash] = true;
        emit HashStored(hash);
    }

    function verifyHash(string memory hash) public view returns (bool) {
        return storedHashes[hash];
    }
}
```

- **`storeHash(string hash)`**: Verifies non-existence, flags the hash as registered, and emits a `HashStored` event.
- **`verifyHash(string hash)`**: Constant read operation returning whether a given SHA-256 data hash exists on-chain.

---

## 📁 Repository Structure

```
blockchain-verification/
├── src/
│   ├── app/                                # Next.js 15 App Router
│   │   ├── api/v1/login/user/route.ts      # B2B User login & verification endpoint
│   │   ├── pages/
│   │   │   ├── auth/                       # User & Organisation login/signup
│   │   │   ├── user/dashboard/             # Verified user profile & on-chain hash
│   │   │   └── organisation/dashboard/     # B2B API key management & Recharts
│   │   ├── layout.tsx                      # Root layout & providers
│   │   └── page.tsx                        # Landing hero, features & services
│   ├── components/                         # Modular React components
│   │   ├── HomePage/                       # Hero section, feature showcases
│   │   ├── OrgDashComp/                    # API keys, docs, analytics tabs
│   │   └── SignUpSteps/                    # 6-Step interactive KYC wizard
│   ├── lib/
│   │   ├── actions/                        # Next.js Server Actions
│   │   │   ├── apikey.actions.ts           # Key generation, revocation, and logging
│   │   │   ├── dataExtract.actions.ts      # Gemini 2.5 Flash document parsing
│   │   │   ├── faceSimilarity.actions.ts   # Face++ biometric comparison
│   │   │   ├── livenessDetector.actions.ts # Clarifai silent anti-spoofing
│   │   │   └── user.actions.ts             # User lifecycle & session handling
│   │   └── database/                       # Firebase client & Admin SDK instances
│   ├── redux/                              # Global state management
│   │   ├── store.ts                        # Central Redux store
│   │   └── features/                       # Slices (wizard steps, user data, image)
│   └── utils/                              # Utilities & smart contracts
│       ├── contract.ts                     # Ethers.js provider and contract instance
│       ├── generateDataHash.ts             # Deterministic SHA-256 hash generator
│       ├── uploadHash.ts                   # Blockchain write transactions
│       └── contracts/HashStorage.json      # Hardhat contract compilation artifact
├── public/                                 # Static assets & icons
├── package.json                            # Dependencies & project scripts
└── README.md                               # Project documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js**: v18.x or v20.x or higher
- **npm** or **pnpm** or **yarn**
- An Ethereum testnet wallet with Sepolia ETH (for gas fees)

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/MdKaifSardar/kyc-verify.git
cd kyc-verify
npm install
```

### 3. Environment Variables Configuration

Create a `.env.local` file in the root directory:

```env
# Firebase Client SDK
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id

# Firebase Admin SDK (Server Actions)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Google Gemini AI (Document OCR)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# Clarifai (Silent Face Anti-Spoofing Liveness)
CLARIFAI_PAT=your_clarifai_pat

# Face++ (Biometric Face Comparison)
FACEPP_API_KEY=your_facepp_key
FACEPP_API_SECRET=your_facepp_secret

# Cloudinary (Secure Media Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Blockchain / Smart Contract (Ethereum Sepolia)
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/your_infura_key
PRIVATE_KEY=your_evm_wallet_private_key
CONTRACT_ADDRESS=0xbb6eCa83e82eA3C252373DA5F5A113561c3b5e55
```

### 4. Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build

To validate code compilation and generate an optimized build:

```bash
npm run build
npm run start
```

---

## 📡 API Reference

### User Authentication & Verification via Organisation Key

#### `POST /api/v1/login/user`

Authenticates a verified user on behalf of an enterprise client using an active Organisation API Key.

**Headers:**

```http
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "userPassword123",
  "apiKey": "org_api_key_32_characters",
  "type": "login"
}
```

**Responses:**

- **200 OK (Success):**
  Sets a secure `HttpOnly; SameSite=Strict` session cookie for subsequent requests.

  ```json
  {
    "ok": true,
    "message": "Login successful"
  }
  ```

- **400 Bad Request:**

  ```json
  {
    "ok": false,
    "error": "Email and password are required."
  }
  ```

- **401 Unauthorized:**

  ```json
  {
    "ok": false,
    "error": "Invalid API Key."
  }
  ```

- **500 Internal Server Error:**

  ```json
  {
    "ok": false,
    "error": "Internal server error.",
    "message": "Internal server error."
  }
  ```

---

## 🛡️ Security & Privacy Considerations

1. **Zero Raw PII on Blockchain**: Personal identifiable information (PII) is never written to the blockchain. Only a one-way deterministic SHA-256 hash is published, preventing identity exposure while maintaining proof of existence.
2. **Anti-Spoofing & Liveness**: Live selfie capture eliminates photograph replay attacks through Clarifai's neural network.
3. **Double Verification**: Biometric face matching against the official document guarantees that the applicant is the legitimate owner of the credential.
4. **Strict Session Cookies**: Sessions use `HttpOnly`, `Secure`, and `SameSite=Strict` cookies, protecting credentials from script injection and man-in-the-middle attacks.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
