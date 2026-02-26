#!/bin/bash

echo "🛠 Rozpoczynam ZAAWANSOWANĄ optymalizację serwera Nginx dla Fachowo.eu..."

# 1. Konfiguracja limitów i timeoutów w nginx.conf
# Usuwamy stare wpisy, jeśli istnieją, aby uniknąć duplikatów
sudo sed -i '/client_max_body_size/d' /etc/nginx/nginx.conf
sudo sed -i '/proxy_read_timeout/d' /etc/nginx/nginx.conf
sudo sed -i '/proxy_connect_timeout/d' /etc/nginx/nginx.conf
sudo sed -i '/proxy_send_timeout/d' /etc/nginx/nginx.conf

# Dodajemy nowe, solidne limity
sudo sed -i 's/http {/http {\n    client_max_body_size 100M;\n    proxy_read_timeout 300;\n    proxy_connect_timeout 300;\n    proxy_send_timeout 300;/g' /etc/nginx/nginx.conf

# 2. Ustawienie uprawnień dla folderu storage
echo "📂 Ustawiam uprawnienia dla folderu danych i wgrywania..."
mkdir -p storage/uploads
sudo chown -R www-data:www-data storage 2>/dev/null || sudo chown -R $USER:$USER storage
sudo chmod -R 775 storage

# 3. Weryfikacja i restart Nginx
echo "🔄 Testowanie konfiguracji i restart Nginx..."
sudo nginx -t && sudo systemctl restart nginx

echo "✨ GOTOWE! Teraz serwer powinien bez problemu przyjmować nawet bardzo duże paczki zdjęć."
