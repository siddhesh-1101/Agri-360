# Troubleshooting Guide

## Common Issues and Solutions

### 1. Port Already in Use (EADDRINUSE)

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions:**

**Option A: Find and kill the process using port 5000**
```bash
# Windows PowerShell
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Or use a different port
# Edit .env file and change PORT=5000 to PORT=5001
```

**Option B: Use a different port**
1. Edit `.env` file
2. Change `PORT=5000` to `PORT=5001` (or any available port)
3. Restart the server

### 2. MongoDB Connection Failed

**Error:** `MongoServerSelectionError` or `MongooseServerSelectionError`

**Solutions:**

**Check if MongoDB is installed:**
```bash
mongod --version
mongosh --version
```

**Start MongoDB Service:**

**Windows:**
```bash
# Check if MongoDB service is running
sc query MongoDB

# Start MongoDB service
net start MongoDB

# Or start manually
mongod --dbpath "C:\data\db"
```

**Mac/Linux:**
```bash
# Start MongoDB service
sudo systemctl start mongod

# Or check status
sudo systemctl status mongod
```

**Test MongoDB Connection:**
```bash
# Test connection manually
mongosh mongodb://localhost:27017/agri360

# Or use the check script
npm run check-db
```

**If MongoDB is not installed:**

1. **Download MongoDB Community Server:**
   - Windows: https://www.mongodb.com/try/download/community
   - Mac: `brew install mongodb-community`
   - Linux: Follow MongoDB installation guide

2. **Or use MongoDB Atlas (Cloud):**
   - Sign up at https://www.mongodb.com/cloud/atlas
   - Create a free cluster
   - Get connection string
   - Update `.env` file with Atlas connection string:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agri360
     ```

### 3. Database Connection Check

**Check database connection status:**
```bash
# Run the check script
npm run check-db
```

**Check via API:**
```bash
curl http://localhost:5000/health
```

The health endpoint will show:
- Server status
- Database connection status

### 4. Environment Variables Not Loading

**Issue:** `.env` file not found or not loading

**Solution:**
1. Make sure `.env` file exists in `backend/` directory
2. Check file name is exactly `.env` (not `.env.txt`)
3. Verify file contents:
   ```
   MONGODB_URI=mongodb://localhost:27017/agri360
   JWT_SECRET=your_secret_key
   PORT=5000
   ```

### 5. Module Not Found Errors

**Error:** `Cannot find module 'xyz'`

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### 6. Authentication Errors

**Error:** `JWT_SECRET not set`

**Solution:**
1. Make sure `.env` file has `JWT_SECRET` set
2. Use a strong random string for production
3. Restart the server after changing `.env`

## Quick Diagnostic Commands

```bash
# Check MongoDB connection
npm run check-db

# Check server health
curl http://localhost:5000/health

# Check if port is in use (Windows)
netstat -ano | findstr :5000

# Check if MongoDB is running (Windows)
sc query MongoDB

# Test MongoDB directly
mongosh mongodb://localhost:27017/agri360
```

## Getting Help

If issues persist:

1. Check the console logs for detailed error messages
2. Verify MongoDB is running: `mongosh mongodb://localhost:27017`
3. Check `.env` file configuration
4. Ensure all dependencies are installed: `npm install`
5. Try restarting MongoDB service
6. Check firewall settings (MongoDB uses port 27017)
