# TravelDaLat

Cẩm nang du lịch Đà Lạt do Phan Văn Thành phát triển.

## Tính năng

- Khám phá địa điểm và Google Maps
- Thời tiết hiện tại và dự báo 5 ngày
- Gợi ý món ăn, quán cà phê và homestay
- Tạo và lưu lịch trình cá nhân
- Trợ lý du lịch Mây

## Chạy dự án

```bash
npm install
npm run dev
```

## Công nghệ

React, TypeScript, Vite, Tailwind CSS và Supabase.

## Tác giả

Phan Văn Thành — [GitHub](https://github.com/thanhphan-code)

## Lịch trình và nguồn dữ liệu

- `src/lib/tripPlanner.ts`: bộ xếp lịch tại client, không phụ thuộc API AI để tính giờ. Điểm đến không trùng trong chuyến đi; kiểm tra cửa sổ tham quan, khoảng nghỉ và giờ về. Chỉnh sửa không khả thi bị từ chối và giữ nguyên bản trước.
- `src/lib/itinerary.ts`: schema phiên bản 2 (`stops`) đồng thời giữ các trường sáng/chiều/tối để đọc lịch cũ.
- `src/data/planning.ts`: thời lượng gợi ý, cửa sổ lập lịch và nguồn đánh giá/giờ mở cửa. Cửa sổ không có nguồn không được xem là giờ kinh doanh đã xác minh.
- Tọa độ và khoảng cách chỉ hỗ trợ ước tính: khoảng cách đường chim bay × 1,45, tốc độ giả định theo phương tiện, cộng đệm 10 phút. Chưa tích hợp định tuyến đường bộ, giao thông trực tiếp, lịch nghỉ lễ hay điểm xuất phát là khách sạn.
- `src/data/photoCredits.json`: ảnh chụp Wikimedia Commons cùng tác giả, giấy phép, ngày chụp và nguồn. Trang `/sources` công khai thông tin này. Ảnh món ăn chỉ minh họa loại món, không chứng thực ảnh tại quán. Không dùng ảnh AI hay ảnh sai địa điểm thay thế ảnh còn thiếu.
- Đánh giá có nguồn hiện gồm ga Đà Lạt (Trip.com) và Túi Mơ To (Tripadvisor), chụp dữ liệu ngày 21/11/2026; không cập nhật trực tiếp. Chưa có video TikTok được xác minh.
- Thông tin/ảnh homestay có sẵn vẫn giữ nguồn cũ; chưa được tái xác minh toàn bộ trong đợt này.

### Kiểm tra (PowerShell, tại thư mục dự án)

```powershell
npm test
npx tsc --noEmit -p tsconfig.app.json
npm run lint
npm run build
```

Kiểm tra thủ công: tạo lịch 1–4 ngày, chọn điểm ban ngày và chợ đêm, thêm/xóa/đổi thứ tự điểm, thử vượt giờ, lưu hai lần, mở chuyến đã lưu, chia sẻ và in. Kiểm tra trên màn hình hẹp và bật chế độ giảm chuyển động của hệ điều hành.

## Khôi phục chat khi project Supabase cũ đã bị xóa

Clone repository không khôi phục hạ tầng cloud. Tạo một project Supabase mới; chưa cần tạo bảng vì lịch trình đang lưu trong localStorage.

1. Trong Supabase Dashboard, lấy Project URL, Project ID và **publishable key** của project mới, rồi sửa ba biến trong `.env` theo `.env.example`. Không dùng secret key hoặc service_role key ở frontend.
2. Trong **Edge Functions → Secrets**, thêm `GEMINI_API_KEY` lấy từ Google AI Studio. Khóa này chỉ ở server. Có thể thêm `GEMINI_MODEL` để chọn model hỗ trợ `generateContent` và structured JSON; mặc định hiện dùng `gemini-2.5-flash`, cần kiểm tra model còn khả dụng với tài khoản.
3. Thêm secret `ALLOWED_ORIGINS` là các origin được phép, phân cách bằng dấu phẩy. Khi chạy local dùng `http://localhost:8080,http://127.0.0.1:8080`. Khi đưa web lên mạng, thêm origin HTTPS chính xác của web (không có dấu `/` cuối).
4. Chạy các lệnh sau bằng **PowerShell tại `C:\Project\DaLatTravel`**. Nhập Project ID mới khi được hỏi:

```powershell
npx supabase login
$dalatProjectRef = Read-Host "Project ID Supabase mới"
npx supabase functions deploy travel-chat --project-ref $dalatProjectRef
```

`login` đăng nhập CLI vào tài khoản; `functions deploy` triển khai function và file handler đi kèm lên project được chỉ định. Không cần chạy `db push`, không cần Docker cho triển khai từ xa. Cấu hình `verify_jwt = false` đã có trong `supabase/config.toml` vì chat hiện dành cho khách chưa đăng nhập; publishable key không phải cơ chế xác thực người dùng.

5. Khởi động lại Vite sau khi sửa `.env` (`Ctrl+C` tại terminal đang chạy, rồi `npm run dev`). Mở `http://127.0.0.1:8080`.
6. Thử hỏi một câu kiến thức chung, hỏi quán ăn, hỏi tiếp “còn quán khác không”, và bấm các link chi tiết/Google Maps. Khi AI lỗi, giao diện phải báo đang dùng dữ liệu website, không giả vờ đó là phản hồi AI.

### Các file của luồng chat

```text
src/components/TravelChat.tsx                 giao diện, trạng thái, thử lại
src/lib/travelChat.ts                         dữ liệu gợi ý, chống lặp, gọi API
src/pages/Food.tsx                            mở đúng món/quán qua ?item=
supabase/functions/travel-chat/index.ts       điểm vào Edge Function
supabase/functions/travel-chat/handler.ts     validation, Gemini, lọc ID, CORS
src/test/chat-handler.test.ts                 kiểm thử server với AI giả lập
src/test/chat-recommendations.test.ts         kiểm thử link và chống lặp
src/test/travel-chat.test.tsx                 kiểm thử thao tác giao diện
```

AI nhận tối đa 16 tin nhắn gần nhất và danh mục rút gọn; gợi ý đã xuất hiện được loại bỏ trừ khi hỏi rõ lại tên. Link được tạo từ dữ liệu website, không dùng URL do AI tự sinh. Hội thoại chỉ giữ trong bộ nhớ của tab, được gửi tới Supabase/Gemini khi đặt câu hỏi; nút “Cuộc trò chuyện mới” xóa ngữ cảnh hiện tại. AI chưa tra cứu web hoặc thời tiết trực tiếp, nên không bảo đảm thông tin mới nhất hay mọi câu trả lời đều đúng.

Handler giới hạn kích thước request, thời gian chờ và số lượt theo IP trong từng instance. Đây chỉ là giới hạn tạm thời; CORS và publishable key không ngăn được gọi API ngoài trình duyệt. Trước khi mở rộng sử dụng công khai, cần giới hạn dùng chung (database/Redis), xác thực hoặc CAPTCHA phù hợp, và theo dõi hạn mức Gemini.

### Bản đồ

Bản đồ dùng CARTO làm nguồn đầu, OpenStreetMap dự phòng, chuyển nguồn khi không tải được và giữ nút mở Google Maps. Có attribution cho cả hai nguồn; vẫn cần mạng truy cập được ít nhất một nguồn tile. Trước khi triển khai thương mại, kiểm tra điều kiện và hạn mức nhà cung cấp.

Tài liệu: [Supabase deploy](https://supabase.com/docs/guides/functions/deploy), [Supabase secrets](https://supabase.com/docs/guides/functions/secrets), [Gemini structured outputs](https://ai.google.dev/gemini-api/docs/structured-output), [CARTO basemaps](https://www.carto.com/basemaps/).
