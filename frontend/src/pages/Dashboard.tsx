import { Link } from 'react-router-dom';
import { Card } from '../components/Card';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-600">
          Hệ thống tra cứu và thống kê điểm thi 
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Tra cứu điểm" description="Nhập số báo danh 8 chữ số">
          <p className="mb-4 text-sm text-slate-600">
            Xem chi tiết điểm từng môn của thí sinh.
          </p>
          <Link
            to="/search"
            className="inline-flex rounded-lg bg-brand-800 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 mt-[18px]"
          >
            Đi tới tra cứu
          </Link>
        </Card>

        <Card title="Báo cáo phân bố" description="4 mức điểm theo môn">
          <p className="mb-4 text-sm text-slate-600">
            Biểu đồ thống kê ≥8, 6 – Dưới 8, 4 – Dưới 6 và &lt;4 điểm.
          </p>
          <Link
            to="/reports"
            className="inline-flex rounded-lg border border-brand-800 px-4 py-2 text-sm font-medium text-brand-800 hover:bg-brand-50"
          >
            Xem báo cáo
          </Link>
        </Card>

        <Card title="Top khối A" description="Toán · Lý · Hóa">
          <p className="mb-4 text-sm text-slate-600">
            Danh sách 10 thí sinh có tổng điểm khối A cao nhất.
          </p>
          <Link
            to="/reports#top-a"
            className="inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Xem top 10
          </Link>
        </Card>
      </div>
    </div>
  );
}
