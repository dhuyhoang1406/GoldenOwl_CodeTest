# G-Scores Frontend

React (Hooks) + TypeScript + Vite + Tailwind CSS. Font **Rubik** (Google Fonts).

## Chạy local

```bash
npm install
npm run dev
```

Backend phải chạy tại `http://localhost:3000` (xem `backend/README.md`).

## Cấu hình

| Biến | Mô tả | Mặc định |
|------|--------|----------|
| `VITE_API_URL` | Base URL API | `/api` (proxy Vite dev) |

## Tính năng

- **Dashboard** — tổng quan, điều hướng nhanh
- **Tra cứu điểm** — nhập SBD 8 chữ số, hiển thị bảng điểm
- **Báo cáo** — biểu đồ stacked bar 4 mức điểm theo môn + bảng Top 10 khối A

## Build production

```bash
npm run build
npm run preview
```

Đặt `VITE_API_URL` trỏ tới API production khi deploy.
