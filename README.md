# Plants vs. Zombies 🌻🧟 (Web, Mobile PWA & Native App)

A modern, high-performance cross-platform implementation of the classic lane defense game **Plants vs. Zombies**, built with modular HTML5, CSS3, and ES6 JavaScript. Powered by **Vite** and **Capacitor** for seamless deployment across Web, Mobile PWA, Android, and iOS.

---

## 🚀 Key Highlights & Platforms

* 🌐 **Web & Desktop:** Fast dev server & optimized bundle powered by **Vite**.
* 📱 **Mobile PWA:** Progressive Web App with offline service worker, installable directly to iOS & Android homescreens.
* 📦 **Native Mobile Apps (Capacitor):** Pre-configured Android & iOS native projects ready for APK/AAB export or Xcode compilation.
* 🔊 **Web Audio Synthesizer:** Built-in dynamic sound effects (peashooter, sun chimes, zombie hits, victory fanfare) with no external audio file bloat.
* 🎮 **Touch & Landscape Optimization:** Auto landscape prompt, touch-to-plant, touch sun collection, and mobile safe area insets.

---

## 📁 Professional Project Structure

```
plants-vs-zombies/
├── android/                    # Native Android Studio project (Capacitor)
├── ios/                        # Native Xcode project (Capacitor)
├── public/                     # Static assets & PWA configuration
│   ├── favicon.ico             # App icon
│   ├── icon-192.png            # PWA standard icon
│   ├── icon-512.png            # PWA splash icon
│   ├── manifest.webmanifest    # Web App Manifest
│   └── sw.js                   # Service Worker (offline cache)
├── src/
│   ├── styles/                 # Modular CSS architecture
│   │   ├── variables.css       # Design tokens & color system
│   │   ├── layout.css          # Game container & grid board
│   │   ├── ui.css              # HUD, cards, controls, leaderboard & modals
│   │   ├── entities.css        # Plants, zombies, projectiles & animations
│   │   ├── responsive.css      # Landscape locking & mobile responsiveness
│   │   └── index.css           # Bundled styles
│   ├── js/                     # Modular Game Logic (ES6 Modules)
│   │   ├── config.js           # Plant & zombie stats, game constants
│   │   ├── state.js            # Reactive game state & localStorage persistence
│   │   ├── sound.js            # Web Audio API sound synthesizer
│   │   ├── board.js            # Grid calculation & fullscreen controller
│   │   ├── plants.js           # Plant selection, planting, abilities & shooting
│   │   ├── zombies.js          # Zombie AI, speed, wave director & multipliers
│   │   ├── projectiles.js      # Collision detection, slow/fire/pierce effects
│   │   ├── sun.js              # Sky suns, sunflower production & collection
│   │   ├── ui.js               # HUD updates, points popups & Top 10 leaderboard
│   │   └── game.js             # Main loop, speed control, pause/resume & game over
│   └── main.js                 # App bootstrap, event binders & PWA registrar
├── index.html                  # Root entry point
├── vite.config.js              # Vite bundler configuration
├── capacitor.config.json       # Mobile native app settings
└── package.json                # Dependencies and build scripts
```

---

## 🛠️ Quick Start

### 1. Requirements
* [Node.js](https://nodejs.org/) (v18 or higher)
* [npm](https://www.npmjs.com/)

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server (Web & Local Mobile)
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. Since `--host` is enabled, you can also open the local network IP on your phone connected to the same Wi-Fi.

### 4. Build for Production (Web)
```bash
npm run build
```
Production assets are generated in the `dist/` directory.

---

## 📱 Building Mobile Native Apps

### Android App (APK / AAB)
1. Build web assets and sync to Android:
   ```bash
   npm run build:android
   ```
2. Open in Android Studio to run on an emulator or export APK:
   ```bash
   npm run cap:open:android
   ```

### iOS App (Xcode / iPhone)
1. Build web assets and sync to iOS:
   ```bash
   npm run build:ios
   ```
2. Open in Xcode to build and run on iOS Simulator or Device:
   ```bash
   npm run cap:open:ios
   ```

---

## 🌟 Game Features

* 🌻 **9 Unique Plants:** Sunflower, Peashooter, Repeater, Snow Pea, Wall-nut, Chomper, Threepeater, Fire Pea, Cactus.
* 🧟 **5 Zombie Variants:** Normal, Conehead, Buckethead, Fast, and Boss Zombies.
* ⚡ **Variable Speed:** Toggle between 1x, 2x, and 3x game speeds.
* 🏆 **Top 10 High Scores:** Stored locally with detailed date and time stamps.
* 🔊 **Sound System:** Toggle sound on/off anytime with the HUD sound button.

---

## 📄 License

This project is licensed under the MIT License.
