#!/usr/bin/env node

/**
 * Generate config.json files for CI/CD
 * Usage: node scripts/generate-config.js
 *
 * Environment variables required:
 * - SUPABASE_URL: Supabase project URL
 * - SUPABASE_ANON_KEY: Supabase anonymous key
 */

import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

const config = {
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
  },
};

// Validate required environment variables
if (!config.supabase.url || !config.supabase.anonKey) {
  console.error('❌ Error: Missing required environment variables');
  console.error('Required: SUPABASE_URL, SUPABASE_ANON_KEY');
  process.exit(1);
}

// Apps to generate config for
const apps = [
  'apps/ice-breaker/admin',
  'apps/ice-breaker/web',
  'apps/ice-breaker/mobile',
];

apps.forEach((app) => {
  const configPath = join(rootDir, app, 'src', 'config.json');

  try {
    // Ensure directory exists
    mkdirSync(dirname(configPath), { recursive: true });

    // Write config file
    writeFileSync(configPath, JSON.stringify(config, null, 2));

    console.log(`✅ Generated config for ${app}`);
  } catch (error) {
    console.error(`❌ Failed to generate config for ${app}:`, error.message);
    process.exit(1);
  }
});

console.log('\n✨ All configuration files generated successfully!');
