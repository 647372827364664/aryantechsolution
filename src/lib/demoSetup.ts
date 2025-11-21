// Demo setup for role-based authentication and blog posts
// This file demonstrates how to set up test users and blog posts for different roles

import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db, createBlogPost } from './firebase';

// Demo user creation function (for development/testing only)
export const createDemoUsers = async () => {
  if (!auth || !db) {
    console.error('Firebase not configured');
    return;
  }

  const demoUsers = [
    {
      email: 'admin@aryantechsolution.dev',
      password: 'demo123',
      name: 'Admin User',
      role: 'admin'
    },
    {
      email: 'developer@aryantechsolution.dev', 
      password: 'demo123',
      name: 'Developer User',
      role: 'developer'
    },
    {
      email: 'client@aryantechsolution.dev',
      password: 'demo123', 
      name: 'Client User',
      role: 'client'
    }
  ];

  for (const user of demoUsers) {
    try {
      // Create authentication user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        user.email, 
        user.password
      );
      
      // Create user document in Firestore with role
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      console.log(`Demo user created: ${user.email} (${user.role})`);
    } catch (error) {
      console.error(`Error creating demo user ${user.email}:`, error);
    }
  }
};

// Demo role assignment function
export const assignUserRole = async (userId: string, role: 'admin' | 'developer' | 'client') => {
  if (!db) {
    console.error('Firebase not configured');
    return;
  }

  try {
    await setDoc(doc(db, 'users', userId), {
      role,
      updatedAt: new Date(),
    }, { merge: true });
    
    console.log(`User role updated to: ${role}`);
  } catch (error) {
    console.error('Error updating user role:', error);
  }
};

// Demo blog post creation function
export const createDemoBlogPosts = async () => {
  if (!db) {
    console.error('Firebase not configured');
    return;
  }

  const demoPosts = [
    {
      title: "Getting Started with Cloud Infrastructure",
      slug: "getting-started-cloud-infrastructure",
      excerpt: "Learn the fundamentals of cloud infrastructure and how to set up your first cloud environment with best practices and security considerations.",
      content: `# Getting Started with Cloud Infrastructure

Cloud infrastructure is the foundation of modern web applications and services. In this comprehensive guide, we'll explore the fundamentals of cloud computing and help you get started with your first cloud environment.

## What is Cloud Infrastructure?

Cloud infrastructure refers to the collection of hardware and software components that enable cloud computing. This includes servers, storage, networking, and virtualization software that work together to deliver computing resources over the internet.

### Key Benefits of Cloud Infrastructure

1. **Scalability**: Easily scale resources up or down based on demand
2. **Cost-Effective**: Pay only for what you use
3. **Reliability**: High availability and redundancy
4. **Security**: Enterprise-grade security features
5. **Global Reach**: Deploy applications worldwide

## Getting Started

To begin your cloud journey, you'll need to:

1. Choose a cloud provider (AWS, Google Cloud, Azure)
2. Set up your account and billing
3. Learn the basic services
4. Plan your architecture
5. Implement security best practices

## Best Practices

- Always enable multi-factor authentication
- Use Infrastructure as Code (IaC)
- Implement proper monitoring and logging
- Regular backups and disaster recovery planning
- Cost optimization and resource tagging

Ready to start your cloud journey? Contact our team for expert guidance and support!`,
      author: {
        name: "Admin User",
        role: "Cloud Architect"
      },
      category: "Cloud Infrastructure",
      tags: ["cloud", "infrastructure", "aws", "tutorial", "beginner"],
      featured: true,
      published: true,
      featuredImage: "/api/placeholder/800/400"
    },
    {
      title: "Building Modern Web Applications with Next.js",
      slug: "building-modern-web-apps-nextjs",
      excerpt: "Discover how to build fast, scalable, and SEO-friendly web applications using Next.js, React, and modern development practices.",
      content: `# Building Modern Web Applications with Next.js

Next.js has revolutionized the way we build React applications. In this guide, we'll explore how to create modern, performant web applications using Next.js and its ecosystem.

## Why Next.js?

Next.js provides several advantages over traditional React applications:

- **Server-Side Rendering (SSR)**: Better SEO and initial page load performance
- **Static Site Generation (SSG)**: Pre-render pages at build time for maximum performance
- **API Routes**: Built-in API functionality
- **File-based Routing**: Intuitive routing system
- **Automatic Code Splitting**: Optimize bundle sizes automatically

## Getting Started

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## Key Features to Explore

1. **App Router**: The new routing system in Next.js 13+
2. **Server Components**: Render components on the server
3. **Streaming**: Progressive page rendering
4. **Image Optimization**: Built-in image optimization
5. **Font Optimization**: Automatic font loading optimization

## Best Practices

- Use TypeScript for type safety
- Implement proper error boundaries
- Optimize images and fonts
- Use server components when possible
- Implement proper caching strategies

Start building your next project with Next.js today!`,
      author: {
        name: "Admin User",
        role: "Full Stack Developer"
      },
      category: "Web Development",
      tags: ["nextjs", "react", "javascript", "web development", "tutorial"],
      featured: false,
      published: true,
      featuredImage: "/api/placeholder/800/400"
    },
    {
      title: "Cybersecurity Best Practices for Small Businesses",
      slug: "cybersecurity-best-practices-small-business",
      excerpt: "Essential cybersecurity measures every small business should implement to protect against cyber threats and data breaches.",
      content: `# Cybersecurity Best Practices for Small Businesses

Cybersecurity is crucial for businesses of all sizes. Small businesses are often targeted by cybercriminals because they typically have weaker security measures. Here's how to protect your business.

## Common Cyber Threats

Small businesses face various cyber threats:

- **Phishing Attacks**: Deceptive emails to steal credentials
- **Ransomware**: Malicious software that encrypts data
- **Data Breaches**: Unauthorized access to sensitive information
- **Social Engineering**: Manipulation to reveal confidential information
- **Malware**: Harmful software that can damage systems

## Essential Security Measures

### 1. Employee Training
- Regular cybersecurity awareness training
- Phishing simulation exercises
- Clear security policies and procedures

### 2. Strong Password Policies
- Use complex passwords with special characters
- Enable two-factor authentication (2FA)
- Regular password updates

### 3. Keep Software Updated
- Install security patches promptly
- Use automatic updates when possible
- Maintain an inventory of all software

### 4. Backup Your Data
- Regular automated backups
- Test backup restoration procedures
- Store backups in multiple locations

### 5. Network Security
- Use firewalls and antivirus software
- Secure Wi-Fi networks
- Regular security audits

## Creating a Incident Response Plan

Having a plan in place before an incident occurs is crucial:

1. **Preparation**: Establish security policies and procedures
2. **Detection**: Monitor for security incidents
3. **Response**: Take immediate action to contain threats
4. **Recovery**: Restore normal operations
5. **Lessons Learned**: Improve security measures

## Conclusion

Cybersecurity is an ongoing process, not a one-time setup. Regular reviews and updates of your security measures are essential to stay protected against evolving threats.

Need help securing your business? Our cybersecurity experts are here to help!`,
      author: {
        name: "Admin User",
        role: "Security Specialist"
      },
      category: "Security",
      tags: ["cybersecurity", "small business", "security", "data protection", "best practices"],
      featured: true,
      published: true,
      featuredImage: "/api/placeholder/800/400"
    }
  ];

  try {
    console.log('Creating demo blog posts...');
    for (const post of demoPosts) {
      await createBlogPost(post);
      console.log(`✅ Created demo blog post: ${post.title}`);
    }
    console.log('🎉 All demo blog posts created successfully!');
  } catch (error) {
    console.error('❌ Error creating demo blog posts:', error);
  }
};
