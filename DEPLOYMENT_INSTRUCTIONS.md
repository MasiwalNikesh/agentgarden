# Complete Deployment Instructions

This guide provides step-by-step instructions for deploying the AgentGarden platform.

## 🚀 Quick Deployment Options

### Option 1: Frontend to Vercel (Recommended - Fast & Free)

Perfect for getting your frontend live quickly.

#### Prerequisites

- Git repository (GitHub/GitLab/Bitbucket)
- Vercel account (free at [vercel.com](https://vercel.com))

#### Step 1: Commit Your Changes

```bash
cd /Users/nikesh/Projects/Projects/SWEMT_02

# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "Prepare for deployment: Production-ready build"

# Push to your repository
git push origin main
```

#### Step 2: Deploy via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your Git repository
4. Configure the project:

   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

5. Click **"Deploy"**

Your frontend will be live in ~2 minutes! 🎉

#### Step 3 (Alternative): Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
cd /Users/nikesh/Projects/Projects/SWEMT_02
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: agentgarden
# - Directory: frontend
# - Override settings? N

# Once deployed, you'll get a URL like:
# https://agentgarden-abc123.vercel.app
```

#### Environment Variables for Frontend

If your frontend needs to connect to backend APIs, add these in Vercel Dashboard → Settings → Environment Variables:

```bash
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_USER_SERVICE_URL=https://your-backend-url.com:8001
REACT_APP_WORKFLOW_SERVICE_URL=https://your-backend-url.com:8002
REACT_APP_ORCHESTRATION_SERVICE_URL=https://your-backend-url.com:8003
```

---

### Option 2: Backend Deployment

The backend requires more setup due to microservices architecture. Here are your options:

#### Option 2A: Railway.app (Easiest)

Railway is perfect for microservices and includes PostgreSQL/Redis.

1. **Sign up at [railway.app](https://railway.app)**

2. **Create a new project**

3. **Add PostgreSQL:**

   - Click "New" → "Database" → "PostgreSQL"
   - Copy the `DATABASE_URL` connection string

4. **Add Redis:**

   - Click "New" → "Database" → "Redis"
   - Copy the `REDIS_URL` connection string

5. **Deploy User Service:**

   ```bash
   # In your project root
   cd backend/user-service

   # Create railway.json
   cat > railway.json << EOF
   {
     "$schema": "https://railway.app/railway.schema.json",
     "build": {
       "builder": "DOCKERFILE",
       "dockerfilePath": "Dockerfile"
     },
     "deploy": {
       "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port 8001",
       "restartPolicyType": "ON_FAILURE"
     }
   }
   EOF

   # Deploy
   railway up
   ```

6. **Repeat for other services:**

   - Workflow Service (port 8002)
   - Orchestration Service (port 8003)
   - Worker Service

7. **Set Environment Variables:**
   - In Railway dashboard, add all env vars from `.env.example`

#### Option 2B: Render.com

1. **Sign up at [render.com](https://render.com)**

2. **Create PostgreSQL Database:**

   - Dashboard → New → PostgreSQL
   - Copy the internal/external database URLs

3. **Create Redis Instance:**

   - Dashboard → New → Redis
   - Copy the Redis URL

4. **Deploy each service as a Web Service:**

   - Dashboard → New → Web Service
   - Connect your Git repository
   - Set:
     - **Name**: user-service
     - **Environment**: Docker
     - **Dockerfile Path**: backend/user-service/Dockerfile
     - **Port**: 8001

5. **Add Environment Variables** in each service settings

#### Option 2C: AWS ECS/Fargate (Production-grade)

1. **Build and push Docker images:**

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_AWS_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com

# Build and push each service
cd backend/user-service
docker build -t user-service .
docker tag user-service:latest YOUR_AWS_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/user-service:latest
docker push YOUR_AWS_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/user-service:latest
```

2. **Set up RDS PostgreSQL and ElastiCache Redis**

3. **Create ECS Task Definitions** for each service

4. **Deploy via ECS Service** with Application Load Balancer

#### Option 2D: DigitalOcean App Platform

1. **Sign up at [digitalocean.com](https://www.digitalocean.com/products/app-platform)**

2. **Create App from GitHub:**

   - Apps → Create App
   - Choose your repository
   - Detect services automatically

3. **Add Managed Databases:**

   - PostgreSQL Database
   - Redis Database

4. **Configure each service:**
   - Set environment variables
   - Set build commands
   - Set run commands

---

### Option 3: Full Stack on Single VM (For Testing/Staging)

Perfect for staging environments or self-hosting.

#### Prerequisites

- VPS with Ubuntu 22.04+ (AWS EC2, DigitalOcean Droplet, etc.)
- At least 2GB RAM, 2 vCPUs

#### Step 1: Set up the server

```bash
# SSH into your server
ssh your-user@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose -y

# Clone your repository
git clone https://github.com/yourusername/SWEMT_02.git
cd SWEMT_02
```

#### Step 2: Configure environment

```bash
# Create .env file
cp .env.example .env

# Edit .env with your production values
nano .env
```

#### Step 3: Deploy with Docker Compose

```bash
# Build and start all services
docker-compose up -d --build

# Initialize database
docker-compose exec user-service python /app/backend/shared/init_db.py
docker-compose exec user-service python /app/backend/shared/seed_data.py

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

#### Step 4: Set up Nginx reverse proxy

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx config
sudo nano /etc/nginx/sites-available/agentgarden

# Add this configuration:
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # User Service API
    location /api/users {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Workflow Service API
    location /api/workflows {
        proxy_pass http://localhost:8002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Orchestration Service API
    location /api/orchestration {
        proxy_pass http://localhost:8003;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/agentgarden /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Set up SSL with Let's Encrypt (optional but recommended)
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

---

## 📊 Post-Deployment Checklist

### Frontend Verification

- [ ] Visit your Vercel URL
- [ ] Test navigation between pages
- [ ] Check browser console for errors
- [ ] Verify all images load correctly
- [ ] Test responsive design on mobile

### Backend Verification

- [ ] Test API endpoints: `curl https://your-backend/health`
- [ ] Check database connections
- [ ] Verify Redis connectivity
- [ ] Test user authentication
- [ ] Check Celery worker is running
- [ ] Monitor logs for errors

### Security Checklist

- [ ] All API keys stored securely (not in code)
- [ ] HTTPS enabled (SSL certificates)
- [ ] CORS configured correctly
- [ ] Database credentials rotated
- [ ] JWT secret key is strong and unique
- [ ] Rate limiting enabled
- [ ] Firewall configured (if using VM)

---

## 🔧 Troubleshooting

### Common Issues

#### Build Fails on Vercel

```bash
# Common fix: Specify Node version in package.json
"engines": {
  "node": "18.x"
}
```

#### Database Connection Errors

```bash
# Check DATABASE_URL format
postgresql://username:password@host:5432/database_name

# Ensure database accepts connections from your service IP
```

#### Redis Connection Errors

```bash
# Check REDIS_URL format
redis://hostname:6379/0

# Ensure Redis is running and accessible
```

#### CORS Errors

Add this to your FastAPI backend services:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-vercel-domain.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🚦 Monitoring & Maintenance

### Health Checks

Set up monitoring endpoints:

```bash
# Check all services
curl https://your-domain.com/api/users/health
curl https://your-domain.com/api/workflows/health
curl https://your-domain.com/api/orchestration/health
```

### Log Monitoring

```bash
# Docker Compose logs
docker-compose logs -f --tail=100

# Specific service
docker-compose logs -f user-service
```

### Database Backups

```bash
# PostgreSQL backup
docker-compose exec postgres pg_dump -U postgres agentic_workflows > backup.sql

# Restore
docker-compose exec -T postgres psql -U postgres agentic_workflows < backup.sql
```

---

## 📈 Scaling Considerations

### Horizontal Scaling

1. **Use managed services:**

   - AWS RDS for PostgreSQL
   - AWS ElastiCache for Redis
   - AWS ECS/Fargate for containers

2. **Load balancing:**

   - AWS ALB or Nginx for backend services
   - Vercel handles frontend automatically

3. **Worker scaling:**
   - Deploy multiple Celery workers
   - Use Kubernetes for auto-scaling

### Performance Optimization

- Enable Redis caching for frequently accessed data
- Use CDN for static assets (Vercel provides this)
- Optimize database queries with indexes
- Implement connection pooling
- Use async/await in Python code

---

## 🎯 Quick Reference

### Vercel Commands

```bash
vercel                  # Deploy
vercel --prod          # Deploy to production
vercel ls              # List deployments
vercel logs            # View logs
vercel env add         # Add environment variable
```

### Docker Compose Commands

```bash
docker-compose up -d           # Start services in background
docker-compose down            # Stop services
docker-compose restart         # Restart all services
docker-compose logs -f         # View logs
docker-compose ps              # Check status
docker-compose exec SERVICE sh # Access service shell
```

### Service URLs (After Deployment)

- **Frontend**: `https://your-project.vercel.app`
- **User Service**: `https://your-backend:8001/docs`
- **Workflow Service**: `https://your-backend:8002/docs`
- **Orchestration Service**: `https://your-backend:8003/docs`

---

## 🆘 Support

If you encounter issues:

1. Check the logs first
2. Verify environment variables
3. Test database/Redis connections
4. Review CORS configuration
5. Check firewall rules

For additional help, refer to:

- `README.md` - Project overview
- `DEPLOYMENT_GUIDE.md` - Vercel-specific guide
- `QUICK_START.md` - Local development setup
- Service documentation at `/docs` endpoints

---

**🎉 Congratulations! Your AgentGarden platform is now deployed!**
