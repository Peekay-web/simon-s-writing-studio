# Setup Guide - Simon's Writing Studio

## 🐧 Linux Terminal Options for Windows

### Option 1: Windows Subsystem for Linux (WSL) - Recommended
```bash
# Install WSL2 (run in PowerShell as Administrator)
wsl --install

# After restart, install Ubuntu
wsl --install -d Ubuntu

# Access your project in WSL
cd /mnt/c/Users/PARAKLETOS/Downloads/simon-s-writing-studio-main
```

### Option 2: Git Bash (Already installed with Git)
```bash
# Open Git Bash from Start Menu or right-click in folder
# Navigate to your project
cd /c/Users/PARAKLETOS/Downloads/simon-s-writing-studio-main
```

### Option 3: Windows Terminal with Ubuntu
```bash
# Install Windows Terminal from Microsoft Store
# Add Ubuntu profile for Linux commands
```

## 🚀 Full Stack Setup

### Prerequisites
1. **Node.js** (already installed)
2. **MongoDB** - Install MongoDB Community Server
3. **Git** (already installed)

### Installation Steps

1. **Install all dependencies:**
```bash
npm run install:all
```

2. **Set up environment variables:**
```bash
cd server
cp .env.example .env
# Edit .env file with your settings
```

3. **Start MongoDB:**
```bash
# Windows Service (if installed as service)
net start MongoDB

# Or manual start
mongod --dbpath "C:\data\db"
```

4. **Start the full application:**
```bash
npm run start:full
```

This will start both:
- Backend API server on http://localhost:5000
- Frontend React app on http://localhost:8080

## 📁 Project Structure

```
simon-s-writing-studio-main/
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── pages/             # Page components
│   └── ...
├── server/                # Backend Node.js API
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── ...
└── package.json           # Frontend dependencies
```

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Start frontend development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `npm run server:dev` - Start backend development server
- `npm run server:install` - Install backend dependencies

### Full Stack
- `npm run start:full` - Start both frontend and backend
- `npm run install:all` - Install all dependencies

## 🎯 Features

### Admin Features
- Upload Word, Excel, PowerPoint, PDF files
- Manage portfolio items
- View analytics and visitor stats
- Approve/reject testimonials
- Update profile picture

### Public Features
- View portfolio with file previews
- Submit testimonials with ratings
- Contact form
- Responsive design

### File Viewers
- **Word Documents**: Converted to HTML for viewing
- **Excel Files**: Interactive spreadsheet viewer
- **PowerPoint**: Slide-by-slide image viewer
- **PDF Files**: Native PDF viewer

## 🔒 Security Features
- JWT authentication
- File upload validation
- Rate limiting
- Secure file viewing (no downloads for public)
- Input sanitization

## 📊 Analytics
- Page view tracking
- Portfolio item views
- Visitor statistics
- Referrer analysis
- Geographic data (optional)

## 🛠️ Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB service
net start MongoDB
```

### Port Conflicts
- Frontend: Change port in `vite.config.ts`
- Backend: Change PORT in `.env` file

### File Upload Issues
- Check file size limits (50MB for Office files)
- Ensure upload directory permissions
- Verify LibreOffice installation for PowerPoint conversion
```