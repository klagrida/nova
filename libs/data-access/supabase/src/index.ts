/**
 * @ice-breaker/data-access-supabase
 * Supabase client and services for IceBreaker game
 */

// Configuration
export * from './config/supabase-config.js';
export * from './config/supabase-client.js';

// Services
export * from './services/game.service.js';
export * from './services/realtime.service.js';
export * from './services/auth.service.js';

// Utils
export * from './utils/error-handler.js';
