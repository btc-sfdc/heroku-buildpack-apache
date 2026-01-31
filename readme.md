> Old Software is Old -- this is unmaintained and left for posterity

Apache+PHP build pack
========================

This is a build pack bundling PHP and Apache for Heroku apps. It tests for the presence of an `index.html` or `index.php` file and then serves out of root with Apache.

## New: VA Content-Build Support

This buildpack has been enhanced to support the Department of Veterans Affairs content-build static site generation.

### 🚀 [Get Started in 3 Steps →](GET-STARTED.md)

**Quick start for VA content-build:**
1. Create a `.va-content-build` marker file in your repo
2. **Optimize build time** (reduces 4-8 hours to 60 minutes):
   ```bash
   heroku config:set CONTENT_TYPES="pages,navigation,forms,offices"
   ```
3. Deploy to Heroku with this buildpack

**⚡ Build Optimization**: Without optimization, builds take 4-8 hours. With the CONTENT_TYPES variable set, builds complete in 10-60 minutes depending on content selection. The default configuration builds pages, navigation, forms, and office locations in ~60 minutes.

### 📚 Documentation

| Quick Links | Description |
|-------------|-------------|
| **[GET-STARTED.md](GET-STARTED.md)** | ⭐ Start here - Deploy in 3 steps |
| [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md) | Step-by-step deployment guide |
| [QUICK-REFERENCE.md](QUICK-REFERENCE.md) | Command reference cheat sheet |
| [OPTIMIZATION-GUIDE.md](OPTIMIZATION-GUIDE.md) | Detailed optimization strategies |
| [VA-CONTENT-DEPLOYMENT.md](VA-CONTENT-DEPLOYMENT.md) | Complete technical documentation |

### ⚙️ How It Works

The buildpack automatically:
- ✅ Installs Node.js 14.15.0 and yarn 1.19.1
- ✅ Clones the VA content-build repository
- ✅ **Optimizes content queries** based on your CONTENT_TYPES
- ✅ Builds the static HTML content
- ✅ Configures Apache 2.2.22 to serve the built pages
- ✅ Includes PHP 5.3.10 for dynamic needs

### 📊 Build Time Comparison

| Configuration | Content Types | Build Time | Dyno Required |
|--------------|---------------|------------|---------------|
| **Recommended** | pages,navigation,forms,offices | 60 min | Standard-1X |
| Minimal | pages,navigation | 10 min | Free/Hobby |
| With Media | pages,navigation,forms,offices,media | 80 min | Standard-1X |
| Full Site | *(all content types)* | 4-8 hours | Not recommended |

Use
---

For new apps:
```bash
$ heroku create --stack cedar --buildpack https://github.com/stevenosloan/heroku-buildpack-apache.git
```

For existing apps:
```bash
$ heroku config:add BUILDPACK_URL=https://github.com/stevenosloan/heroku-buildpack-apache.git
```

Basic Authentication
--------------------

in .htaccess add:
```
AuthUserFile /app/.htpasswd
AuthType Basic
AuthName "Restricted Access"
Require valid-user
```

[generate](http://www.htaccesstools.com/htpasswd-generator/) and add an .htpasswd to root


Configuration
-------------

The config files are bundled with the build pack itself:

* conf/httpd.conf
* conf/php.ini


Meta
----

Big thanks to the guys behind the [php buildpack](https://github.com/heroku/heroku-buildpack-php)

Released under the [MIT License](http://opensource.org/licenses/mit-license.php)
