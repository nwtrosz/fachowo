# Instrukcja Wdrożenia na VPS - Fachowo.net.pl
## System: Oracle Linux (RHEL-based)

Twoja strona jest gotowa do działania na serwerze VPS z Oracle Linux. Poniżej znajdziesz kroki, które musisz wykonać.

## 1. Przygotowanie Serwera (Oracle Linux)
Zaloguj się na serwer przez SSH i zainstaluj niezbędne narzędzia:
```bash
# Włączenie EPEL (dla certbot)
sudo dnf install -y epel-release

# Instalacja Node.js 20.x
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

# Instalacja menedżerów pakietów
sudo npm install -g pnpm pm2
```

## 2. Przesłanie plików
Najlepiej użyć Git:
```bash
git clone <URL_TWOJEGO_REPOZYTORIUM>
cd Strona
```
Albo przesłać pliki przez SFTP (np. FileZilla), pomijając folder `node_modules`.

## 3. Instalacja i Build
Będąc w folderze `Strona` na serwerze:
```bash
pnpm install
pnpm build
```

## 4. Uruchomienie Procesu (PM2)
PM2 zadba o to, by strona działała 24/7 i wstawała po restarcie serwera:
```bash
pm2 start pnpm --name "fachowo-net-pl" -- start
pm2 save
pm2 startup
```

## 5. Domena i SSL (Nginx)
Aby strona była dostępna pod Twoją domeną z certyfikatem SSL, zainstaluj Nginx:
```bash
sudo dnf install -y nginx
sudo systemctl enable --now nginx
```

Skonfiguruj Nginx jako "Reverse Proxy" w pliku `/etc/nginx/conf.d/fachowo.net.pl.conf`:
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name www.fachowo.net.pl;
    return 301 $scheme://fachowo.net.pl$request_uri;
}

server {
    listen 80;
    listen [::]:80;
    server_name fachowo.net.pl;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Następnie uruchom:
```bash
sudo nginx -t && sudo systemctl restart nginx
```

## 6. Zapora sieciowa (Oracle Linux)
```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

---

### Automatyczne wdrożenie
Jeśli chcesz użyć gotowego skryptu:
```bash
sudo bash setup-server.sh
```

### Czy mogę edytować pliki bezpośrednio na serwerze?
**Tak, ale z pewnymi zastrzeżeniami:**
1. **Gemini CLI:** Jeśli zainstalujesz Gemini CLI bezpośrednio na swoim serwerze VPS, będę mógł tam "mieszkać" i edytować pliki dokładnie tak samo, jak robię to teraz u Ciebie lokalnie.
2. **Przez Git:** Najbezpieczniejszą metodą jest edycja plików u siebie (z moją pomocą), wysłanie zmian do Git (GitHub/Bitbucket) i wpisanie `git pull` na serwerze. To gwarantuje, że zawsze masz kopię zapasową.

Jeśli potrzebujesz pomocy z konfiguracją Nginx na serwerze, daj znać!
