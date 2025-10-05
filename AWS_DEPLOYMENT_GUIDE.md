# AWS Deployment Guide for Nowest Interior Ltd

## 🚀 Deployment Options

### Option 1: AWS Elastic Beanstalk (Recommended for Beginners)

#### Prerequisites
- AWS Account
- AWS CLI installed
- Node.js 18+ on your local machine

#### Step 1: Prepare for Production

1. **Build the Application**
```bash
npm run build
```

2. **Create Production Environment File**
Create `.env.production`:
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=mysql+pymysql://admin:AKumawat8437@menteetracker.cfiuwyek2vbk.ap-south-1.rds.amazonaws.com:3306/nowest_interior
SESSION_SECRET=your-super-secure-session-secret-here
```

#### Step 2: Create Elastic Beanstalk Application

1. **Install EB CLI**
```bash
pip install awsebcli
```

2. **Initialize EB Application**
```bash
eb init
# Select your region (e.g., ap-south-1)
# Select Node.js platform
# Choose "Create new application"
```

3. **Create Environment**
```bash
eb create production
```

4. **Deploy**
```bash
eb deploy
```

#### Step 3: Configure Environment Variables
```bash
eb setenv NODE_ENV=production
eb setenv DATABASE_URL=mysql+pymysql://admin:AKumawat8437@menteetracker.cfiuwyek2vbk.ap-south-1.rds.amazonaws.com:3306/nowest_interior
eb setenv SESSION_SECRET=your-super-secure-session-secret-here
```

---

### Option 2: AWS EC2 with PM2 (More Control)

#### Step 1: Launch EC2 Instance
- Instance Type: t3.medium or larger
- OS: Ubuntu 22.04 LTS
- Security Group: Allow HTTP (80), HTTPS (443), SSH (22)

#### Step 2: Connect and Setup
```bash
# Connect to EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

#### Step 3: Deploy Application
```bash
# Clone your repository
git clone https://github.com/Mohji12/curtains.git
cd curtains

# Install dependencies
npm install

# Build the application
npm run build

# Create production environment file
echo "NODE_ENV=production
PORT=5000
DATABASE_URL=mysql+pymysql://admin:AKumawat8437@menteetracker.cfiuwyek2vbk.ap-south-1.rds.amazonaws.com:3306/nowest_interior
SESSION_SECRET=your-super-secure-session-secret-here" > .env

# Start with PM2
pm2 start npm --name "nowest-interior" -- start
pm2 save
pm2 startup
```

#### Step 4: Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/nowest-interior
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/nowest-interior /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### Option 3: AWS App Runner (Serverless)

#### Step 1: Create App Runner Service
1. Go to AWS App Runner console
2. Create service
3. Source: GitHub repository
4. Connect your GitHub account
5. Select repository: `Mohji12/curtains`

#### Step 2: Configure Build Settings
```yaml
version: 1.0
runtime: nodejs18
build:
  commands:
    build:
      - npm install
      - npm run build
run:
  runtime-version: 18
  command: npm start
  network:
    port: 5000
  env:
    - name: NODE_ENV
      value: production
    - name: DATABASE_URL
      value: mysql+pymysql://admin:AKumawat8437@menteetracker.cfiuwyek2vbk.ap-south-1.rds.amazonaws.com:3306/nowest_interior
    - name: SESSION_SECRET
      value: your-super-secure-session-secret-here
```

---

## 🔧 Production Optimizations

### 1. Update package.json for Production
```json
{
  "scripts": {
    "start": "cross-env NODE_ENV=production node dist/index.js",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "dev": "cross-env NODE_ENV=development tsx server/index.ts"
  }
}
```

### 2. Add Health Check Endpoint
Add to `server/routes.ts`:
```javascript
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});
```

### 3. Enable Compression
```bash
npm install compression
```

Add to `server/index.ts`:
```javascript
import compression from 'compression';
app.use(compression());
```

### 4. Set Up SSL Certificate
- Use AWS Certificate Manager
- Configure CloudFront for CDN
- Set up Route 53 for domain management

---

## 📊 Monitoring & Logging

### CloudWatch Integration
```bash
# Install AWS CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb
```

### PM2 Monitoring
```bash
pm2 install pm2-logrotate
pm2 monit
```

---

## 🔐 Security Checklist

- [ ] Use environment variables for secrets
- [ ] Enable HTTPS with SSL certificate
- [ ] Configure proper CORS settings
- [ ] Set up rate limiting
- [ ] Regular security updates
- [ ] Database connection encryption
- [ ] Session security configuration

---

## 📈 Scaling Considerations

- **Auto Scaling**: Configure based on CPU/Memory usage
- **Load Balancer**: Use Application Load Balancer for multiple instances
- **Database**: Consider RDS read replicas for high traffic
- **CDN**: Use CloudFront for static assets
- **Caching**: Implement Redis for session storage

---

## 🚨 Troubleshooting

### Common Issues:
1. **Port binding errors**: Ensure PORT environment variable is set
2. **Database connection**: Check security groups and VPC configuration
3. **Memory issues**: Increase instance size or optimize code
4. **SSL errors**: Verify certificate configuration

### Logs Location:
- **Elastic Beanstalk**: AWS Console → Elastic Beanstalk → Logs
- **EC2**: `/var/log/nginx/` and PM2 logs
- **App Runner**: CloudWatch Logs

---

## 💰 Cost Optimization

- **Start small**: Use t3.micro for testing
- **Reserved Instances**: For production workloads
- **Spot Instances**: For non-critical environments
- **Auto Scaling**: Scale down during low traffic
- **CloudFront**: Reduce bandwidth costs

---

## 📞 Support

For deployment issues:
1. Check AWS CloudWatch logs
2. Verify security group settings
3. Test database connectivity
4. Review application logs

Your application is ready for production deployment! 🎉
