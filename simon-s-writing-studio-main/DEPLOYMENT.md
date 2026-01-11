# Deployment Guide for Render

This guide will help you deploy Simon's Writing Studio to Render with SQLite database.

## 🚀 Quick Deployment Steps

### 1. Backend Deployment on Render

1. **Create a Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure the Service**
   - **Name**: `simon-writing-studio-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Environment Variables**
   Add these environment variables in Render:
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-change-this-now
   ADMIN_EMAIL=PARAKLETOS@ADMINRG-CFKA0M4
   ADMIN_PASSWORD=GODABEG
   FRONTEND_URL=https://your-frontend-domain.onrender.com
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL (e.g., `https://simon-writing-studio-backend.onrender.com`)

### 2. Frontend Deployment on Render

1. **Create a Static Site**
   - Click "New" → "Static Site"
   - Connect the same GitHub repository

2. **Configure the Static Site**
   - **Name**: `simon-writing-studio-frontend`
   - **Root Directory**: Leave empty (root)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

3. **Environment Variables** (if needed)
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

4. **Deploy**
   - Click "Create Static Site"
   - Wait for build and deployment

### 3. Update Frontend API Configuration

After backend deployment, update the frontend to use the production API URL:

1. Create `src/config/api.ts`:
   ```typescript
   const API_BASE_URL = import.meta.env.VITE_API_URL || 
     (import.meta.env.PROD 
       ? 'https://your-backend-url.onrender.com' 
       : 'http://localhost:5000');

   export default API_BASE_URL;
   ```

2. Update axios configuration in your components to use this base URL.

## 🔧 Configuration Details

### Backend Configuration

The backend is configured for Render deployment with:

- **SQLite Database**: Automatically created and persisted
- **File Uploads**: Stored in `/uploads` directory
- **Environment Variables**: Configured for production
- **CORS**: Configured to allow frontend domain

### Database

- **Type**: SQLite (file-based)
- **Location**: `server/database.sqlite`
- **Persistence**: Automatic with Render's persistent disk
- **Migrations**: Auto-sync on startup
- **Admin User**: Created automatically on first run

### File Storage

- **Upload Directory**: `server/uploads/`
- **Supported Files**: PDF, DOCX, PPTX, XLSX, Images
- **Size Limit**: 10MB per file
- **Persistence**: Files persist with deployment

## 🔒 Security Considerations

### Environment Variables

**Required for Production:**
```bash
NODE_ENV=production
JWT_SECRET=generate-a-strong-secret-key-here
ADMIN_EMAIL=your-admin-email@domain.com
ADMIN_PASSWORD=your-secure-password
FRONTEND_URL=https://your-frontend-domain.com
```

**Optional:**
```bash
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### JWT Secret Generation

Generate a strong JWT secret:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or use online generator (ensure it's secure)
```

## 📊 Monitoring & Maintenance

### Health Checks

The backend includes a health check endpoint:
- `GET /api/health` - Returns server status

### Logs

Monitor your application through Render's dashboard:
- **Build Logs**: Check for deployment issues
- **Runtime Logs**: Monitor application errors
- **Metrics**: Track performance and usage

### Database Backup

Since SQLite is file-based, consider periodic backups:
1. Download the `database.sqlite` file from your service
2. Store backups securely
3. Can restore by replacing the file

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check build logs for specific errors

2. **Database Connection Issues**
   - SQLite creates automatically, no external connection needed
   - Check file permissions in deployment environment

3. **CORS Errors**
   - Verify FRONTEND_URL environment variable
   - Check that frontend domain matches exactly

4. **File Upload Issues**
   - Ensure uploads directory exists
   - Check file size limits
   - Verify multer configuration

### Performance Optimization

1. **Frontend**
   - Enable gzip compression
   - Optimize images and assets
   - Use CDN for static assets

2. **Backend**
   - Enable response compression
   - Implement caching where appropriate
   - Monitor database query performance

## 🔄 Updates & Maintenance

### Updating the Application

1. **Code Updates**
   - Push changes to GitHub
   - Render auto-deploys from connected repository

2. **Database Schema Changes**
   - Sequelize handles migrations automatically
   - Test changes in development first

3. **Environment Variables**
   - Update through Render dashboard
   - Restart service after changes

### Scaling Considerations

- **Render Free Tier**: Suitable for development and small traffic
- **Paid Plans**: Better performance and no sleep mode
- **Database**: SQLite suitable for small to medium applications
- **File Storage**: Consider external storage for large file volumes

## 📞 Support

If you encounter issues:

1. Check Render's documentation
2. Review application logs
3. Test locally first
4. Contact support if needed

---

**Happy Deploying! 🚀**