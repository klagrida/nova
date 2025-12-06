/**
 * Supabase Client Instance
 * Singleton pattern for Supabase client
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@ice-breaker/shared-models';
import type { SupabaseConfig } from './supabase-config.js';
import { DEFAULT_SUPABASE_CONFIG } from './supabase-config.js';

let supabaseInstance: SupabaseClient<Database> | null = null;

/**
 * Initialize Supabase client
 */
export function initializeSupabase(config: Partial<SupabaseConfig>): SupabaseClient<Database> {
  if (supabaseInstance) {
    console.warn('Supabase client already initialized. Returning existing instance.');
    return supabaseInstance;
  }

  // Merge with default config to ensure session persistence and other defaults
  const mergedConfig = {
    ...DEFAULT_SUPABASE_CONFIG,
    ...config,
    options: {
      ...DEFAULT_SUPABASE_CONFIG.options,
      ...config.options,
      auth: {
        ...DEFAULT_SUPABASE_CONFIG.options?.auth,
        ...config.options?.auth,
      },
      realtime: {
        ...DEFAULT_SUPABASE_CONFIG.options?.realtime,
        ...config.options?.realtime,
      },
    },
  };

  if (!mergedConfig.url || !mergedConfig.anonKey) {
    throw new Error('Supabase URL and anon key are required');
  }

  supabaseInstance = createClient<Database>(mergedConfig.url, mergedConfig.anonKey, mergedConfig.options);

  return supabaseInstance;
}

/**
 * Get Supabase client instance
 * Throws if not initialized
 */
export function getSupabase(): SupabaseClient<Database> {
  if (!supabaseInstance) {
    throw new Error(
      'Supabase client not initialized. Call initializeSupabase() first.'
    );
  }

  return supabaseInstance;
}

/**
 * Check if Supabase is initialized
 */
export function isSupabaseInitialized(): boolean {
  return supabaseInstance !== null;
}

/**
 * Reset Supabase instance (useful for testing)
 */
export function resetSupabase(): void {
  supabaseInstance = null;
}
