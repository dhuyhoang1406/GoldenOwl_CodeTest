# G-Scores

Ứng dụng web tra cứu và thống kê điểm thi THPT 2024 (~1 triệu bản ghi).

## Demo

| | URL |
|---|-----|
| **Website** | https://g-score-frontend-alpha.vercel.app/ |
| **API** | https://g-scores-backend-i0hr.onrender.com/api/health |

---

## Công nghệ

- **Frontend:** React (Hooks), TypeScript, Vite, Tailwind CSS, Recharts
- **Backend:** NestJS, TypeORM, class-validator, csv-parse
- **Database:** PostgreSQL
- **Deploy:** Supabase · Render · Vercel
- **Local DB:** Docker Compose

---

## Quyết định kỹ thuật

### Stack ứng dụng

| Thành phần | Lựa chọn | Lý do |
|------------|----------|--------|
| Frontend | React + TypeScript + Vite | Hệ sinh thái quen thuộc, build nhanh, type-safe giúp giảm lỗi khi map dữ liệu API |
| UI | Tailwind CSS | Styling nhanh, giao diện nhất quán mà không cần file CSS riêng cho từng màn |
| Biểu đồ | Recharts | Đủ cho báo cáo phân bố 4 mức điểm, tích hợp tốt với React |
| Backend | NestJS | Cấu trúc module rõ ràng, DI, ValidationPipe — phù hợp API có nhiều endpoint báo cáo |
| ORM | TypeORM | Migration version-controlled, tương thích PostgreSQL và NestJS |
| Validation | class-validator | Validate SBD (8 chữ số) ngay tại DTO, trả lỗi chuẩn trước khi vào service |
| Import CSV | csv-parse + stream | Đọc file ~1 triệu dòng theo stream, insert theo batch — tránh load hết vào RAM |
| Database | PostgreSQL | Xử lý tốt dataset lớn; dùng `COUNT(*) FILTER` cho thống kê phân bố theo môn |
| Local dev | Docker Compose | Chạy PostgreSQL local không phụ thuộc cloud, đồng bộ với môi trường production |

**OOP — class `Subject`:** gom metadata môn học (key, label, nhóm) và logic đọc điểm từ bản ghi; controller/service dùng chung một nguồn thay vì hard-code tên cột.

**Seeder:** batch insert (mặc định 500 dòng/lần) kèm `orIgnore` — seed idempotent, chạy lại an toàn nếu bị ngắt giữa chừng.

### DevOps & deploy

| Thành phần | Nền tảng | Lý do |
|------------|----------|--------|
| Frontend | Vercel | Liên kết GitHub, auto-deploy mỗi lần push — phù hợp SPA React/Vite |
| Backend | Render | Liên kết GitHub, build NestJS tự động, free tier đủ cho demo |
| Database | Supabase | PostgreSQL managed, free tier, pooler sẵn cho kết nối từ Render |

**Vấn đề Render free tier:** instance tự sleep sau ~15 phút không có request → lần gọi API đầu tiên (cold start) có thể mất 30–60 giây, frontend báo lỗi hoặc treo loading nếu reviewer mở demo sau thời gian idle.

**Giải pháp:** dùng [UptimeRobot](https://uptimerobot.com/) ping định kỳ endpoint `/api/health` (~5 phút/lần) để giữ backend wake — đảm bảo frontend luôn nhận response khi demo, không cần nâng cấp gói trả phí.

> **Trade-off:** UptimeRobot phù hợp demo/submission; production thật nên cân nhắc paid tier, cache, hoặc serverless thay vì giữ instance free tier luôn chạy.

---

## Tính năng

- **Dashboard** — tổng quan, điều hướng nhanh
- **Tra cứu điểm** — nhập số báo danh (8 chữ số), xem điểm 9 môn và mã ngoại ngữ
- **Báo cáo phân bố** — biểu đồ số thí sinh theo 4 mức điểm từng môn (≥8 · 6–8 · 4–6 · &lt;4)
- **Top 10 khối A** — xếp hạng theo tổng Toán + Vật lí + Hóa học
- **Import dữ liệu** — migration tạo bảng, seeder đọc CSV `dataset/diem_thi_thpt_2024.csv`
- **Quản lý môn học (OOP)** — class `Subject` trên backend

---

## Chạy local

### Yêu cầu

- Node.js 20+
- PostgreSQL (Docker hoặc Supabase)

### 1. Database

```bash
docker compose up -d
```

Hoặc dùng Supabase — cấu hình trong `backend/.env`.

### 2. Backend

```bash
cd backend
copy .env.example .env
npm install
npm run seed
npm run start:dev
```

API: `http://localhost:3000/api`

Lần đầu seed ~1.061.605 dòng, mất vài chục phút. Chạy lại `npm run seed` nếu bị ngắt — bỏ qua SBD đã import.

### 3. Frontend

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Web: `http://localhost:5173` (proxy `/api` → backend)

---

## Deploy

| Thành phần | Nền tảng |
|------------|----------|
| Database | Supabase |
| Backend | Render |
| Frontend | Vercel |

**Render:** `npm install && npm run build` · Start: `npm run start:prod` · Env DB giống `backend/.env` (pooler: `postgres.<project-ref>`, port `6543`).

**Vercel:**

```env
VITE_API_URL=https://<app-render>.onrender.com/api
```

Cần hậu tố `/api`. Redeploy sau khi đổi biến.

**Seed lên Supabase** (từ máy local, `.env` trỏ cloud):

```bash
cd backend
npm run seed
```

---

## API

| Method | Path | Mô tả |
|--------|------|--------|
| GET | `/api/health` | Health check |
| GET | `/api/scores/subjects` | Danh sách môn |
| GET | `/api/scores/lookup/:sbd` | Tra cứu theo SBD |
| GET | `/api/scores/report/distribution` | Phân bố điểm theo môn |
| GET | `/api/scores/report/top-group-a?limit=10` | Top khối A |

Mức điểm báo cáo: `gte8` (≥8) · `gte6_lt8` (6–8) · `gte4_lt6` (4–6) · `lt4` (&lt;4).

```bash
curl http://localhost:3000/api/scores/lookup/01000001
curl http://localhost:3000/api/scores/report/distribution
```

---

## Biến môi trường

**Backend** — `backend/.env` (mẫu: `.env.example`)

| Biến | Mô tả |
|------|--------|
| `PORT` | Cổng HTTP (3000) |
| `DB_HOST` | Host PostgreSQL |
| `DB_PORT` | 5432 local / 6543 Supabase pooler |
| `DB_USERNAME` | `postgres` / `postgres.<project-ref>` |
| `DB_PASSWORD` | Mật khẩu DB |
| `DB_DATABASE` | `gscores` / `postgres` |
| `CSV_FILE_PATH` | Đường dẫn CSV (tùy chọn) |
| `SEED_ON_STARTUP` | Tự seed khi bảng trống |
| `SEED_BATCH_SIZE` | Batch insert (mặc định 500) |

**Frontend** — `frontend/.env`

| Biến | Mô tả |
|------|--------|
| `VITE_API_URL` | Base API (`http://localhost:3000/api` hoặc URL Render + `/api`) |

---

## Cấu trúc project

```
├── backend/                 # NestJS
│   └── src/
│       ├── database/migrations/
│       ├── common/seeder/
│       └── module/score/
├── frontend/                # React + Vite
├── dataset/diem_thi_thpt_2024.csv
└── docker-compose.yml
```

---

## Scripts

| Lệnh | Thư mục |
|------|---------|
| `npm run start:dev` | backend |
| `npm run start:prod` | backend |
| `npm run seed` | backend |
| `npm run migration:run` | backend |
| `npm run dev` | frontend |
| `npm run build` | frontend |
