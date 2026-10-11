# Plants vs Zombies: Battle Royale

Game sinh tồn chiến thuật 2D kết hợp phong cách Battle Royale và cơ chế Plants vs Zombies cổ điển, được phát triển trên nền tảng Web, Mobile PWA và ứng dụng di động Native (Android & iOS) sử dụng Vite và Capacitor.

**Tác giả:** Thanh Đào ([@ThanhhDaoo](https://github.com/ThanhhDaoo))

---

## Giới thiệu

Dự án tái hiện thế giới Plants vs Zombies dưới góc nhìn chiến đấu sinh tồn thời gian thực:
- Nhập vai Đậu Chiến Binh Spetsnaz với khả năng di chuyển tự do, ngắm bắn xoay 360 độ, lướt né đòn và thay băng đạn.
- Sinh tồn trước các đợt sóng Zombie đa dạng và Boss đột biến trong khu vườn vòng bo kịch độc.
- Thu thập hòm tiếp tế rơi ngẫu nhiên trên bản đồ để sở hữu các vũ khí hỏa lực cao cấp.
- Nâng cấp chỉ số bản thân (Máu, Giáp, Tốc độ, Bán kính hút đồ) và mở khóa các loại súng trong Tủ Đồ.

---

## Nền tảng hỗ trợ

- **Web Máy Tính (Desktop):** Giao diện sảnh điều khiển rộng mở, đầy đủ nhiệm vụ ngày, bảng xếp hạng và hiển thị phím tắt trực quan (WASD, Chuột, Space, R).
- **Web Di Động (Mobile Responsive):** Tối ưu hóa cho màn hình ngang, cụm phím điều khiển công thái học dạng vòng cung ôm sát ngón tay cái, thanh HUD bán trong suốt chống che khuất zombie.
- **Android:** Hỗ trợ cài đặt trực tiếp qua file APK hoặc đồng bộ qua Android Studio.
- **iOS:** Tích hợp sẵn project Xcode thông qua Capacitor, sẵn sàng chạy trên máy ảo hoặc thiết bị iPhone thật.

---

## Hướng dẫn cài đặt và chạy trên máy tính

### 1. Yêu cầu hệ thống
- Node.js phiên bản 18 trở lên
- npm

### 2. Cài đặt thư viện
```bash
npm install
```

### 3. Chạy môi trường phát triển (Development)
```bash
npm run dev
```
Truy cập đường dẫn: `http://localhost:3000` trên trình duyệt.

### 4. Đóng gói bản Web (Production)
```bash
npm run build
```
File build hoàn thiện sẽ nằm trong thư mục `dist/`.

---

## Hướng dẫn build ứng dụng di động

### Bản Android
1. Build code web và đồng bộ sang Android:
   ```bash
   npm run build:android
   ```
2. Build file APK trực tiếp qua dòng lệnh:
   ```bash
   cd android && ./gradlew assembleDebug && cd ..
   ```
   File APK đầu ra nằm tại: `android/app/build/outputs/apk/debug/app-debug.apk` (hoặc thư mục `build-outputs/PlantsVsZombies-debug.apk`).
3. Hoặc mở project trong Android Studio:
   ```bash
   npm run cap:open:android
   ```

### Bản iOS
1. Build code web và đồng bộ sang iOS:
   ```bash
   npm run build:ios
   ```
2. Mở project trong Xcode để kiểm thử hoặc đóng gói:
   ```bash
   npm run cap:open:ios
   ```
3. Hoặc biên dịch trực tiếp qua `xcodebuild`:
   ```bash
   xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Debug -destination 'generic/platform=iOS' CODE_SIGNING_ALLOWED=NO build
   ```

---

## Cấu trúc thư mục dự án

```
plants-vs-zombies/
├── android/               # Dự án Android Studio (Capacitor)
├── ios/                   # Dự án Xcode (Capacitor)
├── build-outputs/         # Nơi lưu trữ file APK và bản nén cài đặt
├── public/                # Tài nguyên tĩnh, favicon, PWA manifest, service worker
├── src/
│   ├── js/
│   │   ├── pubg/          # Logic chế độ Battle Royale (điều khiển, nhân vật, vũ khí, kho đồ, HUD)
│   │   ├── config.js      # Cấu hình chỉ số cây và zombie
│   │   ├── sound.js       # Hệ thống âm thanh tổng hợp Web Audio API
│   │   └── main.js        # Khởi chạy ứng dụng
│   └── styles/
│       ├── pubg.css       # Giao diện sàn đấu, joystick, nút bắn, thanh máu sinh tồn
│       ├── lobby.css      # Giao diện trang chủ, sảnh chờ, kho đồ và hướng dẫn
│       ├── responsive.css # Tối ưu hóa hiển thị xoay ngang cho điện thoại và máy tính bảng
│       └── index.css      # Điểm nạp CSS chính
├── capacitor.config.json  # Cấu hình ứng dụng di động Capacitor
├── index.html             # Trang giao diện chính
├── package.json           # Danh sách gói phụ thuộc và câu lệnh build
└── vite.config.js         # Cấu hình đóng gói Vite
```

---

## Tác giả

- **Thanh Đào** - [@ThanhhDaoo](https://github.com/ThanhhDaoo)
- Mọi quyền được bảo lưu (All Rights Reserved).
