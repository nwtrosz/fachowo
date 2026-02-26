#!/bin/bash

# --- KONFIGURACJA ---
APP_NAME="fachowo-oryginal"
PORT=3001

echo "🚀 ROZPOCZYNAM PEŁNĄ KONFIGURACJĘ SERWERA: $APP_NAME"

# 1. Aktualizacja zależności systemowych
echo "📦 Sprawdzam pakiety systemowe..."
sudo apt update
sudo apt install -y nginx git curl

# 2. Optymalizacja Nginx (Limity i Timeouty)
echo "🛠 Optymalizuję Nginx (100MB, 5min timeout)..."
sudo sed -i '/client_max_body_size/d' /etc/nginx/nginx.conf
sudo sed -i '/proxy_read_timeout/d' /etc/nginx/nginx.conf
sudo sed -i '/proxy_connect_timeout/d' /etc/nginx/nginx.conf
sudo sed -i '/proxy_send_timeout/d' /etc/nginx/nginx.conf
sudo sed -i 's/http {/http {\n    client_max_body_size 100M;\n    proxy_read_timeout 300;\n    proxy_connect_timeout 300;\n    proxy_send_timeout 300;/g' /etc/nginx/nginx.conf

# 3. Sprawdzenie pnpm i pm2
if ! command -v pnpm &> /dev/null; then
    echo "📥 Instalacja pnpm..."
    sudo npm install -g pnpm
fi
if ! command -v pm2 &> /dev/null; then
    echo "📥 Instalacja pm2..."
    sudo npm install -g pm2
fi

# 4. Przygotowanie folderów i uprawnień
echo "📂 Przygotowuję strukturę danych..."
mkdir -p storage/uploads
sudo chown -R $USER:$USER storage
sudo chmod -R 775 storage

# 5. Instalacja bibliotek projektu i budowanie
echo "🛠 Budowanie projektu..."
# Migracja danych przed czyszczeniem dist (zabezpieczenie)
if [ -f "dist/data.json" ]; then
    mv dist/data.json storage/data.json 2>/dev/null
elif [ -f "server/data.json" ] && [ ! -f "storage/data.json" ]; then
    cp server/data.json storage/data.json
fi
if [ -d "dist/public/uploads" ]; then
    cp -r dist/public/uploads/* storage/uploads/ 2>/dev/null
fi

rm -rf dist
pnpm install
pnpm build

# 6. Konfiguracja Reverse Proxy w Nginx
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

# 7. Restart Nginx
echo "🔄 Restartowanie Nginx..."
sudo nginx -t && sudo systemctl restart nginx

# 8. Uruchomienie aplikacji przez PM2
echo "🎬 Uruchamianie aplikacji..."
pm2 delete $APP_NAME 2>/dev/null
sudo fuser -k $PORT/tcp 2>/dev/null
NODE_ENV=production pm2 start dist/index.js --name "$APP_NAME"
pm2 save

echo "✅ KONFIGURACJA ZAKOŃCZONA SUKCESEM!"
echo "Twoja strona Fachowo.eu powinna być już dostępna i zoptymalizowana."
