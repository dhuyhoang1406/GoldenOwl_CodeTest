# G-Scores Backend (NestJS + TypeORM + PostgreSQL)

API phục vụ bài tập G-Scores: tra cứu điểm, báo cáo phân bố điểm theo môn, top 10 khối A.

## Yêu cầu

- Node.js 20+
- PostgreSQL 14+ (hoặc Docker)

## Cài đặt nhanh

### 1. Database (Docker)

Từ thư mục gốc dự án:

```bash
docker compose up -d
```

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run migration:run   # tùy chọn — migration cũng chạy khi khởi động app
npm run seed            # import CSV (~1M bản ghi, mất vài phút)
npm run start:dev
```

API: `http://localhost:3000/api`

## Biến môi trường (`.env`)

| Biến | Mô tả | Mặc định |
|------|--------|----------|
| `PORT` | Cổng HTTP | `3000` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USERNAME` | User DB | `postgres` |
| `DB_PASSWORD` | Password DB | `postgres` |
| `DB_DATABASE` | Tên database | `gscores` |
| `CSV_FILE_PATH` | Đường dẫn CSV (tùy chọn) | `../dataset/diem_thi_thpt_2024.csv` |
| `SEED_ON_STARTUP` | Tự seed khi bảng trống | `false` |

## Migration & Seeder

- **Migration**: `src/database/migrations/` — tạo bảng `scores`
- **Seeder**: `src/common/seeder/seeder.service.ts` — đọc `dataset/diem_thi_thpt_2024.csv`

```bash
npm run migration:run
npm run seed
```

## API Endpoints

| Method | Path | Mô tả |
|--------|------|--------|
| GET | `/api/health` | Health check |
| GET | `/api/scores/subjects` | Danh sách môn (OOP `Subject`) |
| GET | `/api/scores/lookup/:sbd` | Tra cứu điểm theo SBD (8 chữ số) |
| GET | `/api/scores/report/distribution` | Thống kê 4 mức điểm theo từng môn |
| GET | `/api/scores/report/top-group-a?limit=10` | Top khối A (Toán, Lý, Hóa) |

### Ví dụ

```bash
curl http://localhost:3000/api/scores/lookup/01000001
curl http://localhost:3000/api/scores/report/distribution
curl "http://localhost:3000/api/scores/report/top-group-a?limit=10"
```

### Phân mức điểm (báo cáo)

| Key | Mô tả |
|-----|--------|
| `gte8` | Điểm ≥ 8 |
| `gte6_lt8` | 6 ≤ điểm < 8 |
| `gte4_lt6` | 4 ≤ điểm < 6 |
| `lt4` | Điểm < 4 |

## Kiến trúc

- **OOP môn học**: `Subject` class (`src/module/score/subject.class.ts`)
- **ORM**: TypeORM entity `Score`
- **Validation**: `class-validator` DTOs
- **TypeScript**: toàn bộ source
