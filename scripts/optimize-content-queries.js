#!/usr/bin/env node
/**
 * Content Build Query Optimizer
 *
 * This script modifies the content-build individual-queries.js file to disable
 * specific content types, dramatically reducing build time.
 *
 * Usage:
 *   node optimize-content-queries.js <path-to-individual-queries.js> <enabled-types>
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Usage: node optimize-content-queries.js <path-to-individual-queries.js> [enabled-types]');
  process.exit(1);
}

const queryFilePath = args[0];
const enabledTypes = args[1] ? args[1].split(',').map(t => t.trim()) : [];

// Content type mapping - these are the major query groups that can be disabled
const CONTENT_TYPES = {
  // Node queries
  'pages': ['getNodePageQueries'],
  'landing-pages': ['getNodeLandingPageQueries'],
  'forms': ['getNodeVaFormQueries'],
  'offices': ['getNodeOfficeQueries'],
  'healthcare': ['getNodeHealthCareRegionDetailPageQueries'],
  'qa': ['getNodeQaQueries'],
  'guides': ['getNodeStepByStepQueries'],
  'media': ['getNodeMediaQueries'],
  'checklists': ['getNodeChecklistQueries'],
  'support': ['getNodeSupportResourcesDetailPageQueries'],
  'campaigns': ['getNodeCampaignLandingPageQueries'],
  'stories': ['getNodeStoryQueries'],
  'news': ['getNodeNewsStoryQueries'],
  'press-releases': ['getNodePressReleaseQueries'],
  'events': ['getNodeEventQueries'],
  'outreach': ['getNodeOutreachQueries'],

  // Component queries
  'navigation': ['GetAllSideNavMachineNames', 'menuQuery', 'headerFooterData'],
  'alerts': ['alertsQuery', 'GetAllBlockAlertDescriptions'],
  'banners': ['GetAllBannerAlerts'],
  'taxonomy': ['taxonomyQuery'],
  'homepage': ['homepageQuery'],
};

console.log('🔍 Content Build Query Optimizer');
console.log('================================');
console.log(`Target file: ${queryFilePath}`);
console.log(`Enabled types: ${enabledTypes.length > 0 ? enabledTypes.join(', ') : 'ALL (no optimization)'}`);

// If no types specified, don't optimize (build everything)
if (enabledTypes.length === 0) {
  console.log('⚠️  No content types specified - building ALL content');
  console.log('   This may take several hours!');
  console.log('   Set CONTENT_TYPES environment variable to optimize.');
  process.exit(0);
}

// Read the original file
if (!fs.existsSync(queryFilePath)) {
  console.error(`❌ Error: File not found: ${queryFilePath}`);
  process.exit(1);
}

let fileContent = fs.readFileSync(queryFilePath, 'utf8');
console.log('✅ Original file loaded');

// Determine which query functions to disable
const disabledQueries = [];
Object.keys(CONTENT_TYPES).forEach(type => {
  if (!enabledTypes.includes(type)) {
    disabledQueries.push(...CONTENT_TYPES[type]);
  }
});

console.log(`\n📊 Optimization Plan:`);
console.log(`   Enabled: ${enabledTypes.length} content types`);
console.log(`   Disabled: ${Object.keys(CONTENT_TYPES).length - enabledTypes.length} content types`);
console.log(`   Query functions to disable: ${disabledQueries.length}`);

// Comment out disabled query spreads
let modifiedContent = fileContent;
let modificationsCount = 0;

disabledQueries.forEach(queryFunc => {
  // Match patterns like:
  // ...getNodePageQueries(entityCounts)
  // componentQueries.GetAllSideNavMachineNames = GetAllSideNavMachineNames;

  // Pattern 1: Spread syntax
  const spreadPattern = new RegExp(`(\\s*)(\\.\\.\\.${queryFunc}[^\\n]*\\n)`, 'g');
  modifiedContent = modifiedContent.replace(spreadPattern, (match, indent, content) => {
    modificationsCount++;
    return `${indent}// DISABLED BY OPTIMIZER: ${content}`;
  });

  // Pattern 2: Direct assignment
  const assignPattern = new RegExp(`(\\s*)(\\w+\\.${queryFunc}[^\\n]*\\n)`, 'g');
  modifiedContent = modifiedContent.replace(assignPattern, (match, indent, content) => {
    modificationsCount++;
    return `${indent}// DISABLED BY OPTIMIZER: ${content}`;
  });
});

// Write the modified file back
if (modificationsCount > 0) {
  // Create backup
  const backupPath = `${queryFilePath}.backup`;
  fs.writeFileSync(backupPath, fileContent);
  console.log(`✅ Backup created: ${backupPath}`);

  // Write optimized version
  fs.writeFileSync(queryFilePath, modifiedContent);
  console.log(`✅ Optimized file written: ${queryFilePath}`);
  console.log(`   ${modificationsCount} queries disabled`);
  console.log('\n⚡ Build time should be significantly reduced!');
} else {
  console.log('⚠️  No modifications made - check content type names');
  console.log('   Available types:', Object.keys(CONTENT_TYPES).join(', '));
}

console.log('\n✨ Done!');
