# 🌱 AWS Elastic Beanstalk Deployment Guide
## Complete Step-by-Step Instructions for Nowest Interior Ltd

---

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ AWS Account with appropriate permissions
- ✅ AWS CLI installed and configured
- ✅ Node.js 18+ on your local machine
- ✅ Python 3.7+ (for EB CLI)
- ✅ Git repository with your code

---

## 🚀 Step 1: Install and Configure AWS Tools

### 1.1 Install AWS CLI
```bash
# Windows (using pip)
pip install awscli

# Or download from: https://aws.amazon.com/cli/
```

### 1.2 Configure AWS CLI
```bash
aws configure
```
Enter your credentials:
- **AWS Access Key ID**: [Your Access Key]
- **AWS Secret Access Key**: [Your Secret Key]
- **Default region name**: `ap-south-1`
- **Default output format**: `json`

### 1.3 Install Elastic Beanstalk CLI
```bash
pip install awsebcli
```

### 1.4 Verify Installation
```bash
eb --version
aws --version
```

---

## 🏗️ Step 2: Prepare Your Application

### 2.1 Build Your Application
```bash
# Navigate to your project directory
cd E:\NEWEST\NEWEST

# Install dependencies
npm install

# Build the application
npm run build
```

### 2.2 Verify Build Output
```bash
# Check if dist directory exists
ls dist/
# Should see: index.js and public/ directory
```

---

## 🌱 Step 3: Initialize Elastic Beanstalk

### 3.1 Initialize EB Application
```bash
eb init
```

**Follow these prompts:**
1. **Select a default region**: Choose `ap-south-1` (Mumbai)
2. **Select an application to use**: Choose `[ Create new Application ]`
3. **Enter Application Name**: `nowest-interior`
4. **Do you want to set up SSH for your instances?**: `Y`
5. **Select a keypair**: Choose an existing keypair or create a new one
6. **Select a platform**: Choose `Node.js`
7. **Select a platform branch**: Choose `Node.js 18 running on 64bit Amazon Linux 2023`
8. **Do you want to set up a database?**: `N` (you already have RDS)

### 3.2 Verify EB Configuration
```bash
# Check if .elasticbeanstalk directory was created
ls -la .elasticbeanstalk/
```

---

## 🚀 Step 4: Create and Deploy Environment

### 4.1 Create Production Environment
```bash
eb create production
```

**This will:**
- Create a new environment named "production"
- Launch EC2 instances
- Set up load balancer
- Configure auto-scaling
- Deploy your application

**Wait for deployment to complete** (5-10 minutes)

### 4.2 Check Deployment Status
```bash
eb status
```

### 4.3 View Application URL
```bash
eb open
```

---

## ⚙️ Step 5: Configure Environment Variables

### 5.1 Set Environment Variables
```bash
# Set all required environment variables
eb setenv NODE_ENV=production
eb setenv DATABASE_URL=mysql+pymysql://admin:AKumawat8437@menteetracker.cfiuwyek2vbk.ap-south-1.rds.amazonaws.com:3306/nowest_interior
eb setenv SESSION_SECRET=nowest-interior-session-secret-2024-production
eb setenv AWS_REGION=ap-south-1
```

### 5.2 Verify Environment Variables
```bash
eb printenv
```

---

## 🔧 Step 6: Configure Security and Networking

### 6.1 Configure Security Groups
```bash
# Open EB console to configure security groups
eb console
```

**In the AWS Console:**
1. Go to **Configuration** → **Instances**
2. Click **Edit** on Security Groups
3. Ensure these ports are open:
   - **Port 80** (HTTP) - Source: 0.0.0.0/0
   - **Port 443** (HTTPS) - Source: 0.0.0.0/0
   - **Port 5000** (Your App) - Source: 0.0.0.0/0

### 6.2 Configure Load Balancer
1. Go to **Configuration** → **Load Balancer**
2. Click **Edit**
3. Ensure **HTTP** and **HTTPS** listeners are configured
4. Set **Health Check Path**: `/health`

---

## 🎯 Step 7: Test Your Deployment

### 7.1 Test Application Endpoints
```bash
# Get your application URL
eb status

# Test health endpoint
curl https://your-app-url.elasticbeanstalk.com/health

# Test API endpoints
curl https://your-app-url.elasticbeanstalk.com/api/products
```

### 7.2 Test Frontend
1. Open your application URL in browser
2. Navigate through different pages
3. Test form submissions
4. Check admin panel access

---

## 🔄 Step 8: Set Up Continuous Deployment

### 8.1 Deploy Updates
```bash
# Make changes to your code
# Build the application
npm run build

# Deploy to EB
eb deploy
```

### 8.2 Monitor Deployment
```bash
# View deployment logs
eb logs

# View real-time logs
eb logs --all
```

---

## 🛠️ Step 9: Advanced Configuration

### 9.1 Custom Domain (Optional)
```bash
# Configure custom domain
eb config
```

**Add to configuration:**
```yaml
option_settings:
  aws:elasticbeanstalk:customoption:
    DomainName: yourdomain.com
```

### 9.2 SSL Certificate
1. Go to **Configuration** → **Load Balancer**
2. Add SSL certificate
3. Configure HTTPS redirect

### 9.3 Auto Scaling
1. Go to **Configuration** → **Capacity**
2. Set **Min instances**: 1
3. Set **Max instances**: 10
4. Configure **Scaling triggers**

---

## 📊 Step 10: Monitoring and Maintenance

### 10.1 Monitor Application
```bash
# View application health
eb health

# View detailed status
eb status --verbose
```

### 10.2 View Logs
```bash
# Download recent logs
eb logs

# View specific log files
eb logs --all
```

### 10.3 Scale Application
```bash
# Scale up/down
eb scale 2

# View current capacity
eb status
```

---

## 🚨 Troubleshooting Common Issues

### Issue 1: Build Failures
```bash
# Check build logs
eb logs

# Common fixes:
# 1. Ensure all dependencies are in package.json
# 2. Check Node.js version compatibility
# 3. Verify build script in package.json
```

### Issue 2: Environment Variables Not Working
```bash
# Re-set environment variables
eb setenv NODE_ENV=production
eb setenv DATABASE_URL=your-database-url

# Restart application
eb restart
```

### Issue 3: Database Connection Issues
```bash
# Check RDS security groups
# Ensure EB security group can access RDS
# Verify database URL format
```

### Issue 4: Static Files Not Loading
```bash
# Check .ebextensions/01-environment.config
# Verify static file mapping: /public: dist/public
```

---

## 🎉 Quick Deployment Commands

```bash
# Complete deployment in one go
npm run build && eb deploy

# Deploy with specific environment
eb deploy production

# Deploy and open in browser
eb deploy && eb open

# View deployment status
eb status

# View logs
eb logs --all
```

---

## 📋 Environment Variables Summary

Your application needs these environment variables:
```bash
NODE_ENV=production
DATABASE_URL=mysql+pymysql://admin:AKumawat8437@menteetracker.cfiuwyek2vbk.ap-south-1.rds.amazonaws.com:3306/nowest_interior
SESSION_SECRET=nowest-interior-session-secret-2024-production
AWS_REGION=ap-south-1
```

---

## 🎯 Next Steps After Deployment

1. **Test all functionality** - Ensure everything works
2. **Set up monitoring** - Configure CloudWatch alarms
3. **Set up backups** - Configure RDS backups
4. **Configure custom domain** - Point your domain to EB
5. **Set up SSL** - Enable HTTPS
6. **Monitor costs** - Set up billing alerts

---

## 📞 Support

If you encounter issues:
1. Check the logs: `eb logs --all`
2. Check EB health: `eb health`
3. Review AWS CloudWatch logs
4. Check EB documentation: https://docs.aws.amazon.com/elasticbeanstalk/

**Your application should now be live on AWS Elastic Beanstalk!** 🎉
