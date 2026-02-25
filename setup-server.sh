#!/bin/bash

# --- KONFIGURACJA ---
APP_NAME="fachowo-oryginal"
PORT=3001

echo "🚀 Rozpoczynam automatyczną konfigurację serwera dla: $APP_NAME"

# 1. Aktualizacja zależności systemowych (jeśli nie zostały zainstalowane)
echo "📦 Sprawdzam pakiety systemowe..."
sudo apt update
sudo apt install -y nginx git curl

# 2. Sprawdzenie pnpm
if ! command -v pnpm &> /dev/null
then
    echo "📥 Instalacja pnpm..."
    sudo npm install -g pnpm
fi

# 3. Sprawdzenie pm2
if ! command -v pm2 &> /dev/null
then
    echo "📥 Instalacja pm2..."
    sudo npm install -g pm2
fi

# 4. Instalacja bibliotek projektu i budowanie
echo "🛠 Budowanie projektu..."
rm -rf dist
pnpm install
pnpm build

# 5. Konfiguracja Nginx (Nadpisanie pliku default)
echo "🌐 Konfiguracja Nginx na porcie $PORT..."
sudo truncate -s 0 /etc/nginx/sites-available/default
echo "server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    location / {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}" | sudo tee /etc/nginx/sites-available/default > /dev/null

# 6. Restart Nginx
echo "🔄 Restartowanie Nginx..."
sudo nginx -t && sudo systemctl restart nginx

# 7. Uruchomienie aplikacji przez PM2
echo "🎬 Uruchamianie aplikacji..."
pm2 delete $APP_NAME 2>/dev/null
sudo fuser -k $PORT/tcp 2>/dev/null
NODE_ENV=production pm2 start dist/index.js --name "$APP_NAME"
pm2 save

echo "✅ GOTOWE! Twoja strona powinna być dostępna pod adresem IP serwera."
