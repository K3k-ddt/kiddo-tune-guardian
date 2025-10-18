# 📱 Instrukcja Uruchomienia Aplikacji Mobilnej

Twoja aplikacja **Kiddo Tune Guardian** jest teraz skonfigurowana jako natywna aplikacja mobilna! 🎉

## 🚀 Jak uruchomić aplikację na Androidzie

### Krok 1: Eksportuj projekt do GitHub
1. Kliknij przycisk **"Export to GitHub"** w prawym górnym rogu Lovable
2. Połącz swoje konto GitHub i przenieś projekt

### Krok 2: Sklonuj projekt lokalnie
```bash
git clone [URL_TWOJEGO_REPOZYTORIUM]
cd kiddo-tune-guardian
```

### Krok 3: Zainstaluj zależności
```bash
npm install
```

### Krok 4: Zainicjalizuj Capacitor
```bash
npx cap init
```
(Jeśli zapyta o nazwę - użyj wartości domyślnych, są już skonfigurowane)

### Krok 5: Dodaj platformę Android
```bash
npx cap add android
```

### Krok 6: Zaktualizuj zależności natywne
```bash
npx cap update android
```

### Krok 7: Zbuduj projekt
```bash
npm run build
```

### Krok 8: Synchronizuj kod z natywną platformą
```bash
npx cap sync android
```

### Krok 9: Uruchom aplikację
```bash
npx cap run android
```

To otworzy Android Studio i uruchomi aplikację na emulatorze lub podłączonym urządzeniu.

## 📋 Wymagania

### Dla Androida:
- ✅ **Android Studio** zainstalowany
- ✅ **Android SDK** skonfigurowany
- ✅ Emulator Android LUB fizyczne urządzenie z włączonym trybem deweloperskim

### Dla iOS (opcjonalnie):
- ✅ Mac z zainstalowanym **Xcode**
- ✅ Konto Apple Developer (do testowania na fizycznym urządzeniu)

```bash
# Dla iOS (tylko na Mac):
npx cap add ios
npx cap update ios
npm run build
npx cap sync ios
npx cap run ios
```

## 🔄 Hot Reload

Aplikacja jest skonfigurowana z hot-reload, co oznacza, że możesz testować zmiany bezpośrednio z sandboxa Lovable na swoim urządzeniu mobilnym, bez potrzeby przebudowywania za każdym razem!

URL sandboxa: `https://6de214f9-6524-41c0-ac5e-9af187fcd857.lovableproject.com`

## 🔧 Po każdej zmianie w kodzie

Gdy robisz zmiany w Lovable i chcesz je przetestować:

1. **Git pull** najnowsze zmiany:
```bash
git pull
```

2. **Synchronizuj** z natywną platformą:
```bash
npx cap sync
```

3. **Uruchom** ponownie aplikację:
```bash
npx cap run android
```

## 📦 Budowanie wersji produkcyjnej

Aby przygotować aplikację do publikacji w Google Play Store:

1. Wyłącz hot-reload w `capacitor.config.ts` (usuń sekcję `server`)
2. Zbuduj projekt produkcyjny:
```bash
npm run build
npx cap sync android
```
3. Otwórz Android Studio:
```bash
npx cap open android
```
4. W Android Studio: Build → Generate Signed Bundle/APK

## 🆘 Pomoc i Wsparcie

Jeśli napotkasz problemy:
- 📖 [Dokumentacja Capacitor](https://capacitorjs.com/docs)
- 💬 [Lovable Discord Community](https://discord.com/channels/1119885301872070706/1280461670979993613)
- 📺 [Lovable YouTube Tutorial](https://www.youtube.com/watch?v=9KHLTZaJcR8&list=PLbVHz4urQBZkJiAWdG8HWoJTdgEysigIO)

## ⚠️ Ważne uwagi dotyczące YouTube API

Twoja aplikacja korzysta z YouTube API. Pamiętaj:
- Potrzebujesz klucza API YouTube (już skonfigurowanego w secrets)
- YouTube API ma limity dzienne (10,000 jednostek/dzień)
- Dla aplikacji produkcyjnej rozważ zwiększenie limitu

Powodzenia! 🚀📱
