# 🌱 Deploy from Git Repository to AWS Elastic Beanstalk
## Connect GitHub Repository to AWS Console

---

## 🎯 **Deploy Directly from Git Repository**

### **Method 1: AWS Console - GitHub Integration (Recommended)**

#### **Step 1: Access AWS Elastic Beanstalk Console**

1. **Go to**: https://console.aws.amazon.com/elasticbeanstalk/
2. **Select region**: `Asia Pacific (Mumbai) ap-south-1`
3. **Click "Create Application"**

#### **Step 2: Configure Application**

1. **Application Information**:
   - **Application name**: `nowest-interior`
   - **Description**: `Nowest Interior Ltd - Interior Design Website`

2. **Click "Next"**

#### **Step 3: Configure Environment**

1. **Environment tier**: `Web server environment`
2. **Platform**:
   - **Platform**: `Node.js`
   - **Platform branch**: `Node.js 18 running on 64bit Amazon Linux 2023`
   - **Platform version**: `Node.js 18.19.0`

3. **Application code**:
   - **Source**: `Public repository`
   - **Repository URL**: `https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME`
   - **Branch**: `main` (or `master`)

4. **Click "Next"**

#### **Step 4: Connect GitHub (If Using Private Repository)**

1. **For private repositories**:
   - Click "Connect to GitHub"
   - Authorize AWS to access your GitHub account
   - Select your repository

2. **For public repositories**:
   - Just enter the repository URL directly

#### **Step 5: Configure Service Access**

1. **Service role**: `Create and use new service role`
2. **EC2 instance profile**: `Create and use new instance profile`
3. **EC2 key pair**: Select existing or create new
4. **Click "Next"**

#### **Step 6: Set Up Networking**

1. **VPC**: `Default VPC`
2. **Load balancer settings**:
   - **Load balancer type**: `Application Load Balancer`
   - **Listener port**: `80` (HTTP)
3. **Instance settings**:
   - **Instance subnets**: Select all available subnets
   - **Instance security group**: `Create new security group`
4. **Click "Next"**

#### **Step 7: Configure Instance**

1. **Instance type**: `t3.micro` (testing) or `t3.small` (production)
2. **Capacity**:
   - **Environment type**: `Single instance` (testing) or `Load balanced` (production)
   - **Instance scaling**: Min: `1`, Max: `3`
3. **Click "Next"**

#### **Step 8: Configure Environment Variables**

Add these environment variables:

**Variable 1:**
- **Name**: `NODE_ENV`
- **Value**: `production`

**Variable 2:**
- **Name**: `DATABASE_URL`
- **Value**: `mysql+pymysql://admin:AKumawat8437@menteetracker.cfiuwyek2vbk.ap-south-1.rds.amazonaws.com:3306/nowest_interior`

**Variable 3:**
- **Name**: `SESSION_SECRET`
- **Value**: `nowest-interior-session-secret-2024-production`

**Variable 4:**
- **Name**: `AWS_REGION`
- **Value**: `ap-south-1`

**Click "Next"**

#### **Step 9: Configure Monitoring**

1. **Health reporting**: `Enhanced`
2. **Health check grace period**: `300` seconds
3. **Health check URL**: `/health`
4. **Click "Next"**

#### **Step 10: Review and Launch**

1. **Review all settings**
2. **Click "Create environment"**
3. **Wait for deployment** (5-10 minutes)

---

## 🔄 **Method 2: Continuous Deployment Setup**

### **Set Up Automatic Deployments**

Once your environment is created, you can set up automatic deployments:

#### **Step 1: Configure Deployment Source**

1. **Go to your environment**
2. **Click "Configuration"** in the left sidebar
3. **Click "Edit"** on "Deployment source"
4. **Configure**:
   - **Source**: `Public repository`
   - **Repository URL**: Your GitHub repository URL
   - **Branch**: `main`
5. **Save changes**

#### **Step 2: Enable Automatic Deployments**

1. **Go to "Configuration"** → "Deployment source"
2. **Click "Edit"**
3. **Enable**: `Automatically deploy new versions`
4. **Save changes**

Now, every time you push to your `main` branch, AWS will automatically deploy the new version!

---

## 🚀 **Method 3: Using EB CLI with Git**

### **Initialize EB with Git Repository**

```bash
# Navigate to your project directory
cd E:\NEWEST\NEWEST

# Initialize EB (if not already done)
eb init

# When prompted:
# - Select region: ap-south-1
# - Select platform: Node.js 18
# - Create new application: nowest-interior

# Create environment from Git
eb create production --source git

# Deploy from current Git state
eb deploy
```

### **Deploy Specific Git Branch**

```bash
# Deploy from specific branch
eb deploy --source git --branch main

# Deploy from specific commit
eb deploy --source git --commit COMMIT_HASH
```

---

## 📋 **Git Repository Requirements**

### **Required Files in Your Repository**

Your Git repository should contain:

```
your-repository/
├── package.json          # Required
├── .ebextensions/        # Required (your config)
│   └── 01-environment.config
├── attached_assets/      # Required (your assets)
├── dist/                 # Will be built during deployment
├── server/               # Your server code
├── client/               # Your client code
└── README.md             # Optional
```

### **Build Process**

AWS Elastic Beanstalk will automatically:

1. **Clone your repository**
2. **Run `npm install`**
3. **Run `npm run build`** (from your package.json)
4. **Start the application** with `npm start`

---

## 🔧 **Configure Build Commands (Optional)**

### **Create .ebextensions/build.config**

If you need custom build commands:

```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
    NodeVersion: 18.19.0
  aws:elasticbeanstalk:container:nodejs:staticfiles:
    /public: dist/public

files:
  "/opt/elasticbeanstalk/hooks/appdeploy/pre/01_build.sh":
    mode: "000755"
    owner: root
    group: root
    content: |
      #!/bin/bash
      cd /var/app/staging
      npm ci
      npm run build
```

---

## 🎯 **Git Deployment Benefits**

### **Advantages of Git Deployment:**

- ✅ **No manual ZIP creation**
- ✅ **Automatic deployments** on code push
- ✅ **Version control** integration
- ✅ **Easy rollbacks** to previous commits
- ✅ **Team collaboration** - multiple developers can deploy
- ✅ **CI/CD integration** possible

### **Automatic Deployment Flow:**

1. **Developer pushes code** to GitHub
2. **AWS detects changes** (if auto-deploy enabled)
3. **AWS pulls latest code** from repository
4. **AWS builds application** (`npm install` + `npm run build`)
5. **AWS deploys new version**
6. **Application is updated** automatically

---

## 🚨 **Troubleshooting Git Deployment**

### **Issue 1: Repository Not Found**

**Symptoms**: AWS can't access your repository

**Solutions**:
1. **Check repository URL** is correct
2. **For private repos**: Ensure GitHub integration is set up
3. **Check repository permissions**

### **Issue 2: Build Failures**

**Symptoms**: Deployment fails during build process

**Solutions**:
1. **Check package.json** has correct scripts
2. **Verify all dependencies** are listed
3. **Check build logs** in EB console

### **Issue 3: Environment Variables Not Working**

**Symptoms**: App uses default values instead of environment variables

**Solutions**:
1. **Re-set environment variables** in EB console
2. **Check .ebextensions** configuration
3. **Restart environment**

---

## 🔄 **Updating Your Application**

### **Deploy New Version from Git**

#### **Method 1: Automatic (if enabled)**
1. **Push changes** to your main branch
2. **AWS automatically deploys** new version

#### **Method 2: Manual**
1. **Go to EB console**
2. **Click "Upload and deploy"**
3. **Select "Deploy from Git"**
4. **Choose branch/commit**
5. **Click "Deploy"**

#### **Method 3: Using EB CLI**
```bash
# Deploy latest from main branch
eb deploy --source git --branch main

# Deploy specific commit
eb deploy --source git --commit abc123
```

---

## 📊 **Git Integration Best Practices**

### **Repository Structure**
```
your-repo/
├── .gitignore           # Ignore node_modules, dist, etc.
├── package.json         # With correct scripts
├── .ebextensions/       # EB configuration
├── server/              # Backend code
├── client/              # Frontend code
└── README.md            # Documentation
```

### **Git Workflow**
1. **Develop locally**
2. **Test with `npm run build`**
3. **Commit changes**
4. **Push to main branch**
5. **AWS auto-deploys** (if enabled)

### **Environment Branches**
- **main/master**: Production deployments
- **develop**: Staging environment
- **feature branches**: Development

---

## 🎉 **Quick Start with Git**

### **1. Ensure Your Repository Has:**
- ✅ `package.json` with build scripts
- ✅ `.ebextensions/01-environment.config`
- ✅ All source code
- ✅ `attached_assets/` folder

### **2. Deploy from Console:**
1. Go to AWS EB Console
2. Create application
3. Select "Public repository"
4. Enter your GitHub URL
5. Configure environment variables
6. Deploy!

### **3. Enable Auto-Deploy:**
1. Go to Configuration → Deployment source
2. Enable "Automatically deploy new versions"
3. Push to main branch = automatic deployment!

**Your application will be live and automatically update when you push code changes!** 🚀
