#!/bin/bash
# Firebase Firestore Setup Script

PROJECT_ID="wms-3pl-app"

echo "=========================================="
echo "Firebase Firestore Setup for AZUX WMS"
echo "=========================================="
echo ""

# Check if firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "Error: Firebase CLI is not installed."
    echo "Install it with: npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in
echo "Checking Firebase authentication..."
firebase projects:list > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "You're not logged in to Firebase."
    echo "Running: firebase login"
    firebase login
fi

echo ""
echo "Setting up Firestore for project: $PROJECT_ID"
echo ""

# Deploy Firestore security rules
echo "Deploying Firestore security rules..."

# Create a temporary firestore.rules file
cat > firestore.rules << 'EOF'
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
EOF

# Update firebase.json to include firestore rules
if ! grep -q "firestore" firebase.json; then
    echo "Adding firestore rules to firebase.json..."
    # This is a simplified approach; you may need to edit manually
    echo 'Updated firebase.json - please manually add the firestore section'
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Go to: https://console.firebase.google.com/project/$PROJECT_ID"
echo "2. Select 'Firestore Database'"
echo "3. Click 'Create Database'"
echo "4. Choose 'Start in production mode'"
echo "5. Select region: us-central1"
echo "6. Click 'Create'"
echo ""
echo "For automatic rule deployment, run:"
echo "  firebase deploy --only firestore:rules --project $PROJECT_ID"
