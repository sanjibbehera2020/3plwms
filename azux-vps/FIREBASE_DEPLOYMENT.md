# Firebase Hosting Deployment Guide

## Deployment Status ✅

Your AZUX 3PL WMS application has been successfully deployed to **Firebase Hosting**.

### Live URLs:
- **Web App**: https://wms-3pl-app.web.app
- **Alternative URL**: https://wms-3pl-app.firebaseapp.com
- **Firebase Console**: https://console.firebase.google.com/project/wms-3pl-app/overview

---

## Firestore Database Setup

To enable Firestore and use the database features, follow these steps:

### Step 1: Enable Firestore
1. Go to [Firebase Console](https://console.firebase.google.com/project/wms-3pl-app/overview)
2. Click on **Firestore Database** in the left sidebar under "Build"
3. Click **Create Database**
4. Choose **Start in production mode** for security rules
5. Select region: **us-central1** (or your preferred region)
6. Click **Create**

### Step 2: Configure Firestore Security Rules

Replace the default security rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their data
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Or use custom rules for specific collections:
    match /orders/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.resource.data.tenantId == request.auth.uid;
    }
    
    match /documents/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### Step 3: Enable Firebase Authentication (Optional)
If you need user authentication:
1. Go to **Authentication** in Firebase Console
2. Click **Get Started**
3. Enable desired sign-in methods:
   - Email/Password
   - Google
   - Microsoft
   - etc.

---

## Deployment Configuration Files

### `.firebaserc` (Firebase Project Config)
```json
{
  "projects": {
    "default": "wms-3pl-app"
  }
}
```

### `firebase.json` (Firebase Hosting Config)
- Public directory: `dist`
- Rewrites all routes to `/index.html` for SPA routing
- Automatic trailing slash removal

### Firebase SDK Configuration
Updated in `src/lib/firebase.ts` with credentials for `wms-3pl-app` project:
- Project ID: `wms-3pl-app`
- Auth Domain: `wms-3pl-app.firebaseapp.com`
- Storage Bucket: `wms-3pl-app.firebasestorage.app`

---

## Future Deployments

### Quick Deploy (Recommended)
```bash
npm run firebase:deploy
```
This runs: `build` → `restructure` → `firebase deploy`

### Manual Steps
1. **Build the project**:
   ```bash
   npm run build
   ```
2. **Restructure for Firebase** (automatically extracts client files):
   ```bash
   npm run firebase:restructure
   ```
3. **Deploy to Firebase**:
   ```bash
   firebase deploy --only hosting --project wms-3pl-app
   ```

### Scripts Included
- **`npm run build:firebase`** - Build and restructure for Firebase
- **`npm run firebase:restructure`** - Restructure existing build for Firebase
- **`npm run firebase:deploy`** - Build, restructure, and deploy (one command!)
- **`build-firebase.sh`** - Shell script for Linux/Mac automation
- **`build-firebase.bat`** - Batch script for Windows automation

---

## Optional: Cloud Storage Setup

For file uploads (BOLs, documents, etc.):

1. Go to **Storage** in Firebase Console
2. Click **Get started**
3. Accept the default security rules or customize them
4. Update your app to use Cloud Storage:

```typescript
import { getStorage, ref, uploadBytes } from 'firebase/storage';

const storage = getStorage(app);
const storageRef = ref(storage, 'documents/bol-123.pdf');
await uploadBytes(storageRef, file);
```

---

## Monitoring & Analytics

- **View Hosting Metrics**: Firebase Console → Hosting → Analytics
- **View Function Logs**: Firebase Console → Functions → Logs
- **View Firestore Usage**: Firebase Console → Firestore → Usage

---

## Support & Troubleshooting

- Firebase CLI Docs: https://firebase.google.com/docs/cli
- Firestore Docs: https://firebase.google.com/docs/firestore
- Hosting Docs: https://firebase.google.com/docs/hosting

**Need to redeploy after Firestore changes?**
```bash
npm run build && firebase deploy --only hosting --project wms-3pl-app
```

---

**Last Updated**: June 13, 2026
**Project**: AZUX 3PL WMS
**Status**: ✅ Live on Firebase Hosting
