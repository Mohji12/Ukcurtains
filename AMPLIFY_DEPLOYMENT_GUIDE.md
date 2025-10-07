# AWS Amplify Deployment Guide

This guide will help you deploy your Nowest Interior frontend to AWS Amplify.

## 📋 Prerequisites

- AWS Account with Amplify access
- Your Lambda backend URL: `https://nd5yby5xpbnf6lfh7742ajtkzm0uyuaq.lambda-url.ap-south-1.on.aws`
- Built production files in `dist/public/` folder

## 🚀 Deployment Steps

### Step 1: Prepare Your Repository

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Prepare for Amplify deployment"
   git push origin main
   ```

### Step 2: Deploy to AWS Amplify

#### Option A: Deploy via AWS Console (Recommended)

1. **Go to AWS Amplify Console**
   - Open [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click **"New app"** → **"Host web app"**

2. **Connect Repository**
   - Choose your Git provider (GitHub, GitLab, etc.)
   - Select your repository: `bhc`
   - Choose the branch: `main`

3. **Configure Build Settings**
   - Amplify will auto-detect the `amplify.yml` file
   - Verify the build configuration:
     ```yaml
     version: 1
     frontend:
       phases:
         preBuild:
           commands:
             - echo "Installing dependencies..."
             - npm ci
         build:
           commands:
             - echo "Building the app..."
             - npm run build
       artifacts:
         baseDirectory: dist/public
         files:
           - '**/*'
       cache:
         paths:
           - node_modules/**/*
           - .npm/**/*
     ```

4. **Set Environment Variables**
   - Go to **App settings** → **Environment variables**
   - Add: `VITE_API_BASE_URL` = `https://nd5yby5xpbnf6lfh7742ajtkzm0uyuaq.lambda-url.ap-south-1.on.aws`

5. **Deploy**
   - Click **"Save and deploy"**
   - Wait for the build to complete

#### Option B: Deploy via AWS CLI

1. **Install AWS CLI** (if not already installed)

2. **Configure AWS CLI:**
   ```bash
   aws configure
   ```

3. **Create Amplify App:**
   ```bash
   aws amplify create-app --name "nowest-interior" --repository "https://github.com/your-username/bhc"
   ```

4. **Create Branch:**
   ```bash
   aws amplify create-branch --app-id YOUR_APP_ID --branch-name main
   ```

5. **Start Deployment:**
   ```bash
   aws amplify start-job --app-id YOUR_APP_ID --branch-name main --job-type RELEASE
   ```

### Step 3: Configure Custom Domain (Optional)

1. **In Amplify Console:**
   - Go to **Domain management**
   - Click **"Add domain"**
   - Enter your custom domain
   - Follow the DNS configuration steps

## 🔧 Configuration Details

### Build Configuration (`amplify.yml`)
- **Base Directory**: `dist/public` (where Vite outputs the built files)
- **Build Command**: `npm run build`
- **Install Command**: `npm ci` (faster, more reliable for CI/CD)

### Environment Variables
- **VITE_API_BASE_URL**: Points to your Lambda backend
- **NODE_ENV**: Set to `production` automatically

### API Configuration
Your frontend is configured to use:
- **Backend URL**: `https://nd5yby5xpbnf6lfh7742ajtkzm0uyuaq.lambda-url.ap-south-1.on.aws`
- **CORS**: Properly configured for cross-origin requests

## 📁 File Structure for Deployment

```
dist/
└── public/
    ├── index.html
    ├── assets/
    │   ├── index-[hash].js
    │   ├── index-[hash].css
    │   └── [image-files]
    └── [other-static-files]
```

## 🎯 Post-Deployment Checklist

- [ ] Verify the app loads correctly
- [ ] Test API calls to Lambda backend
- [ ] Check that images load properly
- [ ] Test admin login functionality
- [ ] Verify CORS is working
- [ ] Test all major features (Products, Portfolio, Contact, etc.)

## 🚨 Troubleshooting

### Common Issues:

1. **Build Fails:**
   - Check Node.js version (should be 18+)
   - Verify all dependencies are in `package.json`
   - Check build logs in Amplify console

2. **API Calls Fail:**
   - Verify `VITE_API_BASE_URL` environment variable
   - Check CORS configuration in Lambda
   - Test Lambda endpoint directly

3. **Images Not Loading:**
   - Verify image paths in the built files
   - Check that images are in the correct `assets/` folder

4. **Admin Login Issues:**
   - Verify Lambda backend is running
   - Check session management configuration
   - Test admin credentials

## 📞 Support

If you encounter issues:
1. Check the Amplify build logs
2. Verify Lambda backend is accessible
3. Test API endpoints directly
4. Check browser console for errors

## 🎉 Success!

Once deployed, your Nowest Interior website will be live on AWS Amplify with:
- ✅ Fast, global CDN delivery
- ✅ Automatic HTTPS
- ✅ Lambda backend integration
- ✅ Production-ready performance
