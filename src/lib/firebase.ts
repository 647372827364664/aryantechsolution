import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, serverTimestamp, getDocs, query, where, orderBy, deleteDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abcdef123456',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-XXXXXXXXXX',
};

// Check if we have valid Firebase config
const isFirebaseConfigured = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
                             process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
                             !process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('demo');

console.log('Firebase config check:', {
  hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  apiKeyLength: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.length,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  isConfigured: isFirebaseConfigured
});

let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;
let analytics: any = null;
let googleProvider: any = null;

// Initialize Firebase regardless (remove the conditional check for now)
try {
  console.log('Initializing Firebase with config:', firebaseConfig);
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  
  // Initialize Firebase Authentication and get a reference to the service
  auth = getAuth(app);
  
  // Initialize Cloud Firestore and get a reference to the service
  db = getFirestore(app);
  
  // Initialize Firebase Storage
  storage = getStorage(app);
  
  console.log('Firebase initialized successfully:', { app: !!app, auth: !!auth, db: !!db, storage: !!storage });
  
  // Initialize Analytics (only in browser environment)
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
  
  // Google Auth Provider
  googleProvider = new GoogleAuthProvider();
  googleProvider.addScope('email');
  googleProvider.addScope('profile');
} catch (error) {
  console.error('Firebase initialization failed:', error);
}

// User data management functions
export const createUserDocument = async (user: User, additionalData?: any) => {
  if (!db) {
    throw new Error('Firebase not configured. Please set up your Firebase environment variables.');
  }

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const { displayName, email, phoneNumber, photoURL } = user;
    const createdAt = serverTimestamp();

    try {
      await setDoc(userRef, {
        displayName,
        email,
        phoneNumber,
        photoURL,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.error('Error creating user document:', error);
      throw error;
    }
  }

  return userRef;
};

export const getUserDocument = async (uid: string) => {
  if (!db) {
    throw new Error('Firebase not configured. Please set up your Firebase environment variables.');
  }

  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() };
  }

  return null;
};

export const updateUserDocument = async (uid: string, updateData: any) => {
  if (!db) {
    throw new Error('Firebase not configured. Please set up your Firebase environment variables.');
  }

  const userRef = doc(db, 'users', uid);
  try {
    await setDoc(userRef, updateData, { merge: true });
  } catch (error) {
    console.error('Error updating user document:', error);
    throw error;
  }
};

// Auth functions with user document creation
export const signInWithGoogle = async () => {
  if (!auth || !googleProvider) {
    throw new Error('Firebase not configured. Please set up your Firebase environment variables.');
  }
  
  const result = await signInWithPopup(auth, googleProvider);
  await createUserDocument(result.user);
  return result;
};

export const signUpWithEmail = async (email: string, password: string, additionalData?: any) => {
  if (!auth) {
    throw new Error('Firebase not configured. Please set up your Firebase environment variables.');
  }
  
  const result = await createUserWithEmailAndPassword(auth, email, password);
  
  // Update the user profile if display name is provided
  if (additionalData?.displayName) {
    await updateProfile(result.user, {
      displayName: additionalData.displayName
    });
  }
  
  await createUserDocument(result.user, additionalData);
  return result;
};

export const signInWithEmail = (email: string, password: string) => {
  if (!auth) {
    throw new Error('Firebase not configured. Please set up your Firebase environment variables.');
  }
  return signInWithEmailAndPassword(auth, email, password);
};

export const logOut = () => {
  if (!auth) {
    throw new Error('Firebase not configured. Please set up your Firebase environment variables.');
  }
  return signOut(auth);
};

// Service management functions
export const createService = async (serviceData: any) => {
  if (!db) {
    throw new Error('Firebase not configured. Please set up your Firebase environment variables.');
  }

  try {
    const servicesRef = collection(db, 'services');
    const docRef = await addDoc(servicesRef, {
      ...serviceData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

export const getServices = async (category?: string, status?: string) => {
  if (!db) {
    throw new Error('Firebase not configured. Please set up your Firebase environment variables.');
  }

  try {
    const servicesRef = collection(db, 'services');
    let q = query(servicesRef, orderBy('createdAt', 'desc'));

    if (category && category !== 'all') {
      q = query(servicesRef, where('category', '==', category), orderBy('createdAt', 'desc'));
    }

    if (status && status !== 'all') {
      q = query(servicesRef, where('status', '==', status), orderBy('createdAt', 'desc'));
    }

    const querySnapshot = await getDocs(q);
    const services = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return services;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

export const getService = async (id: string) => {
  if (!db) {
    throw new Error('Firebase not configured. Please set up your Firebase environment variables.');
  }

  try {
    const serviceRef = doc(db, 'services', id);
    const serviceSnap = await getDoc(serviceRef);

    if (serviceSnap.exists()) {
      return { id: serviceSnap.id, ...serviceSnap.data() };
    }

    return null;
  } catch (error) {
    console.error('Error fetching service:', error);
    throw error;
  }
};

export const updateService = async (id: string, updateData: any) => {
  if (!db) {
    throw new Error('Firebase not configured. Please set up your Firebase environment variables.');
  }

  try {
    const serviceRef = doc(db, 'services', id);
    await updateDoc(serviceRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

export const deleteService = async (id: string) => {
  if (!db) {
    throw new Error('Firebase not configured. Please set up your Firebase environment variables.');
  }

  try {
    const serviceRef = doc(db, 'services', id);
    await deleteDoc(serviceRef);
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};

// Blog management functions
export const createBlogPost = async (blogData: any) => {
  if (!db) {
    throw new Error('Firebase not configured. Please set up your Firebase environment variables.');
  }

  try {
    const blogsRef = collection(db, 'blogs');
    const now = serverTimestamp();
    const docRef = await addDoc(blogsRef, {
      ...blogData,
      createdAt: now,
      updatedAt: now,
      publishedAt: blogData.published ? now : null,
      views: 0,
      likes: 0,
      comments: 0
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
};

export const getBlogPosts = async (category?: string, featured?: boolean, includeUnpublished = false) => {
  if (!db) {
    console.error('Firebase database not initialized. Check your Firebase configuration.');
    throw new Error('Firebase database not initialized');
  }

  try {
    console.log('Attempting to fetch blog posts from Firestore...', { category, featured, includeUnpublished });
    const blogsRef = collection(db, 'blogs');
    
    // Simplified query to avoid composite index requirements
    let q;
    
    if (includeUnpublished) {
      // For admin - get all posts, simple query first
      q = query(blogsRef);
    } else {
      // For public - only published posts
      q = query(blogsRef, where('published', '==', true));
    }

    console.log('Executing simplified Firestore query...');

    console.log('Executing simplified Firestore query...');
    const querySnapshot = await getDocs(q);
    let blogs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];

    console.log('Raw blogs fetched from Firestore:', blogs.length);
    
    // Apply client-side filtering for category and featured
    if (category && category !== 'all') {
      blogs = blogs.filter((blog: any) => blog.category === category);
      console.log('After category filter:', blogs.length);
    }
    
    if (featured !== undefined) {
      blogs = blogs.filter((blog: any) => blog.featured === featured);
      console.log('After featured filter:', blogs.length);
    }
    
    // Sort by createdAt (client-side to avoid index requirements)
    blogs.sort((a: any, b: any) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });

    console.log('Successfully processed blogs from Firestore:', blogs.length);
    return blogs;
  } catch (error) {
    console.error('Error fetching blog posts from Firestore:', error);
    // Don't return empty array, throw the error so we can handle it properly
    throw error;
  }
};

export const getBlogPost = async (idOrSlug: string) => {
  if (!db) {
    throw new Error('Firebase not configured. Please set up your Firebase environment variables.');
  }

  try {
    // First try to get by ID
    const blogRef = doc(db, 'blogs', idOrSlug);
    const blogSnap = await getDoc(blogRef);

    if (blogSnap.exists()) {
      return { id: blogSnap.id, ...blogSnap.data() };
    }

    // If not found by ID, try to find by slug
    const blogsRef = collection(db, 'blogs');
    const q = query(blogsRef, where('slug', '==', idOrSlug), where('published', '==', true));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }

    return null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    throw error;
  }
};

export const updateBlogPost = async (id: string, updateData: any) => {
  if (!db) {
    throw new Error('Firebase not configured. Please set up your Firebase environment variables.');
  }

  try {
    const blogRef = doc(db, 'blogs', id);
    await updateDoc(blogRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
};

export const deleteBlogPost = async (id: string) => {
  if (!db) {
    throw new Error('Firebase not configured. Please set up your Firebase environment variables.');
  }

  try {
    const blogRef = doc(db, 'blogs', id);
    await deleteDoc(blogRef);
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
};

// File upload functions
export const uploadFile = async (file: File, path: string): Promise<string> => {
  if (!storage) {
    throw new Error('Firebase Storage not configured.');
  }

  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const deleteFile = async (path: string): Promise<void> => {
  if (!storage) {
    throw new Error('Firebase Storage not configured.');
  }

  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// ==================== ADMIN ALERT SYSTEM ====================

// Create alert for specific user
export const createUserAlert = async (userId: string, alertData: {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'renewal';
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  actionText?: string;
}) => {
  if (!db) throw new Error('Firebase not initialized');
  
  try {
    // Build alert document, filtering out undefined values
    const alertDoc: any = {
      userId,
      title: alertData.title,
      message: alertData.message,
      type: alertData.type,
      priority: alertData.priority,
      read: false,
      createdAt: serverTimestamp(),
      createdBy: 'admin'
    };

    // Only add optional fields if they have values
    if (alertData.actionUrl) {
      alertDoc.actionUrl = alertData.actionUrl;
    }
    if (alertData.actionText) {
      alertDoc.actionText = alertData.actionText;
    }

    const docRef = await addDoc(collection(db, 'userAlerts'), alertDoc);
    return docRef.id;
  } catch (error) {
    console.error('Error creating user alert:', error);
    throw error;
  }
};

// Send bulk alerts to multiple users
export const sendBulkAlerts = async (userIds: string[], alertData: {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'renewal';
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  actionText?: string;
}) => {
  if (!db) throw new Error('Firebase not initialized');
  
  try {
    const promises = userIds.map(userId => createUserAlert(userId, alertData));
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error('Error sending bulk alerts:', error);
    throw error;
  }
};

// Get all users for admin panel
export const getAllUsers = async () => {
  if (!db) return [];
  
  try {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

// ==================== ORDER MANAGEMENT ====================

// Create order
export const createOrder = async (orderData: {
  userId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    type: 'service' | 'product';
  }>;
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
}) => {
  if (!db) throw new Error('Firebase not initialized');
  
  try {
    const orderDoc = {
      ...orderData,
      orderId: `ORDER-${Date.now()}`,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'orders'), orderDoc);
    return { id: docRef.id, ...orderDoc };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Get user orders
export const getUserOrders = async (userId: string) => {
  if (!db) return [];
  
  try {
    // Simple query first, then sort in memory if needed
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Sort by createdAt in memory to avoid index requirements
    return orders.sort((a: any, b: any) => {
      const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
      const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
      return bDate.getTime() - aDate.getTime();
    });
  } catch (error) {
    console.error('Error getting user orders:', error);
    // If the query fails, try without any ordering
    try {
      const simpleQ = query(
        collection(db, 'orders'),
        where('userId', '==', userId)
      );
      const simpleSnapshot = await getDocs(simpleQ);
      return simpleSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (fallbackError) {
      console.error('Fallback query also failed:', fallbackError);
      return [];
    }
  }
};

// Get all orders for admin
export const getAllOrders = async (status?: string) => {
  if (!db) return [];
  
  try {
    let q;
    if (status) {
      // Use simple query and sort in memory
      q = query(
        collection(db, 'orders'),
        where('status', '==', status)
      );
    } else {
      q = query(collection(db, 'orders'));
    }
    
    const querySnapshot = await getDocs(q);
    
    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Sort by createdAt in memory
    return orders.sort((a: any, b: any) => {
      const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
      const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
      return bDate.getTime() - aDate.getTime();
    });
  } catch (error) {
    console.error('Error getting orders:', error);
    // Fallback to simple query without filters
    try {
      const simpleQ = query(collection(db, 'orders'));
      const simpleSnapshot = await getDocs(simpleQ);
      return simpleSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (fallbackError) {
      console.error('Fallback orders query failed:', fallbackError);
      return [];
    }
  }
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: string, adminNotes?: string) => {
  if (!db) throw new Error('Firebase not initialized');
  
  try {
    const orderRef = doc(db, 'orders', orderId);
    const updateData: any = {
      status,
      updatedAt: serverTimestamp()
    };
    
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }
    
    await updateDoc(orderRef, updateData);
    
    // Get order details to send notification to user
    const orderDoc = await getDoc(orderRef);
    if (orderDoc.exists()) {
      const orderData = orderDoc.data();
      
      // Send alert to user about status change
      await createUserAlert(orderData.userId, {
        title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: `Your order #${orderData.orderId} status has been updated to: ${status}`,
        type: status === 'completed' ? 'success' : status === 'cancelled' ? 'error' : 'info',
        priority: 'medium',
        actionUrl: `/dashboard?tab=orders`,
        actionText: 'View Order'
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// ==================== SERVICE/PRODUCT STATUS MANAGEMENT ====================

// Update service status and notify user
export const updateServiceStatus = async (serviceId: string, status: string, adminMessage?: string) => {
  if (!db) throw new Error('Firebase not initialized');
  
  try {
    const serviceRef = doc(db, 'services', serviceId);
    await updateDoc(serviceRef, {
      status,
      adminMessage,
      updatedAt: serverTimestamp()
    });

    // Get service details
    const serviceDoc = await getDoc(serviceRef);
    if (serviceDoc.exists()) {
      const serviceData = serviceDoc.data();
      
      // Find users who have this service and notify them
      const userServicesQuery = query(
        collection(db, 'userServices'),
        where('serviceId', '==', serviceId)
      );
      const userServicesSnapshot = await getDocs(userServicesQuery);
      
      const userIds = userServicesSnapshot.docs.map(doc => doc.data().userId);
      
      if (userIds.length > 0) {
        await sendBulkAlerts(userIds, {
          title: `Service Update: ${serviceData.title}`,
          message: adminMessage || `Your service "${serviceData.title}" status has been updated to: ${status}`,
          type: status === 'active' ? 'success' : status === 'suspended' ? 'warning' : 'info',
          priority: 'medium',
          actionUrl: `/services/${serviceId}`,
          actionText: 'View Service'
        });
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error updating service status:', error);
    throw error;
  }
};

// Get user alerts with pagination
export const getUserAlerts = async (userId: string, limit = 20) => {
  if (!db) return [];
  
  try {
    // Simple query first, then sort in memory
    const q = query(
      collection(db, 'userAlerts'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    const alerts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Sort by createdAt in memory and apply limit
    const sortedAlerts = alerts.sort((a: any, b: any) => {
      const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
      const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
      return bDate.getTime() - aDate.getTime();
    });

    return sortedAlerts.slice(0, limit);
  } catch (error) {
    console.error('Error getting user alerts:', error);
    // Fallback to simple query without ordering
    try {
      const simpleQ = query(
        collection(db, 'userAlerts'),
        where('userId', '==', userId)
      );
      const simpleSnapshot = await getDocs(simpleQ);
      return simpleSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).slice(0, limit);
    } catch (fallbackError) {
      console.error('Fallback alerts query failed:', fallbackError);
      return [];
    }
  }
};

// Mark alert as read
export const markAlertAsRead = async (alertId: string) => {
  if (!db) throw new Error('Firebase not initialized');
  
  try {
    const alertRef = doc(db, 'userAlerts', alertId);
    await updateDoc(alertRef, {
      read: true,
      readAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error marking alert as read:', error);
    throw error;
  }
};

// Get user services
export const getUserServices = async (userId: string) => {
  if (!db) return [];
  
  try {
    // Simple query first, then sort in memory
    const q = query(
      collection(db, 'userServices'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    const services = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Sort by createdAt in memory
    return services.sort((a: any, b: any) => {
      const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
      const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
      return bDate.getTime() - aDate.getTime();
    });
  } catch (error) {
    console.error('Error getting user services:', error);
    // Fallback to simple query
    try {
      const simpleQ = query(
        collection(db, 'userServices'),
        where('userId', '==', userId)
      );
      const simpleSnapshot = await getDocs(simpleQ);
      return simpleSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (fallbackError) {
      console.error('Fallback services query failed:', fallbackError);
      return [];
    }
  }
};

// Create user service
export const createUserService = async (serviceData: any) => {
  if (!db) throw new Error('Firebase not initialized');
  
  try {
    const userServicesRef = collection(db, 'userServices');
    const docRef = await addDoc(userServicesRef, {
      ...serviceData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: serviceData.status || 'active'
    });
    return { id: docRef.id, ...serviceData };
  } catch (error) {
    console.error('Error creating user service:', error);
    throw error;
  }
};

// Update user service status
export const updateUserServiceStatus = async (serviceId: string, status: string) => {
  if (!db) throw new Error('Firebase not initialized');
  
  try {
    const serviceRef = doc(db, 'userServices', serviceId);
    await updateDoc(serviceRef, {
      status,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating user service status:', error);
    throw error;
  }
};

// Get user dashboard stats
export const getUserDashboardStats = async (userId: string) => {
  if (!db) return {
    totalOrders: 0,
    totalSpent: 0,
    activeServices: 0,
    expiringServices: 0,
    unreadAlerts: 0,
    monthlySpend: 0
  };
  
  try {
    // Get user orders
    const ordersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', userId)
    );
    const ordersSnapshot = await getDocs(ordersQuery);
    const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Get user services
    const servicesQuery = query(
      collection(db, 'userServices'),
      where('userId', '==', userId)
    );
    const servicesSnapshot = await getDocs(servicesQuery);
    const services = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Get user alerts
    const alertsQuery = query(
      collection(db, 'userAlerts'),
      where('userId', '==', userId),
      where('read', '==', false)
    );
    const alertsSnapshot = await getDocs(alertsQuery);
    
    // Calculate stats
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum: number, order: any) => {
      return sum + (order.total || order.payment?.totalAmount || 0);
    }, 0);
    
    const activeServices = services.filter((service: any) => service.status === 'active').length;
    
    // Calculate expiring services (services expiring in next 30 days)
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    const expiringServices = services.filter((service: any) => {
      if (!service.expiresAt) return false;
      const expiryDate = service.expiresAt.toDate ? service.expiresAt.toDate() : new Date(service.expiresAt);
      return expiryDate <= thirtyDaysFromNow && expiryDate > now;
    }).length;
    
    const unreadAlerts = alertsSnapshot.size;
    
    // Calculate monthly spend (orders from last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const monthlySpend = orders.filter((order: any) => {
      const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
      return orderDate >= thirtyDaysAgo;
    }).reduce((sum: number, order: any) => {
      return sum + (order.total || order.payment?.totalAmount || 0);
    }, 0);
    
    return {
      totalOrders,
      totalSpent,
      activeServices,
      expiringServices,
      unreadAlerts,
      monthlySpend
    };
  } catch (error) {
    console.error('Error getting user dashboard stats:', error);
    return {
      totalOrders: 0,
      totalSpent: 0,
      activeServices: 0,
      expiringServices: 0,
      unreadAlerts: 0,
      monthlySpend: 0
    };
  }
};

// Get user profile
export const getUserProfile = async (userId: string) => {
  if (!db) return null;
  
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, profileData: any) => {
  if (!db) throw new Error('Firebase not initialized');
  
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Export all services
export { app, auth, db, storage, analytics, googleProvider };

export default app;
