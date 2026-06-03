# eid-sandbox-CMU

# eID Stack Dashboard




A web-based dashboard for managing **decentralized identity (DID)** workflows, including **schema creation, credential issuance, and selective disclosure verification**.

This project is part of the **eID Stack** sandbox environment and is designed for rapid deployment, testing, and demonstrations.

---

## 📌 Features

- Schema creation for identity templates
- Credential Definition management
- Credential issuance via QR code
- Email-based credential delivery
- Selective disclosure verification
- Compatible with mobile identity wallets
- Production-ready Next.js deployment

---

## 🧰 Tech Stack

- **Frontend**: Next.js (App Router)
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Deployment**: Vercel / Self-hosted Node.js
- **Backend Integration**: REST APIs (configurable)

---

## 📋 Prerequisites

Ensure the following tools are installed:

- **Git**
- **Node.js** (v18 or higher)
- **pnpm**

Install pnpm globally:

```bash
npm install -g pnpm
🚀 Quick Start (Local Development)
1. Clone the Repository
git clone <your-repository-url>
2. Navigate to the Project Directory
cd eid-sandbox-CMU
3. Install Dependencies
pnpm install
4. Start Development Server
pnpm dev
The application will be available at:

http://localhost:3000

⚙️ Environment Configuration
The dashboard requires environment variables to connect to backend services.

1. Create Environment File
In the project root:
.env.local same as (.env.example)
2. Add Required Variables
NEXT_PUBLIC_REST_URL=<Backend API Base URL>
3. Restart Server
pnpm dev

📦 Deployment

## ☁️ Cloud Platforms (Vercel, AWS, Azure, GCP)

These platforms **automatically handle servers for you**.

Typical process:
1. Upload or connect the project repository
2. Add environment variables
3. Click **Deploy**
4. Platform builds and runs the app

✅ Best for:
- Fast setup
- Demos and pilots
- Managed infrastructure

---

## 🖥️ Server-Based Deployment (VPS / EC2 / On-Prem)

Here, you or your IT team manage the server.

Typical process:
1. Copy project files to the server
2. Install Node.js and pnpm
3. Prepare the application
4. Start the application
5. Keep it running using a service manager

✅ Best for:
- Enterprise environments
- Custom networking
- Full control over infrastructure

---

## 🐳 Container-Based Deployment (Optional)

The application can also run inside a **container**.

Typical process:
1. Build the application
2. Package it into a container
3. Run the container on your platform

✅ Best for:
- Scalable deployments
- Cloud-native systems
- DevOps pipelines

---

## 🔐 Production Recommendations

For live systems:

- Use **HTTPS** (SSL certificate)
- Store environment values securely
- Restrict server access
- Monitor uptime and logs
- Back up configuration files

🧪 End-to-End Testing Guide
Follow the steps in sequence to validate the full eID lifecycle.

1️⃣ Create Schema
Navigate to Create Schema

Define an identity template (e.g., Employee ID)

Add required attributes

Submit the form

Result: A unique Schema ID is generated

2️⃣ Create Credential Definition
Navigate to Create Credential Definition

Select the created schema

Enter a version tag (e.g., v1)

Submit

Result: Credential Definition is ready for issuance

3️⃣ Issue Credential
Navigate to Issue Credential

Select schema and credential definition

Enter user attribute values

Click Issue Credential

Expected Output:

QR code generated

Scan with a compatible wallet to receive credential

Use Send via Email to test email notifications

4️⃣ Verify Credential (Selective Disclosure)
Navigate to Verify Credential

Select schema

Choose attributes for disclosure

Click Generate QR Request

Expected Output:

Verification QR code

Wallet user shares selected attributes securely

Verification response received

✅ Best Practices
Always follow the order:
Schema → Credential Definition → Issuance → Verification

Use HTTPS-enabled backend APIs in production

Validate environment variables before deployment
```
