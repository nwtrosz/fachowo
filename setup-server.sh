#!/bin/bash

# =====================================================================
# PEŁNY SKRYPT WDROŻENIOWY I KONFIGURACYJNY DLA FACHOWO.NET.PL
# =====================================================================

# --- KONFIGURACJA ZGODNA Z WYBOREM UŻYTKOWNIKA ---
APP_NAME="fachowo"
PORT=3001
DOMAIN="fachowo.net.pl"
EMAIL="fachowo.eu@gmail.com"
SERVER_IP="45.147.248.195"
PROJECT_PATH="/root/fachowo/Strona"

echo "🚀 [1/9] ROZPOCZYNAM PEŁNĄ KONFIGURACJĘ SERWERA DLA: $DOMAIN"

# --- ZABEZPIECZENIE UPRAWNIEŃ ROOT ---
if [ "$EUID" -ne 0 ]; then
  echo "❌ Ten skrypt musi być uruchomiony z uprawnieniami roota (sudo)!"
  exit 1
fi

# --- SPRAWDZENIE KATALOGU ROBOCZEGO ---
if [ "$(pwd)" != "$PROJECT_PATH" ]; then
    echo "📂 Zmiana katalogu roboczego na: $PROJECT_PATH"
    cd "$PROJECT_PATH" 2>/dev/null || {
        echo "❌ BŁĄD: Nie można wejść do katalogu $PROJECT_PATH. Upewnij się, że projekt został sklonowany do tego folderu."
        exit 1
    }
fi

# --- 1. AKTUALIZACJA I INSTALACJA PAKIETÓW ---
echo "📦 [2/9] Aktualizuję pakiety systemowe i instaluję zależności..."
apt update
apt install -y nginx git curl certbot python3-certbot-nginx ufw

# --- 2. KONFIGURACJA ZAPORY (FIREWALL) ---
echo "🔒 [3/9] Konfiguruję zaporę sieciową (UFW) dla portów 80 i 443..."
ufw allow 'Nginx Full'
ufw --force enable

# --- 3. OPTYMALIZACJA NGINX ---
echo "🛠 [4/9] Optymalizuję ustawienia Nginx..."
sed -i '/client_max_body_size/d' /etc/nginx/nginx.conf
sed -i '/proxy_read_timeout/d' /etc/nginx/nginx.conf
sed -i '/proxy_connect_timeout/d' /etc/nginx/nginx.conf
sed -i '/proxy_send_timeout/d' /etc/nginx/nginx.conf
sed -i 's/http {/http {\n    client_max_body_size 100M;\n    proxy_read_timeout 300;\n    proxy_connect_timeout 300;\n    proxy_send_timeout 300;/g' /etc/nginx/nginx.conf

# --- 4. INSTALACJA PNPM I PM2 ---
echo "📥 [5/9] Sprawdzam i instaluję menedżery pakietów..."
if ! command -v pnpm &> /dev/null; then
    npm install -g pnpm
fi
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

# --- 5. PRZYGOTOWANIE STRUKTURY PROJEKTU ---
echo "📂 [6/9] Przygotowuję foldery i uprawnienia..."
mkdir -p storage/uploads
chown -R root:root storage 2>/dev/null || true
chmod -R 775 storage

# --- 6. INSTALACJA I BUDOWANIE ---
echo "🛠 [7/9] Instaluję biblioteki i buduję projekt..."
# Migracja danych przed buildem (zabezpieczenie)
if [ -f "dist/data.json" ]; then
    mv dist/data.json storage/data.json 2>/dev/null || true
elif [ -f "server/data.json" ] && [ ! -f "storage/data.json" ]; then
    cp server/data.json storage/data.json
fi
if [ -d "dist/public/uploads" ]; then
    cp -r dist/public/uploads/* storage/uploads/ 2>/dev/null || true
fi

rm -rf dist
pnpm install
pnpm build

# --- 7. KONFIGURACJA REVERSE PROXY NGINX ---
echo "🌐 [8/9] Konfiguruję Nginx dla domeny $DOMAIN..."
CONF_FILE="/etc/nginx/sites-available/$DOMAIN"
truncate -s 0 $CONF_FILE

cat <<EOF > $CONF_FILE
server {
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
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Aktywacja nowej konfiguracji
ln -sf $CONF_FILE /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true

# Test i restart Nginx
nginx -t && systemctl restart nginx

# --- 8. URUCHOMIENIE APLIKACJI (PM2) ---
echo "🎬 [9/9] Uruchamiam aplikację przez PM2..."

# Usuwanie wszystkich potencjalnych konfliktowych procesów
pm2 delete "$APP_NAME" 2>/dev/null || true
pm2 delete "fachowo" 2>/dev/null || true
pm2 delete "fachowo-oryginal" 2>/dev/null || true
pm2 delete "fachowo-net-pl" 2>/dev/null || true

# Zwolnienie portu
fuser -k $PORT/tcp 2>/dev/null || true

# Start aplikacji
NODE_ENV=production pm2 start dist/index.js --name "$APP_NAME"
pm2 save

# --- DIAGNOSTYKA LOKALNA ---
echo "🔍 Uruchamiam diagnostykę lokalną..."
sleep 3
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:$PORT)

if [ "$HEALTH_CHECK" -eq 200 ] || [ "$HEALTH_CHECK" -eq 301 ] || [ "$HEALTH_CHECK" -eq 302 ]; then
    echo "✅ Aplikacja Node.js działa poprawnie na porcie $PORT (HTTP Code: $HEALTH_CHECK)"
else
    echo "❌ OSTRZEŻENIE: Aplikacja Node.js nie odpowiedziała poprawnie na porcie $PORT (HTTP Code: $HEALTH_CHECK)"
    echo "Sprawdź logi aplikacji: pm2 logs $APP_NAME"
fi

# --- KONFIGURACJA SSL / CERTBOT (Z DIAGNOSTYKĄ DNS) ---
echo "🔒 Sprawdzam konfigurację DNS dla domeny $DOMAIN..."

# Pobieramy IP domeny i IP serwera
DOMAIN_IP=$(getent ahosts "$DOMAIN" | awk '{print $1}' | head -n 1)

echo "   IP Domena: $DOMAIN_IP"
echo "   IP Serwer: $SERVER_IP"

if [ "$DOMAIN_IP" = "$SERVER_IP" ]; then
    echo "✅ Rekordy DNS są poprawne! Uruchamiam Certbot..."
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m $EMAIL --redirect
    echo "✅ SSL skonfigurowany pomyślnie!"
else
    echo "⚠️ OSTRZEŻENIE: Rekordy DNS domeny $DOMAIN wskazują na inny IP ($DOMAIN_IP) niż ten serwer ($SERVER_IP)."
    echo "   Certbot nie może teraz wygenerować certyfikatu SSL (zakończyłby się błędem 404)."
    echo "   👉 Zmień rekordy A w konfiguracji swojej domeny na: $SERVER_IP"
    echo "   👉 Po aktualizacji DNS, uruchom Certbot ręcznie wpisując:"
    echo "      sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN -m $EMAIL --agree-tos"
fi

echo "====================================================================="
echo "✅ PROCES WDROŻENIA ZAKOŃCZONY SUKCESEM!"
echo "   Domena: http://$DOMAIN"
echo "   Status PM2:"
pm2 status "$APP_NAME"
echo "====================================================================="
