#!/bin/bash

# --- KONFIGURACJA ---
DOMAIN="fachowo.net.pl"
EMAIL="fachowo.eu@gmail.com"
PORT=3001

echo "🌐 ROZPOCZYNAM KONFIGURACJĘ DOMENY: $DOMAIN"

# 1. Instalacja Certbota (jeśli nie ma)
echo "📦 Instalacja narzędzi SSL (Certbot)..."
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# 2. Aktualizacja konfiguracji Nginx pod domenę
echo "📝 Aktualizacja pliku Nginx..."
sudo truncate -s 0 /etc/nginx/sites-available/default
echo "server {
    listen 80;
    listen [::]:80;
    server_name www.$DOMAIN;
    return 301 \$scheme://$DOMAIN\$request_uri;
}

server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;

    add_header Content-Language pl-PL;

    location / {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}" | sudo tee /etc/nginx/sites-available/default > /dev/null

# 3. Test i restart Nginx
echo "🔄 Restartowanie Nginx..."
sudo nginx -t && sudo systemctl restart nginx

# 4. Generowanie certyfikatu SSL
echo "🔒 Generowanie darmowego certyfikatu SSL dla $DOMAIN..."
echo "Upewnij się, że rekordy DNS na nazwa.pl już wskazują na ten serwer!"
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m $EMAIL --redirect

echo "✅ GOTOWE! Twoja strona powinna być dostępna pod adresem: https://$DOMAIN"
