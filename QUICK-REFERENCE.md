# VA Content-Build Quick Reference

## Setup

```bash
# 1. Create marker file
touch .va-content-build

# 2. Optimize build time (IMPORTANT!)
heroku config:set CONTENT_TYPES="pages,navigation,forms,offices"

# 3. Deploy
git add .
git commit -m "Configure VA content-build"
git push heroku master
```

## Common Content Type Combinations

| Use Case | Content Types | Build Time |
|----------|--------------|------------|
| **Minimal site** | `pages,navigation` | ~10 min |
| **Forms portal** | `pages,forms,navigation,media` | ~20 min |
| **General purpose** | `pages,landing-pages,forms,navigation,media` | ~40 min |
| **With news** | `pages,landing-pages,forms,news,stories,navigation,media` | ~50 min |
| **Healthcare site** | `healthcare,offices,pages,navigation,media` | ~90 min |
| **Full site** | *(leave unset)* | 4-8 hours |

## Available Content Types

```
pages           Standard content pages (20-30 min)
landing-pages   Landing pages (15-20 min)
forms           VA forms (10-15 min)
navigation      Site navigation (ALWAYS INCLUDE, 2 min)
media           Images/videos (20-30 min)
healthcare      Healthcare regions (60-90 min)
offices         Office locations (30-40 min)
qa              Q&A content (3-5 min)
guides          Step-by-step guides (8-12 min)
support         Support resources (10-15 min)
news            News stories (3-5 min)
stories         Feature stories (3-5 min)
campaigns       Campaign pages (8-12 min)
homepage        Homepage (2-3 min)
alerts          Alerts (1-2 min)
banners         Banner alerts (1-2 min)
taxonomy        Taxonomies (2-3 min)
checklists      Checklists (2-4 min)
press-releases  Press releases (2-4 min)
events          Events (3-5 min)
outreach        Outreach pages (3-5 min)
```

## Commands

```bash
# View current config
heroku config:get CONTENT_TYPES

# Change content types
heroku config:set CONTENT_TYPES="pages,navigation,NEW_TYPE"

# Build everything (slow)
heroku config:unset CONTENT_TYPES

# Trigger rebuild
git commit --allow-empty -m "Rebuild"
git push heroku master

# View build logs
heroku logs --tail

# Check if optimizer ran
heroku logs | grep "Optimizing content queries"
```

## Files

- [OPTIMIZATION-GUIDE.md](OPTIMIZATION-GUIDE.md) - Complete optimization guide
- [VA-CONTENT-DEPLOYMENT.md](VA-CONTENT-DEPLOYMENT.md) - Full deployment instructions
- [.va-content-build.example](.va-content-build.example) - Configuration template
- [scripts/optimize-content-queries.js](scripts/optimize-content-queries.js) - Optimizer script

## Tips

1. **Always include `navigation`** - Required for working site
2. **Start minimal** - Add types as needed
3. **Avoid `healthcare` unless essential** - Adds 60-90 minutes
4. **Monitor first build** - Check logs to ensure optimization works
5. **Test locally first** - Clone content-build and run `yarn build`

## Troubleshooting

**Build takes hours:**
```bash
heroku config:get CONTENT_TYPES  # Should return your types, not empty
```

**Missing content:**
```bash
heroku config:set CONTENT_TYPES="existing,types,NEW_TYPE"
git commit --allow-empty -m "Add content type"
git push heroku master
```

**Build fails:**
```bash
heroku config:unset CONTENT_TYPES  # Try building everything
git push heroku master
```

## Example: From 8 Hours to 15 Minutes

**Before:**
```bash
# No optimization
# Build time: 4-8 hours
git push heroku master
```

**After:**
```bash
heroku config:set CONTENT_TYPES="pages,navigation"
git push heroku master
# Build time: ~15 minutes
```

**Savings: 95-97% faster!** 🚀
