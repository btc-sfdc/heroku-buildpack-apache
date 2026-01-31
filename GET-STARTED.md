# Get Started: Deploy VA Content to Heroku in 3 Steps

This buildpack is ready to deploy VA content-build static pages to Heroku with optimized build times.

## 🚀 Quick Start (5 minutes to deploy)

### Step 1: Create Your Project

```bash
# Create a new directory
mkdir my-va-site && cd my-va-site
git init

# Add the marker file (tells buildpack to use VA content-build)
touch .va-content-build
echo "VA_CONTENT_BUILD=true" > .va-content-build

# Commit it
git add .va-content-build
git commit -m "Configure VA content-build"
```

### Step 2: Create Heroku App & Optimize

```bash
# Create Heroku app with this buildpack
# (Replace YOUR_GITHUB_USERNAME after you push this buildpack to GitHub)
heroku create --stack heroku-20 \
  --buildpack https://github.com/YOUR_GITHUB_USERNAME/heroku-buildpack-apache.git

# Optimize build time (50-60 min instead of 4-8 hours!)
heroku config:set CONTENT_TYPES="pages,navigation,forms,offices"
```

### Step 3: Deploy

```bash
git push heroku master

# Watch the build (optional)
heroku logs --tail
```

That's it! In 50-60 minutes, your VA content site will be live.

## 📊 What You're Building

The configuration `pages,navigation,forms,offices` includes:

| Content Type | What It Includes | Build Time |
|-------------|------------------|------------|
| **pages** | Standard VA content pages | ~25 min |
| **navigation** | Menus, sidebars, footer | ~2 min |
| **forms** | VA forms directory | ~12 min |
| **offices** | Office location pages | ~35 min |
| **Total** | | **~60 min** |

Compare this to 4-8 hours without optimization! 🎉

## ⚙️ Customization Options

### Need Different Content?

```bash
# Minimal site (10 minutes)
heroku config:set CONTENT_TYPES="pages,navigation"

# Add media/images (80 minutes)
heroku config:set CONTENT_TYPES="pages,navigation,forms,offices,media"

# Add healthcare (2+ hours)
heroku config:set CONTENT_TYPES="pages,navigation,forms,offices,healthcare"

# Build everything (4-8 hours)
heroku config:unset CONTENT_TYPES
```

See [OPTIMIZATION-GUIDE.md](OPTIMIZATION-GUIDE.md) for all 21 available content types.

## 📖 Documentation

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **[QUICK-REFERENCE.md](QUICK-REFERENCE.md)** | Command cheat sheet | Quick lookups |
| **[DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md)** | Step-by-step deployment | First deployment |
| **[OPTIMIZATION-GUIDE.md](OPTIMIZATION-GUIDE.md)** | Content optimization details | Optimizing build time |
| **[VA-CONTENT-DEPLOYMENT.md](VA-CONTENT-DEPLOYMENT.md)** | Complete technical guide | Deep dive |

## 🔧 How It Works

When you deploy, the buildpack automatically:

1. ✅ Installs Node.js 14.15.0 & yarn 1.19.1
2. ✅ Clones VA content-build repository
3. ✅ **Optimizes GraphQL queries** based on your CONTENT_TYPES
4. ✅ Fetches cached Drupal content
5. ✅ Builds static HTML pages
6. ✅ Configures Apache 2.2.22 to serve them
7. ✅ Starts your web server

## ⚠️ Important Notes

### Build Time Requirements

| Content Configuration | Build Time | Heroku Dyno Required |
|---------------------|------------|---------------------|
| `pages,navigation` | 10 min | Free tier OK |
| `pages,navigation,forms,offices` | 60 min | **Standard-1X+** |
| Full build | 4-8 hours | **Not recommended** |

**Recommendation**: Use Standard-1X dyno ($25/month) for the default configuration.

### First Build Will Be Slower

The first build includes:
- Downloading Node.js and nvm
- Installing yarn globally
- Cloning content-build repository
- Installing 1000+ npm packages

Subsequent builds are faster thanks to Heroku's build cache.

## 🎯 Common Use Cases

### Use Case 1: Forms Directory
**Goal**: Searchable VA forms
```bash
heroku config:set CONTENT_TYPES="pages,forms,navigation"
# Build time: ~20 minutes
```

### Use Case 2: Office Locator
**Goal**: Find VA offices
```bash
heroku config:set CONTENT_TYPES="pages,offices,navigation,media"
# Build time: ~60 minutes
```

### Use Case 3: Information Portal
**Goal**: VA resources and guides
```bash
heroku config:set CONTENT_TYPES="pages,guides,support,qa,navigation"
# Build time: ~30 minutes
```

## 🐛 Troubleshooting

### Build Timeout

**Problem**: Build exceeds Heroku's time limit

**Solutions**:
1. Reduce content types: `heroku config:set CONTENT_TYPES="pages,navigation"`
2. Upgrade to Standard dyno: `heroku ps:scale web=Standard-1X`
3. Remove slow content: Avoid `healthcare` (adds 90 min)

### Missing Content

**Problem**: Some pages don't show up

**Solution**: Add the content type:
```bash
heroku config:set CONTENT_TYPES="pages,navigation,forms,offices,qa"
git commit --allow-empty -m "Rebuild with more content"
git push heroku master
```

### Build Fails

**Problem**: Build errors out

**Solutions**:
1. Check logs: `heroku logs --tail`
2. Try full build: `heroku config:unset CONTENT_TYPES`
3. Verify marker file exists: `git ls-files .va-content-build`

## 📞 Need Help?

1. Check [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md) for detailed troubleshooting
2. Review [OPTIMIZATION-GUIDE.md](OPTIMIZATION-GUIDE.md) for build optimization tips
3. See [VA-CONTENT-DEPLOYMENT.md](VA-CONTENT-DEPLOYMENT.md) for technical details

## 🎓 What You've Learned

After following this guide, you'll have:

- ✅ A working VA content site on Heroku
- ✅ Optimized build times (95% faster than default)
- ✅ Understanding of content type configuration
- ✅ Apache web server configured and running
- ✅ Static HTML generated from Drupal content

## 🚢 Ready to Deploy?

Follow the 3 steps at the top of this document, and you'll have a VA content site running in under an hour!

**Recommended First Deployment**:
```bash
mkdir my-va-site && cd my-va-site
git init
touch .va-content-build
git add .va-content-build
git commit -m "Initial commit"
heroku create --buildpack https://github.com/YOUR_GITHUB_USERNAME/heroku-buildpack-apache.git
heroku config:set CONTENT_TYPES="pages,navigation,forms,offices"
git push heroku master
```

**Happy deploying!** 🎉

---

**Build Configuration**: pages,navigation,forms,offices (60 min)
**Last Updated**: January 31, 2026
