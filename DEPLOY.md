# Instrukcja Wdrożenia na VPS - Fachowo.eu

Twoja strona jest gotowa do działania na serwerze VPS (np. Ubuntu). Poniżej znajdziesz kroki, które musisz wykonać.

## 1. Przygotowanie Serwera (Ubuntu)
Zaloguj się na serwer przez SSH i zainstaluj niezbędne narzędzia:
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
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
pm2 start pnpm --name "fachowo-eu" -- start
pm2 save
pm2 startup
```

## 5. Domena i SSL (Nginx)
Aby strona była dostępna pod Twoją domeną z certyfikatem SSL, zainstaluj Nginx:
```bash
sudo apt install nginx
```
Skonfiguruj Nginx jako "Reverse Proxy", aby przekierowywał ruch z portu 80 (HTTP) i 443 (HTTPS) na port Twojej aplikacji (domyślnie 3001).

---

### Czy mogę edytować pliki bezpośrednio na serwerze?
**Tak, ale z pewnymi zastrzeżeniami:**
1. **Gemini CLI:** Jeśli zainstalujesz Gemini CLI bezpośrednio na swoim serwerze VPS, będę mógł tam "mieszkać" i edytować pliki dokładnie tak samo, jak robię to teraz u Ciebie lokalnie.
2. **Przez Git:** Najbezpieczniejszą metodą jest edycja plików u siebie (z moją pomocą), wysłanie zmian do Git (GitHub/Bitbucket) i wpisanie `git pull` na serwerze. To gwarantuje, że zawsze masz kopię zapasową.

Jeśli potrzebujesz pomocy z konfiguracją Nginx na serwerze, daj znać!
