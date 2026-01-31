# VA Content-Build Deployment Checklist

Follow these steps to deploy the VA content-build to Heroku with optimized build times.

## Prerequisites

- [ ] Heroku CLI installed (`heroku --version`)
- [ ] Git repository initialized
- [ ] Heroku account created

## Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
# Create a new directory for your deployment
mkdir va-content-deployment
cd va-content-deployment
git init
```

### 2. Add the Buildpack Marker File

```bash
# Copy the marker file from this buildpack
cp /path/to/heroku-buildpack-apache/.va-content-build .

# OR create it manually
touch .va-content-build
echo "VA_CONTENT_BUILD=true" > .va-content-build
```

### 3. Commit the Marker File

```bash
git add .va-content-build
git commit -m "Add VA content-build marker file"
```

### 4. Create Heroku App

Choose the appropriate stack (heroku-20 or heroku-22):

```bash
# Create app with this buildpack
heroku create your-app-name \
  --stack heroku-20 \
  --buildpack https://github.com/[your-github-username]/heroku-buildpack-apache.git

# OR for an existing app
heroku buildpacks:set https://github.com/[your-github-username]/heroku-buildpack-apache.git -a your-app-name
```

**Important**: Replace `[your-github-username]` with your GitHub username after you push this buildpack to your GitHub.

### 5. Configure Content Optimization

Based on QUICK-REFERENCE.md, set the content types to build:

```bash
# Recommended configuration: pages, navigation, forms, and offices
# Expected build time: ~50-60 minutes
heroku config:set CONTENT_TYPES="pages,navigation,forms,offices" -a your-app-name
```

**What this includes:**
- ✅ Standard content pages (~20-30 min)
- ✅ Site navigation - menus, sidebars, footer (~2 min)
- ✅ VA forms (~10-15 min)
- ✅ Office location pages (~30-40 min)

**Total estimated build time**: ~50-60 minutes

**Alternative configurations:**

```bash
# Minimal (10 min) - just pages and navigation
heroku config:set CONTENT_TYPES="pages,navigation" -a your-app-name

# Add media (70 min) - includes images/videos
heroku config:set CONTENT_TYPES="pages,navigation,forms,offices,media" -a your-app-name

# Full build (4-8 hours) - everything
heroku config:unset CONTENT_TYPES -a your-app-name
```

### 6. Optional: Configure Build Settings

```bash
# Increase build timeout if needed (requires paid dyno)
heroku config:set HEROKU_BUILD_TIMEOUT=3600 -a your-app-name

# Set Node.js version (default is 14.15.0)
heroku config:set NODE_VERSION=14.15.0 -a your-app-name

# Set Yarn version (default is 1.19.1)
heroku config:set YARN_VERSION=1.19.1 -a your-app-name
```

### 7. Deploy to Heroku

```bash
# Connect your local repo to Heroku
heroku git:remote -a your-app-name

# Deploy
git push heroku master

# OR if you're on a different branch
git push heroku your-branch:master
```

### 8. Monitor the Build

Watch the build process in real-time:

```bash
heroku logs --tail -a your-app-name
```

Look for these key messages:
- ✅ `Installing nvm and Node.js 14.15.0`
- ✅ `Installing yarn 1.19.1`
- ✅ `Cloning content-build repository`
- ✅ `Optimizing content queries` (if CONTENT_TYPES is set)
- ✅ `Enabled types: pages,navigation,forms,offices`
- ✅ `Content queries optimized`
- ✅ `Building static content`
- ✅ `Bundling Apache`

### 9. Verify Deployment

```bash
# Open your app in browser
heroku open -a your-app-name

# Check dyno status
heroku ps -a your-app-name

# View recent logs
heroku logs --tail -a your-app-name
```

### 10. Post-Deployment

```bash
# Scale web dyno if needed
heroku ps:scale web=1 -a your-app-name

# Check disk usage
heroku run bash -a your-app-name
# Then run: df -h
# And: du -sh /app/content-build
```

## Troubleshooting Checklist

### Build Takes Too Long

- [ ] Verify CONTENT_TYPES is set: `heroku config:get CONTENT_TYPES -a your-app-name`
- [ ] Check build logs for "Optimizing content queries" message
- [ ] Consider reducing content types
- [ ] Upgrade to paid dyno for longer build timeout

### Build Fails

- [ ] Check logs: `heroku logs -a your-app-name`
- [ ] Verify buildpack URL is correct: `heroku buildpacks -a your-app-name`
- [ ] Ensure .va-content-build file exists: `git ls-files .va-content-build`
- [ ] Try building without optimization: `heroku config:unset CONTENT_TYPES`

### App Doesn't Start

- [ ] Check web dyno is running: `heroku ps -a your-app-name`
- [ ] View error logs: `heroku logs --tail -a your-app-name`
- [ ] Verify PORT environment variable: `heroku config:get PORT -a your-app-name`
- [ ] Restart the app: `heroku restart -a your-app-name`

### Content Not Displaying

- [ ] SSH into dyno: `heroku run bash -a your-app-name`
- [ ] Check build directory: `ls -la /app/content-build/build/`
- [ ] Verify Apache config: `cat /app/apache/conf/httpd.conf | grep DocumentRoot`
- [ ] Check Apache logs: `heroku logs --tail -a your-app-name | grep apache`

### Pages Missing or Incomplete

- [ ] Add the missing content type to CONTENT_TYPES
- [ ] Redeploy: `git commit --allow-empty -m "Rebuild with more content" && git push heroku master`

## Quick Commands Reference

```bash
# View current configuration
heroku config -a your-app-name

# Change content types
heroku config:set CONTENT_TYPES="pages,navigation,forms,offices,NEW_TYPE" -a your-app-name

# Rebuild (trigger new build without code changes)
git commit --allow-empty -m "Trigger rebuild"
git push heroku master

# View build logs
heroku logs --tail -a your-app-name

# Restart app
heroku restart -a your-app-name

# Scale dynos
heroku ps:scale web=1 -a your-app-name

# Open app in browser
heroku open -a your-app-name

# SSH into running dyno
heroku run bash -a your-app-name
```

## Estimated Costs (Heroku)

| Dyno Type | Build Timeout | Cost | Recommended For |
|-----------|---------------|------|-----------------|
| Free | 15 min | $0 | Minimal content only |
| Hobby | 30 min | $7/month | Pages + navigation |
| Standard-1X | 60 min | $25/month | Full deployment recommended |
| Standard-2X | 60 min | $50/month | Faster builds |

**Note**: The 50-60 minute build time with `pages,navigation,forms,offices` requires at least Standard-1X dyno.

## Success Criteria

Your deployment is successful when:
- [ ] Build completes without errors
- [ ] App URL opens in browser
- [ ] Homepage loads with content
- [ ] Navigation menus work
- [ ] Static assets (CSS, JS, images) load correctly
- [ ] No 404 errors in browser console

## Next Steps After Successful Deployment

1. **Set up custom domain**: `heroku domains:add www.example.com -a your-app-name`
2. **Enable HTTPS**: Heroku provides free SSL
3. **Configure monitoring**: Use Heroku metrics or external monitoring
4. **Set up continuous deployment**: Connect GitHub for automatic deploys
5. **Optimize content**: Adjust CONTENT_TYPES based on actual needs

## Support Resources

- [QUICK-REFERENCE.md](QUICK-REFERENCE.md) - Quick command reference
- [OPTIMIZATION-GUIDE.md](OPTIMIZATION-GUIDE.md) - Detailed optimization strategies
- [VA-CONTENT-DEPLOYMENT.md](VA-CONTENT-DEPLOYMENT.md) - Complete deployment documentation
- [Heroku Buildpack Docs](https://devcenter.heroku.com/articles/buildpacks)
- [VA Content-Build Repo](https://github.com/department-of-veterans-affairs/content-build)

---

**Last Updated**: January 31, 2026
**Configuration**: pages,navigation,forms,offices (~50-60 min build)
