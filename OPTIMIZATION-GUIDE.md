# VA Content-Build Optimization Guide

This guide explains how to dramatically reduce VA content-build times from hours to minutes.

## Quick Start

```bash
# Set content types you need
heroku config:set CONTENT_TYPES="pages,navigation,forms"

# Deploy
git push heroku master
```

That's it! Your build will now take 10-30 minutes instead of 4-8 hours.

## Understanding the Problem

The VA content-build system generates static HTML from Drupal content. By default, it builds:
- All page types (1000s of pages)
- All healthcare regions (100s of regions)
- All offices (1000s of offices)
- All media assets
- Complete navigation trees
- Taxonomies and metadata

**This results in 4-8 hour build times** even on fast hardware.

## The Solution: Selective Building

Most deployments only need a subset of content. The optimization system allows you to specify exactly which content types to build.

## Content Type Reference

### Critical Content Types (Always Include These)

#### `navigation`
- Site menus, sidebars, footer
- **Required for**: Any functional site
- **Build time impact**: Low (~2 minutes)
- **Recommendation**: Always include

### Core Content Types

#### `pages`
- Standard content pages
- **Contains**: Most VA.gov content
- **Build time impact**: High (~20-30 minutes)
- **Recommendation**: Include for most sites

#### `landing-pages`
- Landing and overview pages
- **Contains**: Section landing pages, campaign pages
- **Build time impact**: High (~15-20 minutes)
- **Recommendation**: Include if you have landing pages

#### `forms`
- VA forms and form pages
- **Contains**: All VA form pages
- **Build time impact**: Medium (~10-15 minutes)
- **Recommendation**: Include if you display forms

### Healthcare Content Types

#### `healthcare`
- Healthcare region detail pages
- **Contains**: VAMC pages, health services
- **Build time impact**: Very High (~60-90 minutes)
- **Recommendation**: Only include if building healthcare content

#### `offices`
- Office location pages
- **Contains**: VBA, NCA, and other office pages
- **Build time impact**: High (~30-40 minutes)
- **Recommendation**: Only include if displaying office information

### Media and Assets

#### `media`
- Images and videos
- **Contains**: Media assets and libraries
- **Build time impact**: High (~20-30 minutes)
- **Recommendation**: Include if you use images/videos

### Informational Content

#### `qa`
- Question and answer content
- **Build time impact**: Low (~3-5 minutes)

#### `guides`
- Step-by-step guides
- **Build time impact**: Medium (~8-12 minutes)

#### `support`
- Support resource pages
- **Build time impact**: Medium (~10-15 minutes)

#### `checklists`
- Checklist content
- **Build time impact**: Low (~2-4 minutes)

### News and Events

#### `news`
- News stories
- **Build time impact**: Low (~3-5 minutes)

#### `stories`
- Feature stories
- **Build time impact**: Low (~3-5 minutes)

#### `press-releases`
- Press releases
- **Build time impact**: Low (~2-4 minutes)

#### `events`
- Event listings
- **Build time impact**: Low (~3-5 minutes)

### Special Content

#### `campaigns`
- Campaign landing pages
- **Build time impact**: Medium (~8-12 minutes)

#### `outreach`
- Outreach material pages
- **Build time impact**: Low (~3-5 minutes)

#### `alerts`
- System alerts and notifications
- **Build time impact**: Low (~1-2 minutes)

#### `banners`
- Banner alerts
- **Build time impact**: Low (~1-2 minutes)

#### `taxonomy`
- Taxonomy terms and categories
- **Build time impact**: Low (~2-3 minutes)

#### `homepage`
- Homepage content
- **Build time impact**: Low (~2-3 minutes)

## Example Configurations

### Scenario 1: Simple Information Site

**Goal**: Display basic VA information pages
**Build Time**: ~10 minutes

```bash
heroku config:set CONTENT_TYPES="pages,navigation"
```

### Scenario 2: Forms Portal

**Goal**: VA forms directory and search
**Build Time**: ~20 minutes

```bash
heroku config:set CONTENT_TYPES="pages,forms,navigation,media"
```

### Scenario 3: Healthcare Locator

**Goal**: Find VA healthcare facilities
**Build Time**: ~90 minutes

```bash
heroku config:set CONTENT_TYPES="healthcare,offices,pages,navigation,media"
```

### Scenario 4: News and Resources

**Goal**: VA news, guides, and support resources
**Build Time**: ~30 minutes

```bash
heroku config:set CONTENT_TYPES="pages,news,stories,guides,support,navigation,media"
```

### Scenario 5: General Purpose VA Site

**Goal**: Comprehensive site without healthcare
**Build Time**: ~60 minutes

```bash
heroku config:set CONTENT_TYPES="pages,landing-pages,forms,offices,qa,guides,support,campaigns,navigation,alerts,media,homepage"
```

## Build Time Formula

Approximate build times (on Heroku standard dynos):

- **Base time**: ~5 minutes (Node.js, yarn, dependencies)
- **Navigation**: +2 minutes
- **Pages**: +20-30 minutes
- **Landing pages**: +15-20 minutes
- **Forms**: +10-15 minutes
- **Healthcare**: +60-90 minutes
- **Offices**: +30-40 minutes
- **Media**: +20-30 minutes
- **Other types**: +1-15 minutes each

## Tips for Fastest Builds

1. **Start Minimal**: Begin with just `pages,navigation` and add types as needed
2. **Test Locally**: Use `yarn build` locally to understand what you need
3. **Monitor Build Logs**: Watch Heroku build logs to see which queries take longest
4. **Avoid Healthcare**: Healthcare regions add 60-90 minutes; only include if essential
5. **Cache Content**: The buildpack fetches Drupal cache automatically

## Troubleshooting

### Build Still Takes Too Long

Check that environment variable is set:
```bash
heroku config:get CONTENT_TYPES
```

Verify the optimizer ran by checking build logs:
```bash
heroku logs --tail | grep "Optimizing content queries"
```

### Missing Content

Add the content type to your CONTENT_TYPES variable:
```bash
heroku config:set CONTENT_TYPES="pages,navigation,forms,YOUR_NEW_TYPE"
```

Then redeploy:
```bash
git commit --allow-empty -m "Trigger rebuild"
git push heroku master
```

### Build Fails

Try with ALL content types to isolate the issue:
```bash
heroku config:unset CONTENT_TYPES
git push heroku master
```

If it works, the issue is with your content type selection.

## Advanced: Custom Optimization

For maximum control, you can fork the content-build repository and modify `src/site/stages/build/drupal/individual-queries.js` directly.

### Modify the Buildpack

1. Edit [bin/compile](bin/compile) line 64-66:
   ```bash
   # Change this:
   git clone --depth 1 https://github.com/department-of-veterans-affairs/content-build.git "$CONTENT_BUILD_DIR"

   # To this:
   git clone --depth 1 https://github.com/YOUR-USERNAME/content-build.git "$CONTENT_BUILD_DIR"
   ```

2. Deploy your changes:
   ```bash
   git commit -am "Use custom content-build fork"
   git push
   ```

## Related Files

- [scripts/optimize-content-queries.js](scripts/optimize-content-queries.js) - The optimization script
- [bin/compile](bin/compile) - Buildpack compile script
- [.va-content-build.example](.va-content-build.example) - Configuration example
- [VA-CONTENT-DEPLOYMENT.md](VA-CONTENT-DEPLOYMENT.md) - Full deployment guide
