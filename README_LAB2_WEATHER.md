# ỨNG DỤNG DỰ BÁO THỜI TIẾT (REACT NATIVE - LAB 2)

Ứng dụng dự báo thời tiết trực quan, hiện đại, tối ưu cho thiết bị di động, tích hợp dữ liệu thời tiết thực tế từ **Open-Meteo REST API** và hệ thống định vị GPS của thiết bị.

---

## 🌟 1. DANH SÁCH TÍNH NĂNG ĐÃ HOÀN THÀNH

### 1. Xem thời tiết hiện tại
- **Địa điểm hiện tại**: Hiển thị tên thành phố/quận huyện, quốc gia, huy hiệu GPS khi dùng định vị, và thời gian cập nhật gần nhất.
- **Nhiệt độ & trạng thái**: Hiển thị nhiệt độ số lớn sắc nét, huy hiệu mô tả thời tiết (*Trời quang đãng, Nắng đẹp, Mưa rào, Nhiều mây...*), biểu tượng thời tiết sinh động.
- **Nhiệt độ cực đại, cực tiểu & cảm nhận**: Hiển thị trực quan thanh tóm tắt gồm Cảm nhận thực tế (*Feels like*), Cao nhất (*Max* ↑) và Thấp nhất (*Min* ↓).

### 2. Xem dự báo theo giờ (24 giờ tiếp theo)
- Hiển thị danh sách cuộn ngang 24 giờ tới.
- Mỗi mốc giờ hiển thị: Giờ (*Bây giờ, 16:00, 17:00...*), Biểu tượng thời tiết, Nhiệt độ và Huy hiệu khả năng mưa (% mưa kèm icon giọt nước 💧).
- Cho phép bấm vào từng giờ để xem chi tiết thông số khí tượng tại thời điểm đó.

### 3. Xem dự báo nhiều ngày (7 ngày)
- Danh sách dự báo 7 ngày liên tiếp (*Hôm nay, Thứ 2 đến Chủ nhật*).
- Hiển thị: Tên thứ, ngày/tháng, icon thời tiết, mô tả trạng thái, khả năng mưa (% mưa).
- **Thanh đo nhiệt độ min-max trực quan**: Hiển thị dải nhiệt độ tương đối trực quan theo từng ngày.
- **Xem chi tiết ngày**: Chạm vào bất kỳ ngày nào để mở Modal chi tiết toàn diện.

### 4. Xem thông tin chi tiết về thời tiết (Day Detail Modal)
- Thời gian Mặt trời mọc (*Sunrise*) và Mặt trời lặn (*Sunset*).
- Xác suất mưa (%) và Tổng lượng mưa tích tụ (*Precipitation sum in mm*).
- Tốc độ gió giật cực đại (*Max wind speed*).
- Chỉ số tia cực tím (*UV Index Max*) kèm phân loại mức độ nguy hại và lời khuyên bảo vệ da.
- Biên độ nhiệt độ cảm nhận (*Apparent temp range*).

### 5. Theo dõi 8 chỉ số thời tiết chi tiết (Visual Metrics Grid)
Hiển thị trực quan dạng lưới Card với icon, giá trị đo và thanh tiến trình/nhãn giải thích:
1. **Nhiệt độ**: Kèm cảm nhận nhiệt độ thực tế.
2. **Độ ẩm (%)**: Kèm thanh đo tiến trình và đánh giá chất lượng không khí.
3. **Tốc độ gió**: Đơn vị km/h hoặc m/s, đánh giá cấp độ gió.
4. **Hướng gió**: La bàn 8 hướng (*Đông Bắc, Tây Nam, Bắc...*) kèm góc độ (°).
5. **Chỉ số UV**: Chỉ số UV thời gian thực, huy hiệu mức nguy cơ (*Thấp, Trung bình, Cao, Rất cao, Cực độ*) và khuyến nghị sức khỏe.
6. **Lượng mưa**: mm lượng mưa thực tế.
7. **Áp suất khí quyển**: hPa kèm nhận định áp cao/áp thấp.
8. **Tầm nhìn xa**: km tầm nhìn quang trắc.

### 6. Sử dụng vị trí hiện tại & GPS
- Xin quyền truy cập vị trí của thiết bị qua Android Runtime Permissions (`ACCESS_FINE_LOCATION`).
- Lấy toạ độ GPS chính xác và dịch ngược địa danh (*Reverse Geocoding*) sang tiếng Việt.
- **Xử lý linh hoạt khi người dùng từ chối quyền**:
  - Hiển thị Banner thông báo thân thiện và nút "Cấp quyền GPS" để người dùng thử lại bất kỳ lúc nào.
  - Tự động fallback lấy vị trí mạng IP hoặc hiển thị thời tiết tại Thủ đô Hà Nội.
  - Cung cấp ô tìm kiếm thành phố bất kỳ trên toàn thế giới và danh sách chọn nhanh các thành phố lớn tại Việt Nam (*Hà Nội, TP.HCM, Đà Nẵng, Cần Thơ, Hải Phòng, Đà Lạt, Nha Trang, Huế...*).

### 7. Giao diện & Trải nghiệm người dùng (UI/UX)
- **Gradient nền thích ứng**: Tự động đổi màu nền theo điều kiện thời tiết thực tế và chu kỳ ngày/đêm (ban ngày trời trong nắng vàng xanh, ban đêm huyền bí, trời mưa xám bạc).
- **Hiệu ứng Glassmorphism**: Thẻ card bo cong mềm mại với độ mờ trong suốt cao cấp.
- **Thanh Navigation 4 Tab**:
  - ☀️ **Dự báo**: Màn hình chính đầy đủ các thông tin.
  - 🔍 **Địa điểm**: Tìm kiếm thành phố trực tiếp qua API Geocoding hoặc chọn nhanh thành phố phổ biến.
  - 📡 **Radar**: Bản đồ radar khí tượng mô phỏng với hiệu ứng quét sóng xoay 360 độ (*Radar Sweep Animation*), chuyển lớp Mưa/Mây/Gió/Nhiệt độ và phân tích vi khí hậu.
  - ⚙️ **Cài đặt**: Chuyển đổi đơn vị nhiệt độ (°C / °F), tốc độ gió (km/h / m/s).
- **Trạng thái**:
  - *Loading Skeleton*: Hiệu ứng nhấp nháy mô phỏng cấu trúc trước khi dữ liệu tải xong.
  - *Error State*: Thông báo lỗi mạng chi tiết với nút "Thử lại ngay".
  - *Pull-to-refresh*: Kéo màn hình từ trên xuống để cập nhật dữ liệu mới nhất tức thì.

---

## 🛠️ 2. KIẾN TRÚC MÃ NGUỒN

```
src/labs/Lab2_Weather/
├── types/
│   └── weather.ts             # Định nghĩa Type/Interface cho dữ liệu khí tượng
├── constants/
│   ├── weatherCodes.ts        # Bảng mã chuẩn WMO (mô tả tiếng Việt, icon, màu gradient)
│   └── defaultCities.ts       # Danh sách các thành phố tại Việt Nam & quốc tế
├── services/
│   ├── weatherApi.ts          # Gọi Open-Meteo REST API (dự báo hiện tại, 24h và 7 ngày)
│   ├── geocodingApi.ts        # API tìm kiếm thành phố & Reverse Geocoding địa danh
│   └── locationService.ts     # Xin quyền Android GPS & xử lý fallback
├── utils/
│   └── formatters.ts          # Hàm tiện ích đổi °C/°F, la bàn gió, cấp độ UV, ngày giờ
├── components/
│   ├── WeatherHeader.tsx      # Header hiển thị địa điểm, GPS badge, nút chức năng
│   ├── CurrentWeatherCard.tsx # Hero Card thời tiết hiện tại
│   ├── HourlyForecastList.tsx # Dự báo 24 giờ dạng danh sách cuộn ngang
│   ├── DailyForecastList.tsx  # Dự báo 7 ngày với thanh đo nhiệt độ trực quan
│   ├── WeatherMetricsGrid.tsx # Lưới 8 chỉ số thời tiết chi tiết
│   ├── DayDetailModal.tsx     # Modal xem chi tiết ngày/giờ
│   ├── SearchLocationsModal.tsx # Modal tìm kiếm & chọn thành phố
│   ├── WeatherRadarScreen.tsx # Màn hình Radar & phân tích khí quyển
│   ├── SettingsModal.tsx      # Modal cài đặt đơn vị đo & thông tin ứng dụng
│   ├── WeatherNavBar.tsx      # Thanh điều hướng tab phía dưới
│   ├── LoadingSkeleton.tsx    # Giao diện Skeleton Loading
│   └── ErrorStateView.tsx     # Giao diện thông báo lỗi kết nối
├── WeatherScreen.tsx          # Màn hình chính điều phối toàn bộ ứng dụng
└── index.ts                   # Export WeatherScreen
```

---

## 🚀 3. HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY ỨNG DỤNG

### Bước 1: Khởi động Metro Bundler
Mở Terminal tại thư mục `d:\app\app`:
```bash
npm start
```

### Bước 2: Khởi động máy ảo Android (Emulator)
Bạn có thể khởi động máy ảo nhanh bằng file script có sẵn:
```bash
cd d:\app
start-emulator.bat
```
Hoặc mở Android Studio -> Virtual Device Manager -> Chạy máy ảo Android.

### Bước 3: Chạy ứng dụng trên Android
Trong một cửa sổ Terminal khác tại `d:\app\app`:
```bash
npm run android
```

---

## 📱 4. XUẤT FILE APK VÀ CÀI ĐẶT

### Lệnh tạo file APK:
Di chuyển vào thư mục `d:\app\app\android`:
```bash
cd d:\app\app\android
gradlew.bat assembleDebug
```
File APK sẽ được tạo tại đường dẫn:
```
d:\app\app\android\app\build\outputs\apk\debug\app-debug.apk
```

### Cài đặt file APK vào máy thật hoặc máy ảo:
1. Kết nối điện thoại Android qua cáp USB và bật "USB Debugging".
2. Chạy lệnh:
```bash
adb install -r d:\app\app\android\app\build\outputs\apk\debug\app-debug.apk
```

---

## 🎬 5. GỢI Ý KỊCH BẢN QUAY VIDEO DEMO NỘP BÀI (1 - 2 PHÚT)

1. **Mở ứng dụng (0:00 - 0:15)**:
   - Thấy hộp thoại xin quyền GPS thiết bị -> Bấm "Cho phép".
   - Ứng dụng tự động lấy toạ độ và tải thời tiết tại địa điểm thực tế với hiệu ứng Loading Skeleton mượt mà.
2. **Xem thời tiết hiện tại & 8 chỉ số (0:15 - 0:40)**:
   - Chỉ vào Thẻ thời tiết hiện tại: Nhiệt độ, trạng thái, nhiệt độ cảm nhận, cao nhất / thấp nhất.
   - Kéo xem cuộn ngang 24 giờ tiếp theo: hiển thị nhiệt độ, icon và xác suất mưa.
   - Xem lưới 8 chỉ số thời tiết chi tiết: Độ ẩm, Gió, Hướng gió la bàn, Chỉ số UV, Lượng mưa, Áp suất, Tầm nhìn.
3. **Dự báo 7 ngày & Chi tiết ngày (0:40 - 1:05)**:
   - Cuộn xem bảng dự báo 7 ngày với thanh đo nhiệt độ trực quan.
   - Nhấn vào một ngày bất kỳ (ví dụ: ngày mai) -> Modal chi tiết bật lên hiển thị giờ bình minh/hoàng hôn, lượng mưa mm, gió giật, mức độ tia UV.
4. **Tìm kiếm địa điểm & Chuyển thành phố (1:05 - 1:25)**:
   - Nhấn vào biểu tượng kính lúp hoặc Tab "Địa điểm".
   - Gõ tìm kiếm thành phố (ví dụ: *Đà Nẵng* hoặc *Tokyo*), chọn thành phố để cập nhật thời tiết tức thì.
5. **Màn hình Radar & Cài đặt (1:25 - 1:45)**:
   - Chuyển sang Tab "Radar": Trải nghiệm hiệu ứng radar quét xoay tròn 360 độ sinh động, chuyển các lớp Mưa/Mây/Gió.
   - Chuyển sang Tab "Cài đặt": Bật đổi từ độ C (°C) sang độ F (°F) -> Quay lại màn hình chính kiểm tra các số đo đã được chuyển đổi hoàn hảo.
