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

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# BlockID: Decentralized Identity Protection & Fraud Detection

![BlockID Banner](https://user-images.githubusercontent.com/your-banner-image.png)

## 🚀 Overview

**BlockID** is a next-generation identity protection platform designed to safeguard users and organisations from identity theft and fraud. By leveraging decentralized blockchain storage and advanced GenAI-powered fraud detection, BlockID ensures your personal and organisational data remains secure, private, and tamper-proof.

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

## 🛡️ Why BlockID?

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
git clone https://github.com/your-org/blockid.git
cd blockid
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file and add your Firebase, Cloudinary, and blockchain credentials.

```env
FIREBASE_API_KEY=your-key
FIREBASE_AUTH_DOMAIN=your-domain
...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
...
```

### 4. Run the Development Server

```bash
npm run dev
```

---

## 🔑 API Endpoints

### Authentication

- `POST /api/login`  
  Authenticate user or organisation.

- `POST /api/fetch-user-data`  
  Fetch user data using API key and token.

- `POST /api/org-signup`  
  Organisation registration (sets session cookie).

- `POST /api/org-login`  
  Organisation login (sets session cookie).

### API Key Management

- `POST /api/create-api-key`  
  Create a new API key for your organisation.

- `POST /api/delete-api-key`  
  Delete an existing API key.

### Usage & Logs

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

MIT License © 2024 BlockID Team

---

## ✨ Connect With Us

- [Website](https://blockid.example.com)
- [Twitter](https://twitter.com/blockid)
- [LinkedIn](https://linkedin.com/company/blockid)
- [Contact](mailto:support@blockid.example.com)

---

> **BlockID**: Your identity, secured for the future.
