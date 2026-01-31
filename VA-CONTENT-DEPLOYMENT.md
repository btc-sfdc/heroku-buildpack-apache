# Deploying VA Content-Build Static Pages to Heroku

This buildpack has been enhanced to support building and serving the Department of Veterans Affairs static content from the [content-build repository](https://github.com/department-of-veterans-affairs/content-build).

## Overview

This buildpack now implements Steps 1 and 2 from the [VA Platform frontend environment setup](https://depo-platform-documentation.scrollhelp.site/developer-docs/setting-up-your-local-frontend-environment):

1. **Set up Node** - Installs nvm, Node.js 14.15.0, and yarn 1.19.1
2. **Get the source code** - Clones the content-build repository and builds the static content

## Setup Instructions

### For a New Heroku App

```bash
heroku create --stack heroku-20 --buildpack https://github.com/[your-username]/heroku-buildpack-apache.git
```

### For an Existing Heroku App

```bash
heroku buildpacks:set https://github.com/[your-username]/heroku-buildpack-apache.git
```

### Create the Marker File

To trigger the VA content-build detection, create a `.va-content-build` marker file in your repository root:

```bash
touch .va-content-build
```

Optionally, add configuration to this file:

```bash
echo "VA_CONTENT_BUILD=true" > .va-content-build
```

### Deploy

```bash
git add .
git commit -m "Configure for VA content-build deployment"
git push heroku master
```

## What Happens During Build

1. **Node.js Setup** - The buildpack installs nvm and Node.js 14.15.0
2. **Yarn Installation** - Installs yarn 1.19.1 globally
3. **Content Clone** - Clones the content-build repository from GitHub
4. **Dependencies** - Installs all Node.js dependencies via yarn
5. **Drupal Cache** - Attempts to fetch cached Drupal content (optional)
6. **Static Build** - Runs `yarn build --buildtype=localhost` to generate static HTML
7. **Apache Setup** - Bundles Apache 2.2.22 and configures it to serve the built content
8. **PHP Setup** - Includes PHP 5.3.10 for any dynamic needs

## Directory Structure

After build, your Heroku app will have:

```
/app/
├── content-build/
│   ├── build/
│   │   └── localhost/          # Static HTML files served by Apache
│   ├── src/
│   └── ...
├── apache/
│   └── conf/
│       └── httpd.conf          # Auto-configured to serve from content-build/build
└── boot.sh                      # Startup script
```

## Apache Configuration

The buildpack automatically configures Apache to serve from:
- `/app/content-build/build/localhost` (if exists)
- `/app/content-build/build` (fallback)

The DocumentRoot is dynamically set at runtime in the `boot.sh` script.

## Build Time Optimization (HIGHLY RECOMMENDED)

⚠️ **Warning**: The VA content-build can take 4-8 hours when building ALL content!

### Automatic Content Type Optimization

This buildpack includes an automatic optimization system that can reduce build time from hours to minutes by selectively enabling only the content types you need.

#### How to Optimize

Set the `CONTENT_TYPES` environment variable with a comma-separated list of content types:

```bash
heroku config:set CONTENT_TYPES="pages,navigation,forms"
```

#### Available Content Types

| Content Type | Description | Impact on Build Time |
|-------------|-------------|---------------------|
| `pages` | Standard content pages | High |
| `landing-pages` | Landing pages | High |
| `forms` | VA forms | Medium |
| `offices` | Office pages | High |
| `healthcare` | Healthcare region pages | Very High |
| `qa` | Q&A content | Low |
| `guides` | Step-by-step guides | Medium |
| `media` | Images and videos | High |
| `checklists` | Checklists | Low |
| `support` | Support resources | Medium |
| `campaigns` | Campaign landing pages | Medium |
| `stories` | Stories | Low |
| `news` | News stories | Low |
| `press-releases` | Press releases | Low |
| `events` | Events | Low |
| `outreach` | Outreach pages | Low |
| `navigation` | Site navigation | **Critical** (almost always needed) |
| `alerts` | Alerts and notifications | Low |
| `banners` | Banner alerts | Low |
| `taxonomy` | Taxonomy terms | Low |
| `homepage` | Homepage content | Low |

#### Recommended Configurations

**Minimal (5-10 minutes build time):**
```bash
heroku config:set CONTENT_TYPES="pages,navigation"
```
Best for: Testing, development, or single-page sites

**Common Use Case (30-60 minutes build time):**
```bash
heroku config:set CONTENT_TYPES="pages,landing-pages,forms,navigation,media"
```
Best for: Most production deployments with standard content needs

**Extended (1-2 hours build time):**
```bash
heroku config:set CONTENT_TYPES="pages,landing-pages,forms,offices,qa,guides,navigation,alerts,media"
```
Best for: Comprehensive sites without healthcare content

**Full Site (4-8 hours build time):**
```bash
# Don't set CONTENT_TYPES or set it to empty
heroku config:unset CONTENT_TYPES
```
Best for: Complete VA.gov mirror (rarely needed)

### How It Works

The buildpack uses the [scripts/optimize-content-queries.js](scripts/optimize-content-queries.js) script to automatically modify the content-build's `individual-queries.js` file during the build process, commenting out GraphQL queries for content types you don't need.

### Manual Optimization

If you need more fine-grained control, you can:

1. Clone content-build locally
2. Edit `src/site/stages/build/drupal/individual-queries.js` manually
3. Fork content-build with your changes
4. Modify the buildpack to clone your fork instead

### Additional Speed Improvements

1. **Use Cached Content** - The buildpack automatically attempts to fetch cached Drupal content
2. **Monitor Heroku Timeout** - Heroku free dynos have a 15-minute build timeout; paid plans have higher limits
3. **Pre-build Locally** - For the fastest deployments, build locally and commit the built files

## Environment Variables

You can configure the build with environment variables:

```bash
# Set custom Node version (default: 14.15.0)
heroku config:set NODE_VERSION=14.15.0

# Set custom Yarn version (default: 1.19.1)
heroku config:set YARN_VERSION=1.19.1
```

## Troubleshooting

### Build Timeout
If the build times out, you may need to:
- Reduce the content being built
- Use a private space with higher limits
- Pre-build content and commit the built files

### Apache Not Starting
Check logs with:
```bash
heroku logs --tail
```

Look for Apache configuration errors in the boot process.

### Content Not Displaying
Verify the build output directory exists:
```bash
heroku run bash
ls -la /app/content-build/build/
```

## Alternative: Deploying Pre-Built Content

For faster deployments, you can pre-build the content locally and commit it:

1. Clone content-build locally
2. Run the build process
3. Copy the `build/` directory to your Heroku app repository
4. Deploy to Heroku (skipping the build step)

## References

- [VA Platform Documentation](https://depo-platform-documentation.scrollhelp.site/developer-docs/setting-up-your-local-frontend-environment)
- [content-build Repository](https://github.com/department-of-veterans-affairs/content-build)
- [Heroku Buildpack Documentation](https://devcenter.heroku.com/articles/buildpacks)
