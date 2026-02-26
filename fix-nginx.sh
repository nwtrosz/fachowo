#!/bin/bash

echo "🛠 Rozpoczynam optymalizację serwera Nginx dla Fachowo.eu..."

# 1. Zwiększenie limitu wysyłanych plików w nginx.conf
if ! grep -q "client_max_body_size" /etc/nginx/nginx.conf; then
    echo "📦 Zwiększam limit przesyłania plików do 100MB..."
    sudo sed -i 's/http {/http {
    client_max_body_size 100M;/g' /etc/nginx/nginx.conf
else
    echo "✅ Limit przesyłania plików jest już ustawiony."
fi

# 2. Ustawienie uprawnień dla folderu storage (aby serwer mógł zapisywać zdjęcia)
echo "📂 Ustawiam uprawnienia dla folderu danych..."
mkdir -p storage/uploads
sudo chown -R $USER:$USER storage
chmod -R 755 storage

# 3. Weryfikacja i restart Nginx
echo "🔄 Testowanie konfiguracji i restart Nginx..."
sudo nginx -t && sudo systemctl restart nginx

echo "✨ GOTOWE! Serwer jest teraz gotowy na przyjmowanie dużych projektów i zdjęć."
