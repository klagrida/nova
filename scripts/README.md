# Configuration Scripts

## Generate Config

This script generates `config.json` files for all apps from environment variables.

### Usage

#### Local Development

1. Copy the example config files:
```bash
cp apps/ice-breaker/admin/src/config.example.json apps/ice-breaker/admin/src/config.json
cp apps/ice-breaker/web/src/config.example.json apps/ice-breaker/web/src/config.json
cp apps/ice-breaker/mobile/src/config.example.json apps/ice-breaker/mobile/src/config.json
```

2. Edit each `config.json` file with your Supabase credentials

#### CI/CD

Set the following environment variables:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key

Then run:
```bash
pnpm config:generate
```

The script will automatically generate config files for all apps.

### Automatic Generation

The config is automatically generated before:
- `pnpm dev` (via `predev` hook)
- `pnpm build` (via `prebuild` hook)

If environment variables are not set, the script will exit with an error.

### GitHub Actions Example

```yaml
- name: Generate configuration
  env:
    SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
    SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
  run: pnpm config:generate
```
