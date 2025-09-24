This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.app/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# HashTrust: Decentralized Identity Protection & Fraud Detection

![HashTrust Banner](https://user-images.githubusercontent.com/your-banner-image.png)

## 🚀 Overview

**HashTrust** is a next-generation identity protection platform designed to safeguard users and organisations from identity theft and fraud. By leveraging decentralized blockchain storage and advanced GenAI-powered fraud detection, HashTrust ensures your personal and organisational data remains secure, private, and tamper-proof.

---

## 🌟 Key Features

- **Decentralized Data Storage:**  
  All sensitive identity data is hashed and stored on the blockchain, ensuring immutability and privacy.

- **Advanced Fraud Detection (GenAI):**  
  Utilizes generative AI models for real-time fraud analysis, face liveness checks, and similarity verification.

- **API Key Management:**  
  Secure, single-use API keys for organisations to access platform features and monitor usage.

- **Session-Based Authentication:**  
  Robust authentication using secure session cookies, eliminating token expiry issues.

- **Usage Analytics:**  
  Visual dashboards for API usage, traffic, and request logs.

- **Responsive UI:**  
  Modern, mobile-friendly interface built with React, Next.js, and Tailwind CSS.

---

## 🛡️ Why HashTrust?

- **Protect Against Identity Theft:**  
  Your identity data is never stored in plain text. Blockchain hashing ensures only you control your information.

- **Fraud Prevention:**  
  GenAI models detect suspicious activity, fake identities, and prevent fraudulent access.

- **Transparency & Auditability:**  
  Every API request and login is logged and available for review, giving you full control and visibility.

- **Easy Integration:**  
  RESTful API endpoints for login, data fetch, and more. Simple API key management for organisations.

---

## 📦 Tech Stack

- **Frontend:** React, Next.js, Tailwind CSS, Framer Motion
- **Backend:** Firebase, Firestore, Firebase Admin SDK
- **Blockchain:** Custom smart contract for hash verification
- **AI/ML:** GenAI models for fraud detection and face verification
- **Cloud Storage:** Cloudinary for secure image/document uploads

---

## 📝 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/hashtrust.git
cd hashtrust
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file and add your Firebase, Cloudinary, and blockchain credentials.  
**Format example (see `.env` in repo):**

```env
FIREBASE_API_KEY=your-key
FIREBASE_AUTH_DOMAIN=your-domain
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
FIREBASE_APP_ID=your-app-id
FIREBASE_MEASUREMENT_ID=your-measurement-id
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-key
CLARIFAI_PAT=your-clarifai-pat
CLOUDINARY_URL=your-cloudinary-url
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUD_NAME=your-cloudinary-cloud-name
FACEPP_API_KEY=your-facepp-key
FACEPP_API_SECRET=your-facepp-secret
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
NEXT_PUBLIC_RPC_URL=your-rpc-url
PRIVATE_KEY=your-private-key
CONTRACT_ADDRESS=your-contract-address
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 API Endpoints

### Live API Base URL

**Production:**  
`https://hash-trust.vercel.app/`

**Local:**  
`http://localhost:3000/`

### Authentication

#### `POST /api/login`

Authenticate user or organisation using email, password, and API key.

**Live Endpoint:**  
`https://hash-trust.vercel.app/api/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "yourpassword",
  "apiKey": "your-organisation-api-key"
}
```

**Response:**

- **Success (HTTP 200):**
  ```json
  {
    "ok": true,
    "message": "Login successful"
  }
  ```
  - A session cookie is set in the response headers (`Set-Cookie: session=...`).

- **Failure (HTTP 401/400):**
  ```json
  {
    "ok": false,
    "error": "Invalid API Key." // or other error message
    "message": "Login failed."
  }
  ```

- **Error (HTTP 500):**
  ```json
  {
    "ok": false,
    "error": "Internal server error.",
    "message": "Internal server error."
  }
  ```

**Usage Instructions:**

- You must provide a valid API key (created via organisation dashboard).
- The API key must belong to the organisation.
- On successful login, a session cookie is set for authentication.
- Use the session cookie for subsequent authenticated requests.

---

### Other API Endpoints

- `POST /api/fetch-user-data`  
  Fetch user data using API key and session cookie.

- `POST /api/org-signup`  
  Organisation registration (sets session cookie).

- `POST /api/org-login`  
  Organisation login (sets session cookie).

- `POST /api/create-api-key`  
  Create a new API key for your organisation.

- `POST /api/delete-api-key`  
  Delete an existing API key.

- `GET /api/org-session`  
  Verify organisation session and fetch details.

- `GET /api/api-key-usage`  
  Retrieve API key usage logs and analytics.

---

## 📊 Dashboard Features

- **Organisation Details:**  
  View and manage your organisation profile.

- **API Key Management:**  
  Create, copy, and delete API keys securely.

- **Usage Analytics:**  
  Interactive charts for API traffic and request types.

- **Request Logs:**  
  Inspect detailed logs for every API request.

- **API Documentation:**  
  Built-in docs for all endpoints and request formats.

---

## 🧠 AI-Powered Fraud Detection

- **Face Liveness & Similarity:**  
  GenAI models verify user images and detect spoofing.

- **Real-Time Alerts:**  
  Get notified of suspicious activity and failed login attempts.

---

## 💡 Contributing

We welcome contributions!  
Please open issues, submit pull requests, or suggest new features.

---

## 📄 License

MIT License © 2024 HashTrust Team

---

## ✨ Connect With Us

- [Website](https://hash-trust.vercel.app/)
- [Contact](mailto:support@hash-trust.vercel.app)

---

> **HashTrust**: Your identity, secured for the future.
