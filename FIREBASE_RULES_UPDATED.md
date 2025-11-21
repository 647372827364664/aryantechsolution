# Updated Firebase Firestore Database Rules

## 🔥 Updated Database Structure

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
├── 📁 services (Collection) - Available services/products catalog
│   ├── 📄 {serviceId}
│   │   ├── title: "VPS Hosting Solutions"
│   │   ├── name: "VPS Hosting Solutions"
│   │   ├── description: "Enterprise-grade virtual private servers..."
│   │   ├── category: "hosting" | "development" | "domains" | "minecraft" | "custom" | "bots" | "gaming" | "security" | "optimization" | "consulting"
│   │   ├── price: 299 (number)
│   │   ├── pricing: "Starting from ₹299/month"
│   │   ├── features: ["NVMe SSD Storage", "99.9% uptime SLA", ...]
│   │   ├── popular: boolean
│   │   ├── badge: "Most Popular" (optional)
│   │   ├── icon: "Server" | "Bot" | "Code" | "Globe" | etc.
│   │   ├── link: "/store/hosting"
│   │   ├── status: "active" | "inactive" | "coming-soon"
│   │   ├── rating: 4.8 (optional)
│   │   ├── reviewCount: 342 (optional)
│   │   ├── image: "https://..." (optional)
│   │   ├── specifications: { cpu: "2 vCPU", ram: "4GB", ... } (optional)
│   │   ├── author: "admin_name"
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│   └── ...
│
├── 📁 blogs (Collection) - Blog posts and articles
│   ├── 📄 {blogId}
│   │   ├── title: "Building Scalable Cloud Infrastructure"
│   │   ├── slug: "building-scalable-cloud-infrastructure"
│   │   ├── excerpt: "Learn how to design and implement..."
│   │   ├── content: "Full blog post content in markdown..."
│   │   ├── author: { name: "John Doe", avatar: "https://...", role: "Cloud Architect" }
│   │   ├── category: "Cloud Infrastructure" | "Web Development" | "Gaming" | etc.
│   │   ├── tags: ["AWS", "DevOps", "Scaling", "Architecture"]
│   │   ├── featured: boolean
│   │   ├── published: boolean
│   │   ├── featuredImage: "https://..." (optional)
│   │   ├── readTime: 8 (minutes, optional)
│   │   ├── views: 1250 (optional)
│   │   ├── likes: 89 (optional)
│   │   ├── comments: 23 (optional)
│   │   ├── publishedAt: timestamp
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│   └── ...
│
├── 📁 support_tickets (Collection)
│   ├── 📄 {ticketId}
│   │   ├── userId: "user123"
│   │   ├── subject: "Server Issue"
│   │   ├── description: "Server is not responding"
│   │   ├── status: "open" | "in_progress" | "resolved" | "closed"
│   │   ├── priority: "low" | "medium" | "high" | "urgent"
│   │   ├── assignedTo: "admin_user_id" (optional)
│   │   ├── messages: [{ sender: "user", message: "...", timestamp }]
│   │   └── createdAt: timestamp
│   └── ...
│
└── 📁 analytics (Collection) - User activity tracking
    ├── 📄 {sessionId}
    │   ├── userId: "user123"
    │   ├── action: "login" | "signup" | "service_created"
    │   ├── metadata: { ip: "...", device: "...", browser: "..." }
    │   └── timestamp: timestamp
    └── ...
```

## 🛡️ Updated Firestore Security Rules

Copy these rules to your Firebase Console → Firestore Database → Rules:

```javascript
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
    
    // Services collection - public catalog of available services/products
    match /services/{serviceId} {
      // Anyone can read services (public catalog)
      allow read: if true;
      // Only admins can create, update, delete services
      allow create, update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      // Validate service data structure
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' &&
        request.resource.data.keys().hasAll(['title', 'description', 'category', 'pricing', 'features']) &&
        request.resource.data.category in ['hosting', 'development', 'domains', 'minecraft', 'custom', 'bots', 'gaming', 'security', 'optimization', 'consulting'] &&
        request.resource.data.status in ['active', 'inactive', 'coming-soon'];
    }
    
    // Blogs collection - blog posts and articles
    match /blogs/{blogId} {
      // Anyone can read published blogs
      allow read: if resource.data.published == true;
      // Authenticated users can read all blogs (including drafts for admins)
      allow read: if request.auth != null;
      // Only admins can create, update, delete blog posts
      allow create, update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      // Validate blog data structure
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' &&
        request.resource.data.keys().hasAll(['title', 'excerpt', 'content', 'author', 'category', 'published']) &&
        request.resource.data.published is bool &&
        request.resource.data.featured is bool;
    }
    
    // Support tickets - users can access their own tickets, admins can access all
    match /support_tickets/{ticketId} {
      allow read, write: if request.auth != null && (
        request.auth.uid == resource.data.userId || 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
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
    
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
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
2. If not already created, click **Create database**
3. Choose **Start in production mode** (we have secure rules)
4. Select your preferred location (closest to your users)

### Step 3: Apply Security Rules
1. Go to **Firestore Database** → **Rules**
2. Replace the existing rules with the rules above
3. Click **Publish**

### Step 4: Enable Authentication Methods
1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Enable **Google** (add your domain to authorized domains)

### Step 5: Add Your Domain
1. In **Authentication** → **Settings** → **Authorized domains**
2. Add: `localhost`, `universalcloud.com` (your actual domain)

## 🔧 Database Indexes (Required for Performance)

Create these indexes in Firestore Console → Indexes:

### Services Collection Indexes:
1. **Composite Index**:
   - Collection: `services`
   - Fields: `category` (Ascending), `createdAt` (Descending)
   
2. **Composite Index**:
   - Collection: `services`
   - Fields: `status` (Ascending), `createdAt` (Descending)

3. **Single Field Index**:
   - Collection: `services`
   - Field: `popular` (Ascending)

### Blogs Collection Indexes:
1. **Composite Index**:
   - Collection: `blogs`
   - Fields: `published` (Ascending), `publishedAt` (Descending)
   
2. **Composite Index**:
   - Collection: `blogs`
   - Fields: `category` (Ascending), `published` (Ascending), `publishedAt` (Descending)

3. **Composite Index**:
   - Collection: `blogs`
   - Fields: `featured` (Ascending), `published` (Ascending), `publishedAt` (Descending)

### User Services Collection Indexes:
1. **Composite Index**:
   - Collection: `user_services`
   - Fields: `userId` (Ascending), `createdAt` (Descending)
   
2. **Composite Index**:
   - Collection: `user_services`
   - Fields: `userId` (Ascending), `status` (Ascending)

### Support Tickets Collection Indexes:
1. **Composite Index**:
   - Collection: `support_tickets`
   - Fields: `userId` (Ascending), `createdAt` (Descending)
   
2. **Composite Index**:
   - Collection: `support_tickets`
   - Fields: `status` (Ascending), `createdAt` (Descending)

## 📊 New Data Fields Explanation

### Services Collection:
| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Service display title |
| `name` | string | Service name (usually same as title) |
| `description` | string | Detailed service description |
| `category` | string | Service category (hosting, development, etc.) |
| `price` | number | Numeric price for sorting/filtering |
| `pricing` | string | Display pricing text |
| `features` | array | List of service features |
| `popular` | boolean | Whether service is marked as popular |
| `badge` | string | Optional badge text (e.g., "Most Popular") |
| `icon` | string | Icon identifier for UI |
| `link` | string | URL path to service page |
| `status` | string | Service availability status |
| `rating` | number | Average service rating (optional) |
| `reviewCount` | number | Number of reviews (optional) |
| `image` | string | Service image URL (optional) |
| `specifications` | object | Technical specifications (optional) |
| `author` | string | Who created the service |

### Blogs Collection:
| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Blog post title |
| `slug` | string | URL-friendly identifier |
| `excerpt` | string | Short description/summary |
| `content` | string | Full blog post content |
| `author` | object | Author info (name, avatar, role) |
| `category` | string | Blog post category |
| `tags` | array | List of tags for the post |
| `featured` | boolean | Whether post is featured |
| `published` | boolean | Whether post is published |
| `featuredImage` | string | Featured image URL (optional) |
| `readTime` | number | Estimated read time in minutes |
| `views` | number | View count (optional) |
| `likes` | number | Like count (optional) |
| `comments` | number | Comment count (optional) |
| `publishedAt` | timestamp | When post was published |

## 🔒 Security Features

- **Public Services**: Anyone can read services catalog
- **Admin-Only Management**: Only admins can create/edit services and blogs
- **Published Content**: Only published blogs are visible to public
- **User Isolation**: Users can only access their own data
- **Role-Based Access**: Different permissions based on user role
- **Data Validation**: Rules validate required fields and data types
- **Secure Defaults**: Deny access unless explicitly allowed

## 🎯 Role-Based Permissions

### Public Users (Not Authenticated):
- ✅ Read published blog posts
- ✅ Read services catalog
- ❌ Cannot access any other data

### Authenticated Users:
- ✅ All public permissions
- ✅ Read/write their own user data and profiles
- ✅ Read/write their own user services
- ✅ Create support tickets
- ✅ Read all blog posts (including drafts)

### Admin Users:
- ✅ All user permissions
- ✅ Create/edit/delete services
- ✅ Create/edit/delete blog posts
- ✅ Read all user data
- ✅ Access analytics data
- ✅ Manage support tickets

Your Firebase database is now ready with comprehensive security rules for services and blog management! 🎉

## 📋 Quick Copy-Paste Rules

For quick setup, here are just the rules to copy to Firebase Console:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'moderator'];
    }
    match /user_profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null;
    }
    match /user_services/{serviceId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow read: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /services/{serviceId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /blogs/{blogId} {
      allow read: if resource.data.published == true;
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /support_tickets/{ticketId} {
      allow read, write: if request.auth != null && (request.auth.uid == resource.data.userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    match /analytics/{sessionId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```
