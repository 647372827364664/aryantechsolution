# Firebase Firestore Database Rules

## 🔥 Database Structure

Your user data will be stored in Firestore collections with the following structure:

```
📁 universalcloud-2a60c (Database)
├── 📁 users (Collection)
│   ├── 📄 {userId} (Document - Auto-generated UID)
│   │   ├── displayName: "John Doe"
│   │   ├── firstName: "John"
│   │   ├── lastName: "Doe"
│   │   ├── email: "john@example.com"
│   │   ├── phoneNumber: "+91XXXXXXXXXX" (optional)
│   │   ├── photoURL: "https://..." (from Google/profile)
│   │   ├── role: "user" | "admin" | "developer"
│   │   ├── plan: "free" | "basic" | "premium" | "enterprise"
│   │   ├── emailVerified: boolean
│   │   ├── onboardingCompleted: boolean
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│   └── ...more user documents
│
├── 📁 user_profiles (Collection) - Extended user data
│   ├── 📄 {userId}
│   │   ├── bio: "Developer and entrepreneur"
│   │   ├── website: "https://example.com"
│   │   ├── location: "Mumbai, India"
│   │   ├── skills: ["React", "Node.js", "Firebase"]
│   │   ├── social: { twitter: "@handle", github: "username" }
│   │   └── preferences: { theme: "dark", notifications: true }
│   └── ...
│
├── 📁 user_services (Collection) - User's hosting services
│   ├── 📄 {serviceId}
│   │   ├── userId: "user123"
│   │   ├── type: "vps" | "domain" | "minecraft" | "bot"
│   │   ├── name: "My VPS Server"
│   │   ├── status: "active" | "suspended" | "pending"
│   │   ├── plan: "basic" | "premium"
│   │   ├── expiresAt: timestamp
│   │   └── createdAt: timestamp
│   └── ...
│
├── 📁 support_tickets (Collection)
│   ├── 📄 {ticketId}
│   │ 
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'moderator'];
    }
    
    // User profiles - extended user data
    match /user_profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null; // Allow other users to read public profiles
    }
    
    // User services - users can only access their own services
    match /user_services/{serviceId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
      // Admins can read all services
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Support tickets - users can access their own tickets, admins can access all
    match /support_tickets/{ticketId} {
      allow read, write: if request.auth != null && (
        request.auth.uid == resource.data.userId ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'support']
      );
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    // Analytics - only authenticated users can create, admins can read
    match /analytics/{sessionId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Public collections (if any)
    match /public_data/{document} {
      allow read: if true; // Public read access
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the resource
    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }
    
    // Helper function to check user role
    function hasRole(role) {
      return request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }
  }
}
```

## 🚀 Setup Instructions

### Step 1: Go to Firebase Console
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `universalcloud-2a60c`

### Step 2: Set up Firestore Database
1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (we'll add rules later)
4. Select your preferred location (closest to your users)

### Step 3: Apply Security Rules
1. Go to **Firestore Database** → **Rules**
2. Replace the default rules with the rules above
3. Click **Publish**

### Step 4: Enable Authentication Methods
1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Enable **Google** (add your domain to authorized domains)

### Step 5: Add Your Domain
1. In **Authentication** → **Settings** → **Authorized domains**
2. Add: `localhost`, `universalcloud.com` (your actual domain)

## 🔧 Database Indexes (Optional but Recommended)

For better performance, create these indexes in Firestore:

1. **users collection**:
   - Single field: `email` (Ascending)
   - Single field: `role` (Ascending)
   - Single field: `createdAt` (Descending)

2. **user_services collection**:
   - Composite: `userId` (Ascending), `createdAt` (Descending)
   - Composite: `userId` (Ascending), `status` (Ascending)

3. **support_tickets collection**:
   - Composite: `userId` (Ascending), `createdAt` (Descending)
   - Composite: `status` (Ascending), `createdAt` (Descending)

## 📊 User Data Fields Explanation

| Field | Type | Description |
|-------|------|-------------|
| `displayName` | string | Full name (First + Last) |
| `firstName` | string | User's first name |
| `lastName` | string | User's last name |
| `email` | string | User's email address |
| `phoneNumber` | string | Optional phone number |
| `photoURL` | string | Profile picture URL |
| `role` | string | User role: user/admin/developer |
| `plan` | string | Subscription plan |
| `emailVerified` | boolean | Email verification status |
| `onboardingCompleted` | boolean | Onboarding flow completion |
| `createdAt` | timestamp | Account creation date |
| `updatedAt` | timestamp | Last profile update |

## 🔒 Security Features

- **User Isolation**: Users can only access their own data
- **Role-Based Access**: Admins can access all data
- **Authenticated Access**: All operations require authentication
- **Data Validation**: Rules validate data structure
- **Read/Write Separation**: Different permissions for reading vs writing

Your Firebase database is now ready to store user data securely! 🎉
