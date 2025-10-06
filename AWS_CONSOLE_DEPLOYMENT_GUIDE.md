# 🌱 AWS Elastic Beanstalk Console Deployment Guide
## Deploy from AWS Web Console (No Command Line Required)

---

## 🎯 **Step-by-Step Console Deployment**

### **Step 1: Access AWS Elastic Beanstalk Console**

1. **Open your web browser** and go to: https://console.aws.amazon.com/elasticbeanstalk/
2. **Sign in** to your AWS account
3. **Select region**: Choose `Asia Pacific (Mumbai) ap-south-1` from the top-right dropdown

---

### **Step 2: Create New Application**

1. **Click "Create Application"** (orange button)
2. **Application Information**:
   - **Application name**: `nowest-interior`
   - **Description**: `Nowest Interior Ltd - Interior Design Website`
3. **Click "Next"**

---

### **Step 3: Configure Environment**

1. **Environment tier**: Select `Web server environment`
2. **Platform**:
   - **Platform**: `Node.js`
   - **Platform branch**: `Node.js 18 running on 64bit Amazon Linux 2023`
   - **Platform version**: `Node.js 18.19.0` (recommended)
3. **Application code**:
   - **Source**: `Upload your code`
   - **Version label**: `v1.0`
4. **Click "Next"**

---

### **Step 4: Upload Your Application Code**

#### **Option A: Upload ZIP File (Recommended)**

1. **Prepare your application**:
   ```bash
   # In your project directory, create a deployment package
   # Make sure to build first
   npm run build
   
   # Create a ZIP file with these contents:
   # - package.json
   # - dist/ folder
   # - .ebextensions/ folder
   # - attached_assets/ folder
   ```

2. **Create deployment ZIP**:
   - Select these files/folders:
     - `package.json`
     - `dist/` (entire folder)
     - `.ebextensions/` (entire folder)
     - `attached_assets/` (entire folder)
   - Create a ZIP file named `nowest-interior-v1.zip`

3. **Upload the ZIP**:
   - Click "Choose file"
   - Select your `nowest-interior-v1.zip`
   - Click "Next"

#### **Option B: Connect to GitHub (Alternative)**

1. **Source**: Select `Public repository`
2. **Repository**: Enter your GitHub repository URL
3. **Branch**: `main` or `master`
4. **Click "Next"**

---

### **Step 5: Configure Service Access**

1. **Service role**: `Create and use new service role`
2. **EC2 instance profile**: `Create and use new instance profile`
3. **EC2 key pair**: Select an existing key pair or create new one
4. **Click "Next"**

---

### **Step 6: Set Up Networking**

1. **VPC**: `Default VPC`
2. **Load balancer settings**:
   - **Load balancer type**: `Application Load Balancer`
   - **Listener port**: `80` (HTTP)
   - **Process**: `default`
3. **Instance settings**:
   - **Instance subnets**: Select all available subnets
   - **Instance security group**: `Create new security group`
4. **Click "Next"**

---

### **Step 7: Configure Instance**

1. **Instance type**: `t3.micro` (for testing) or `t3.small` (for production)
2. **EC2 security groups**: `Create new security group`
3. **Capacity**:
   - **Environment type**: `Single instance` (for testing) or `Load balanced` (for production)
   - **Instance scaling**: 
     - Min: `1`
     - Max: `3`
4. **Rolling updates and deployments**:
   - **Deployment policy**: `Rolling`
   - **Batch size**: `30%`
5. **Click "Next"**

---

### **Step 8: Configure Environment Variables**

1. **Environment properties** section:
   - Click "Add environment property"
   - Add these variables one by one:

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

2. **Click "Next"**

---

### **Step 9: Configure Monitoring**

1. **Health reporting**: `Enhanced`
2. **Health check grace period**: `300` seconds
3. **Health check URL**: `/health`
4. **Click "Next"**

---

### **Step 10: Review and Launch**

1. **Review all settings**:
   - Application name: `nowest-interior`
   - Environment name: `nowest-interior-prod`
   - Platform: `Node.js 18`
   - Instance type: `t3.micro` or `t3.small`
   - Environment variables: All 4 variables set

2. **Click "Create environment"**

3. **Wait for deployment** (5-10 minutes):
   - You'll see the deployment progress
   - Status will change from "Creating" to "Ok"

---

### **Step 11: Access Your Application**

1. **Once deployment is complete**:
   - You'll see a green "Ok" status
   - Click on your environment name

2. **Get your application URL**:
   - Look for the **URL** field at the top
   - It will be something like: `http://nowest-interior-prod.ap-south-1.elasticbeanstalk.com`

3. **Test your application**:
   - Click the URL to open your website
   - Test different pages and functionality

---

## 🔧 **Post-Deployment Configuration**

### **Configure Custom Domain (Optional)**

1. **Go to Configuration** → **Load balancer**
2. **Click "Edit"**
3. **Add listener**:
   - **Port**: `443`
   - **Protocol**: `HTTPS`
   - **SSL certificate**: Upload or select your SSL certificate
4. **Save changes**

### **Set Up Auto Scaling**

1. **Go to Configuration** → **Capacity**
2. **Click "Edit"**
3. **Configure scaling**:
   - **Min instances**: `1`
   - **Max instances**: `5`
   - **Scaling triggers**: Set CPU threshold (e.g., 70%)
4. **Save changes**

### **Configure Health Checks**

1. **Go to Configuration** → **Health**
2. **Click "Edit"**
3. **Set health check**:
   - **Health check path**: `/health`
   - **Health check grace period**: `300` seconds
4. **Save changes**

---

## 📊 **Monitoring Your Application**

### **View Logs**

1. **Go to your environment**
2. **Click "Logs"** in the left sidebar
3. **Request logs**:
   - Click "Request logs"
   - Select "Last 100 lines" or "Full logs"
   - Click "Download"

### **Monitor Health**

1. **Health dashboard** shows:
   - Application health status
   - Instance health
   - Load balancer health
   - Database connections

### **View Metrics**

1. **Go to "Monitoring"** tab
2. **View metrics**:
   - Request count
   - Response time
   - CPU utilization
   - Memory usage

---

## 🚨 **Troubleshooting Common Issues**

### **Issue 1: Application Won't Start**

**Symptoms**: Environment shows "Warning" or "Error" status

**Solutions**:
1. **Check logs**:
   - Go to "Logs" → "Request logs"
   - Look for error messages

2. **Common fixes**:
   - Verify `package.json` has correct start script
   - Check environment variables are set correctly
   - Ensure `dist` folder exists and has content

### **Issue 2: Database Connection Failed**

**Symptoms**: Application starts but can't connect to database

**Solutions**:
1. **Check security groups**:
   - Go to EC2 → Security Groups
   - Ensure EB security group can access RDS security group

2. **Verify database URL**:
   - Check environment variable is set correctly
   - Test connection from EC2 instance

### **Issue 3: Static Files Not Loading**

**Symptoms**: Images, CSS, or JS files return 404

**Solutions**:
1. **Check `.ebextensions/01-environment.config`**:
   - Verify static file mapping: `/public: dist/public`

2. **Verify build output**:
   - Ensure `dist/public` folder exists
   - Check files are in the correct location

### **Issue 4: Environment Variables Not Working**

**Symptoms**: Application uses default values instead of environment variables

**Solutions**:
1. **Re-set environment variables**:
   - Go to Configuration → Software
   - Edit environment properties
   - Save changes

2. **Restart environment**:
   - Go to Actions → Restart app server(s)

---

## 🔄 **Updating Your Application**

### **Deploy New Version**

1. **Prepare new version**:
   - Make your code changes
   - Run `npm run build`
   - Create new ZIP file

2. **Upload new version**:
   - Go to your environment
   - Click "Upload and deploy"
   - Select new ZIP file
   - Add version label (e.g., `v1.1`)
   - Click "Deploy"

3. **Monitor deployment**:
   - Watch deployment progress
   - Check health status
   - Test new functionality

---

## 💰 **Cost Management**

### **Estimated Monthly Costs**

| Instance Type | Monthly Cost | Use Case |
|---------------|--------------|----------|
| `t3.micro` | $8-12 | Development/Testing |
| `t3.small` | $15-20 | Small Production |
| `t3.medium` | $30-40 | Medium Production |

### **Cost Optimization Tips**

1. **Use t3.micro for development**
2. **Set up auto-scaling** to handle traffic spikes
3. **Monitor usage** with CloudWatch
4. **Set up billing alerts**

---

## 🎉 **Success Checklist**

After deployment, verify:

- ✅ Application loads without errors
- ✅ All pages are accessible
- ✅ Database connections work
- ✅ Admin panel is accessible
- ✅ Static files (images, CSS) load correctly
- ✅ Forms submit successfully
- ✅ Health check endpoint responds
- ✅ Environment shows "Ok" status

---

## 📞 **Getting Help**

If you encounter issues:

1. **Check AWS documentation**: https://docs.aws.amazon.com/elasticbeanstalk/
2. **View EB logs** for error messages
3. **Check CloudWatch logs** for detailed information
4. **Contact AWS support** if needed

**Your application should now be live on AWS Elastic Beanstalk!** 🎉
