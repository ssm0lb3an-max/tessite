# cPanel Deployment Guide

This guide explains how to deploy your T.E.S Access System application on cPanel shared hosting.

## Database Setup (SQLite)

Your application has been converted to use **SQLite** - a file-based database that works perfectly on cPanel without needing a separate database server.

### Key Points:
- **No DATABASE_URL needed**: Simply don't set the DATABASE_URL environment variable on cPanel
- **Automatic database creation**: The app automatically creates `data/app.db` on first run
- **File-based storage**: Your database is stored as a file in the `data/` directory
- **No configuration needed**: SQLite works out of the box

## Deployment Steps

### 1. Upload Files to cPanel

1. Log into cPanel
2. Use File Manager or FTP to upload your project files to the public_html directory (or a subdirectory)
3. Ensure the following structure exists:
   ```
   your-domain.com/
   ├── data/              (Create this directory, give it 755 permissions)
   ├── dist/              (Will be created after build)
   ├── node_modules/      (Create after npm install)
   ├── package.json
   ├── package-lock.json
   ├── server/
   ├── client/
   └── ... (other files)
   ```

### 2. Install Dependencies

SSH into your cPanel account or use cPanel's Terminal:

```bash
cd /home/youruser/public_html/your-project
npm install
```

### 3. Build the Application

```bash
npm run build
```

This creates the optimized `dist/` folder ready for production.

### 4. Set Permissions

Make the `data/` directory writable:

```bash
chmod 755 data
```

### 5. Start the Application

#### Option A: Using Node.js in cPanel

If your cPanel has Node.js support:

```bash
npm start
```

#### Option B: Using a Process Manager

For production reliability, use PM2 or Forever:

```bash
npm install -g pm2
pm2 start dist/index.cjs --name "tes-app"
pm2 startup
pm2 save
```

#### Option C: Using cPanel's App Manager (If Available)

Some cPanel installations have App Manager for Node.js apps. Check your cPanel's advanced features.

### 6. Point Domain to Application

Configure your cPanel routing to direct HTTP/HTTPS requests to your Node.js application (usually port 3000 or configured port).

## Environment Variables

Unlike PostgreSQL, SQLite doesn't need DATABASE_URL. However, you can still configure:

```bash
# Discord webhook for notifications (optional)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# Node environment
NODE_ENV=production
```

Set these in your cPanel environment variables or in a `.env` file.

## Database File Location

The SQLite database is automatically created at:
```
/home/youruser/public_html/your-project/data/app.db
```

**Important**: Make sure the `data/` directory is writable by the application.

## Backup Your Database

The SQLite database is a single file, making backups simple:

1. Download `data/app.db` regularly via FTP
2. Or use a cron job to backup automatically:
   ```bash
   0 2 * * * cp /home/youruser/public_html/your-project/data/app.db /home/youruser/backups/app.db.backup
   ```

## Troubleshooting

### Application won't start
- Check file permissions on `data/` directory (should be 755)
- Verify Node.js is installed: `node --version`
- Check error logs in cPanel

### Database locked error
- SQLite uses file locking. Make sure only one process accesses the database
- Restart the application: `pm2 restart tes-app`

### Slow performance
- SQLite is suitable for small to medium traffic
- For high traffic, upgrade to the PostgreSQL deployment method

## Converting Back to PostgreSQL

If you need PostgreSQL later:

1. Set `DATABASE_URL` environment variable to your PostgreSQL connection string
2. Run: `npm run db:push`
3. The app will automatically use PostgreSQL instead of SQLite

## Initial Admin Key

Your application includes a default admin key for the Directors Office role:

```
Key: TES-CF8X-DROT
Role: Directors Office
Username: Director
```

Use this to log in and create additional keys for your team.

## Production Recommendations

1. **Use HTTPS**: Enable SSL/TLS via cPanel
2. **Monitor Performance**: Use cPanel's monitoring tools
3. **Regular Backups**: Backup `data/app.db` regularly
4. **Update Dependencies**: Periodically run `npm update`
5. **Secure the data directory**: Ensure proper file permissions

## Support

For issues with:
- cPanel/hosting: Contact your hosting provider
- Node.js deployment: Check Node.js documentation
- This application: Review the application logs
