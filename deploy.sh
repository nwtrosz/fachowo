#!/bin/bash

# =============================================================================
# LEPKI SKRYPT DEPLOYMENTOWY - TYLKO PULL + BUILD + RESTART
# =============================================================================

APP_NAME="fachowo"
PORT=3001
PROJECT_PATH="/home/opc/fachowo"

echo "🚀 Deploy: pull + build + restart"

if [ "$EUID" -ne 0 ]; then
  echo "❌ Wymagane uprawnienia roota (sudo)!"
  exit 1
fi

cd "$PROJECT_PATH" || { echo "❌ Brak katalogu $PROJECT_PATH"; exit 1; }

echo "📥 [1/4] Git pull..."
git stash --include-untracked 2>/dev/null || true
git pull
git stash pop 2>/dev/null || true

echo "📦 [2/4] pnpm install..."
pnpm install

echo "🔨 [3/4] Build (NODE_OPTIONS=--max-old-space-size=4096)..."
rm -rf dist
NODE_OPTIONS="--max-old-space-size=4096" pnpm build

echo "🔄 [4/4] Restart PM2..."
pm2 delete "$APP_NAME" 2>/dev/null || true
fuser -k $PORT/tcp 2>/dev/null || true
NODE_ENV=production pm2 start dist/index.js --name "$APP_NAME"
pm2 save

sleep 2
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:$PORT)
if [ "$HEALTH" = "200" ]; then
    echo "✅ Gotowe! HTTP $HEALTH na porcie $PORT"
else
    echo "⚠️ Odpowiedź: HTTP $HEALTH - sprawdź: pm2 logs $APP_NAME"
fi
