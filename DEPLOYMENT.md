# Vercel Deployment Guide

## Prerequisites
1. Vercel account (sign up at vercel.com)
2. MongoDB Atlas account
3. Git repository with your code

## Deployment Steps

### 1. Prepare Environment Variables
Create a `.env` file in the `server` directory with:
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=production
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name: agent-list-distributor
# - Directory: ./
# - Override settings? No
```

#### Option B: Using Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Configure build settings:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `client/build`
   - Install Command: `npm run install-all`

### 3. Configure Environment Variables in Vercel
1. Go to your project dashboard
2. Click "Settings" → "Environment Variables"
3. Add the following variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your JWT secret key
   - `NODE_ENV`: production

### 4. Update MongoDB Atlas Whitelist
1. Go to MongoDB Atlas dashboard
2. Click "Network Access"
3. Add IP address: `0.0.0.0/0` (allow all IPs) or Vercel's IP ranges

### 5. Seed the Database
After deployment, run the seed script to create admin user:
```bash
# SSH into your Vercel deployment or use Vercel CLI
vercel env pull .env.local
cd server
node seed.js
```

## Vercel Configuration

The `vercel.json` file is already configured for:
- API routes (`/api/*`) → Server
- Static files → Client build
- Environment variables
- Node.js runtime

## Commands for Deployment

```bash
# Install dependencies
npm run install-all

# Build the application
npm run build

# Deploy to Vercel
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs
```

## Troubleshooting

### Common Issues:
1. **Build Failures**: Check Node.js version (requires 14+)
2. **Database Connection**: Verify MongoDB Atlas whitelist
3. **Environment Variables**: Ensure all required vars are set
4. **API Routes**: Check that server routes are properly configured

### Useful Commands:
```bash
# Check deployment
vercel inspect

# View function logs
vercel logs --follow

# Redeploy
vercel --prod --force
```

## Production URLs
After successful deployment, you'll get:
- Frontend: `https://your-project.vercel.app`
- API: `https://your-project.vercel.app/api/*`

## Admin Access
- Email: `admin@kavya.com`
- Password: `kavya@123`

## Support
For deployment issues, check:
1. Vercel documentation
2. MongoDB Atlas connection logs
3. Application logs in Vercel dashboard


