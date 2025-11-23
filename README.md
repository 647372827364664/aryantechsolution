# Universal Cloud

A modern, premium, and secure hosting & tech solutions platform built with Next.js, TypeScript, and Tailwind CSS.

## 🌟 Features

- **Premium Hosting Solutions** - VPS hosting, domain registration, Minecraft servers
- **Custom Development** - Web apps, mobile apps, Discord/Telegram bots
- **Client Dashboards** - Comprehensive management for clients, admins, and developers
- **Advanced Security** - Multi-factor authentication, secure payments, SSL everywhere
- **SEO Optimized** - Built for search engine visibility and performance
- **Responsive Design** - Mobile-first approach with clean, reusable components

## 🚀 Services Offered

### Hosting Solutions
- VPS Hosting with full root access
- Domain registration and management
- Minecraft Server Hosting
- 99.9% uptime guarantee

### Development Services
- Discord bot development
- Telegram bot development
- AI-powered chatbots
- Custom web applications
- Mobile app development
- Plugin development

### Additional Services
- Developer hiring and management
- Security audits
- Performance optimization
- 24/7 technical support

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library with Lucide icons
- **Authentication**: NextAuth.js with multiple providers
- **Database**: Prisma ORM (configured for multiple databases)
- **Payments**: Stripe integration
- **Email**: Nodemailer for transactional emails
- **Forms**: React Hook Form with Zod validation

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/             # About us page
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── blog/              # Blog pages
│   ├── contact/           # Contact page
│   ├── dashboard/         # Client/Admin/Developer dashboards
│   ├── services/          # Services overview
│   └── store/             # Product/service store
├── components/            # Reusable UI components
│   ├── layout/           # Navigation, footer, etc.
│   └── ui/               # Basic UI components
├── lib/                  # Utility functions
└── types/                # TypeScript type definitions
```

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Design System

The project uses a custom design system with:
- Consistent color palette (Blue primary, with accent colors)
- Typography scale using Inter font
- Reusable component variants
- Responsive grid system
- Dark/Light mode support (planned)

## 👨‍💻 Founder

**Aryan Thakur** - 18-year-old entrepreneur and developer
- Phone: +91 8824187767
- Email: raghavlove305@gmail.com
- Telegram: @aryan_devloper
- Instagram: @aryan_devloper
- Discord: aryanp9986

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="your_database_connection_string"

# Authentication
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
DISCORD_CLIENT_ID="your_discord_client_id"
DISCORD_CLIENT_SECRET="your_discord_client_secret"

# Stripe
STRIPE_PUBLIC_KEY="your_stripe_public_key"
STRIPE_SECRET_KEY="your_stripe_secret_key"

# Email
SMTP_HOST="your_smtp_host"
SMTP_PORT="587"
SMTP_USER="your_smtp_user"
SMTP_PASS="your_smtp_password"
```

## 🚀 Deployment

The application is optimized for deployment on Vercel, the official Next.js platform.

### Deploy on Vercel (Recommended)

#### Option 1: Via Vercel Dashboard (Easiest)
1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Configure environment variables:
   - Click "Environment Variables"
   - Add all variables from `.env.local`
5. Click "Deploy"

#### Option 2: Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# For production deployment
vercel --prod
```

#### Environment Variables to Add in Vercel:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL` (your Vercel domain)
- And other sensitive credentials

#### Custom Domain
1. In Vercel dashboard, go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Other Deployment Options
- **Netlify** - Similar process, supports Next.js
- **DigitalOcean App Platform** - Docker-based deployment
- **AWS Amplify** - AWS-native deployment

## 📄 License

This project is private and proprietary to Universal Cloud.

## 🤝 Contributing

This is a private project. For inquiries about collaboration or employment opportunities, contact Aryan Thakur through the provided contact information.

---

Built with ❤️ by [Aryan Thakur](https://t.me/aryan_devloper) for Universal Cloud
