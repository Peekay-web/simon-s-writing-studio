# Simon's Writing Studio

A full-stack professional portfolio website for Hon. Chukwuemeka Samuel PK Simon - Research Writer, Consultant, and Freelancer with complete admin dashboard and content management system.

## 🌟 Features

- **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **Modern Full-Stack Architecture** - React frontend with Node.js backend
- **Admin Dashboard** - Complete content management system
- **Testimonials System** - Real client feedback with ratings and auto-approval
- **Blog Management** - Rich text editor for content creation
- **File Viewer** - Support for PDF, Word, Excel, PowerPoint files
- **Analytics Dashboard** - Track views and user engagement
- **SQLite Database** - Self-contained, no external database required
- **Professional Styling** - Subtle blue color scheme with smooth animations
- **Contact Form** - Integrated contact form with validation
- **WhatsApp Integration** - Direct WhatsApp contact button
- **SEO Optimized** - Proper meta tags and structured content

## 🚀 Services Offered

- Research Writing
- Academic Project Writing (ND, HND, BSc, PGD, MSc, PhD)
- Content Writing
- Copywriting
- Consulting Services
- Editing & Proofreading

## 🛠️ Tech Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS & shadcn/ui components
- React Router DOM for navigation
- Axios for API calls
- React Hook Form with Zod validation

**Backend:**
- Node.js with Express
- SQLite database with Sequelize ORM
- JWT authentication
- Multer for file uploads
- Rich text editor support

**Build Tools:**
- Vite (Frontend)
- Nodemon (Backend development)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Local Development

1. **Clone the repository:**
```bash
git clone https://github.com/Peekay-web/simon-s-writing-studio.git
cd simon-s-writing-studio
```

2. **Install dependencies:**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

3. **Environment Setup:**
```bash
# Copy environment file
cp server/.env.example server/.env
# Edit server/.env with your settings if needed
```

4. **Start Development Servers:**
```bash
# Start both frontend and backend
npm run start:full

# Or start individually:
# Frontend: npm run dev
# Backend: cd server && npm run dev
```

5. **Access the Application:**
- Frontend: http://localhost:8080
- Backend API: http://localhost:5000
- Admin Dashboard: http://localhost:8080/admin

### Default Admin Credentials
- **Email:** PARAKLETOS@ADMINRG-CFKA0M4
- **Password:** GODABEG

## 🌐 Deployment

### Render Deployment (Recommended)

**Backend Deployment:**
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set root directory to `server`
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add environment variables:
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-here
   ADMIN_EMAIL=PARAKLETOS@ADMINRG-CFKA0M4
   ADMIN_PASSWORD=GODABEG
   FRONTEND_URL=https://your-frontend-domain.com
   ```

**Frontend Deployment:**
1. Build: `npm run build`
2. Deploy `dist` folder to Render Static Site, Vercel, or Netlify
3. Update API base URL to point to your backend service

### Database
- SQLite database is automatically created
- No external database setup required
- Data persists with deployment

## 🏗️ Build Commands

```bash
# Frontend build
npm run build

# Backend (no build needed)
cd server && npm start
```

## 📁 Project Structure

```
simon-s-writing-studio/
├── src/                          # Frontend React app
│   ├── components/              # Reusable components
│   ├── pages/                   # Page components (Index, Testimonials, Blog, etc.)
│   ├── contexts/               # React contexts (Auth)
│   └── lib/                    # Utilities
├── server/                      # Backend Express app
│   ├── config/                 # Database configuration
│   ├── models/                 # Sequelize models
│   ├── routes/                 # API routes
│   ├── middleware/             # Custom middleware
│   ├── uploads/                # File uploads
│   └── database.sqlite         # SQLite database (auto-created)
└── public/                     # Static assets
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user

### Testimonials
- `GET /api/testimonials` - Get approved testimonials
- `POST /api/testimonials` - Submit new testimonial
- `GET /api/testimonials/pending` - Get pending testimonials (Admin)

### Blog
- `GET /api/blog` - Get published blog posts
- `GET /api/blog/:slug` - Get single blog post
- `POST /api/blog` - Create blog post (Admin)

### Portfolio & Analytics
- Complete CRUD operations for portfolio management
- Analytics tracking for views and engagement

## 📱 Contact Information

- **Email:** chukwuemekasimon@yahoo.com
- **Phone:** +234 808 245 3150
- **Location:** Nigeria

## 🔒 Security Features

- JWT authentication for admin access
- Input validation and sanitization
- Rate limiting on API endpoints
- Secure file upload handling
- CORS protection

## 📄 License

© 2026 Hon. Chukwuemeka Samuel PK Simon. All rights reserved.

---

*Professional writing services with modern technology stack for academic and business success.*