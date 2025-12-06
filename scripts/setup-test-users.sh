#!/bin/bash

# Script to create test users for E2E tests
# Uses Supabase local API to create auth users

set -e

SUPABASE_URL="${SUPABASE_URL:-http://127.0.0.1:54321}"
SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0}"

echo "Setting up test users for E2E tests..."

# Create test user for E2E tests
create_user() {
  local email=$1
  local password=$2

  echo "Creating user: $email"

  response=$(curl -s -w "\n%{http_code}" -X POST "${SUPABASE_URL}/auth/v1/signup" \
    -H "apikey: ${SUPABASE_ANON_KEY}" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${email}\",\"password\":\"${password}\",\"email_confirm\":true}")

  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | head -n-1)

  if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
    echo "✓ User created successfully: $email"
  else
    # Check if user already exists
    if echo "$body" | grep -q "already registered"; then
      echo "⚠ User already exists: $email (this is OK)"
    else
      echo "✗ Failed to create user: $email"
      echo "Response: $body"
      echo "HTTP Code: $http_code"
      return 1
    fi
  fi
}

# Create test users
create_user "user@example.com" "password123"
create_user "admin@example.com" "password123"
create_user "test@example.com" "password123"

echo ""
echo "✓ Test users setup complete!"
