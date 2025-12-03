import React, { useState, useEffect } from 'react';
import {
    Search,
    Download,
    Calendar,
    TrendingUp,
    MapPin,
    Users,
    DollarSign,
    FileText,
} from 'lucide-react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';

// ─────────────────────────────────────────────────────────────────────────────
// Axios + Token (jwtToken từ cả 2 storage) – ĐÃ ĐÚNG NHƯ MÀY ĐƯA
// ─────────────────────────────────────────────────────────────────────────────
const API_BASE_URL = 'http://localhost:8080/api';

const TOKEN = () => sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken');

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});

api.interceptors.request.use(config => {
    const token = TOKEN();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            localStorage.removeItem('jwtToken');
            sessionStorage.removeItem('jwtToken');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// Types + Dữ liệu mẫu (giữ nguyên đẹp như bản gốc)
// ─────────────────────────────────────────────────────────────────────────────
interface DashboardStats {
    totalUsers: number;
    totalCustomers: number;
    totalStaff: number;
    totalAdmins: number;
    totalInactive: number;
    newUsersToday: number;
    totalDeleted: number;
}

const tourByMonth = [
    { month: 'Th1', tours: 12 },
    { month: 'Th2', tours: 19 },
    { month: 'Th3', tours: 15 },
    { month: 'Th4', tours: 28 },
    { month: 'Th5', tours: 32 },
    { month: 'Th6', tours: 45 },
    { month: 'Th7', tours: 58 },
    { month: 'Th8', tours: 61 },
    { month: 'Th9', tours: 42 },
    { month: 'Th10', tours: 35 },
    { month: 'Th11', tours: 28 },
    { month: 'Th12', tours: 40 },
];

const bookingByMonth = [
    { month: 'Th1', bookings: 89 },
    { month: 'Th2', bookings: 156 },
    { month: 'Th3', bookings: 198 },
    { month: 'Th4', bookings: 312 },
    { month: 'Th5', bookings: 428 },
    { month: 'Th6', bookings: 589 },
    { month: 'Th7', bookings: 756 },
    { month: 'Th8', bookings: 812 },
    { month: 'Th9', bookings: 634 },
    { month: 'Th10', bookings: 512 },
    { month: 'Th11', bookings: 398 },
    { month: 'Th12', bookings: 720 },
];

const regionData = [
    { name: 'Miền Bắc', value: 38, color: '#3b82f6' },
    { name: 'Miền Trung', value: 18, color: '#f59e0b' },
    { name: 'Miền Nam', value: 12, color: '#10b981' },
];

const topTours = [
    { id: 1, name: 'Hạ Long - Vịnh Hạ Long 2N1Đ', bookings: 892, revenue: '2.1 tỷ' },
    { id: 2, name: 'Phú Quốc - Paradise Island 4N3Đ', bookings: 756, revenue: '1.8 tỷ' },
    { id: 3, name: 'Sapa - Fansipan Legend 3N2Đ', bookings: 681, revenue: '1.4 tỷ' },
    { id: 4, name: 'Đà Nẵng - Hội An - Bà Nà 4N3Đ', bookings: 592, revenue: '1.2 tỷ' },
    { id: 5, name: 'Ninh Bình - Tràng An - Bái Đính', bookings: 489, revenue: '980 triệu' },
];

const recentBookings = [
    { id: 'DH240589', customer: 'Nguyễn Văn An', tour: 'Hạ Long 2N1Đ', date: '25/11/2025', status: 'Đã xác nhận', color: 'text-green-600 bg-green-100' },
    { id: 'DH240588', customer: 'Trần Thị Mai', tour: 'Phú Quốc 4N3Đ', date: '25/11/2025', status: 'Chờ thanh toán', color: 'text-yellow-600 bg-yellow-100' },
    { id: 'DH240587', customer: 'Lê Minh Tuấn', tour: 'Sapa 3N2Đ', date: '24/11/2025', status: 'Đã thanh toán', color: 'text-blue-600 bg-blue-100' },
    { id: 'DH240586', customer: 'Phạm Hồng Nhung', tour: 'Đà Nẵng 4N3Đ', date: '24/11/2025', status: 'Đã hủy', color: 'text-red-600 bg-red-100' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component chính
// ─────────────────────────────────────────────────────────────────────────────
const Dashboard: React.FC = () => {
    const { theme } = useTheme();

    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [chartData7Days, setChartData7Days] = useState<{ date: string; count: number }[]>([]);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingChart, setLoadingChart] = useState(true);

    // Load stats
    useEffect(() => {
        api.get<DashboardStats>('/admin/dashboard/stats')
            .then(res => {
                setStats(res.data);
                setLoadingStats(false);
            })
            .catch(() => setLoadingStats(false));
    }, []);

    // Load chart 7 ngày (người dùng đăng ký)
    useEffect(() => {
        api.get<any[][]>('/admin/dashboard/chart/last-7-days')
            .then(res => {
                const formatted = res.data.map((item: any[]) => {
                    const rawDate = item[0];
                    let label = '';
                    if (typeof rawDate === 'string') {
                        const d = new Date(rawDate);
                        const today = new Date();
                        const yesterday = new Date(today);
                        yesterday.setDate(yesterday.getDate() - 1);
                        label = d.toDateString() === today.toDateString() ? 'Hôm nay'
                            : d.toDateString() === yesterday.toDateString() ? 'Hôm qua'
                                : d.toLocaleDateString('vi-VN');
                    } else {
                        label = rawDate;
                    }
                    return { date: label, count: Number(item[1]) };
                }).reverse();
                setChartData7Days(formatted);
                setLoadingChart(false);
            })
            .catch(() => setLoadingChart(false));
    }, []);

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition">
                            <Download size={16} />
                            Xuất báo cáo
                        </button>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm tour, khách hàng..."
                                className={`pl-10 pr-4 py-2.5 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} focus:outline-none focus:border-blue-500 w-80`}
                            />
                            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    {[
                        { label: 'Tổng số tour', value: '152', icon: MapPin, bg: 'bg-blue-600', change: '+12%', changeColor: 'bg-green-500' },
                        { label: 'Điểm đến', value: '68', icon: MapPin, bg: 'bg-emerald-600', change: '+8', changeColor: 'bg-green-500' },
                        { label: 'Lượt đặt tour (2025)', value: '4,325', icon: Calendar, bg: 'bg-purple-600', change: '+28%', changeColor: 'bg-green-500' },
                        { label: 'Tổng doanh thu', value: '3.2 tỷ', icon: DollarSign, bg: 'bg-orange-600', change: '+42%', changeColor: 'bg-green-500' },
                        {
                            label: 'Tài khoản người dùng',
                            value: loadingStats ? '...' : (stats?.totalUsers || 0).toLocaleString('vi-VN'),
                            icon: Users,
                            bg: 'bg-indigo-600',
                            change: stats?.newUsersToday ? `+${stats.newUsersToday}` : '0',
                            changeColor: stats?.newUsersToday ? 'bg-green-500' : 'bg-gray-500'
                        },
                    ].map((item, idx) => (
                        <div key={idx} className={`${item.bg} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group`}>
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <item.icon size={32} className="opacity-90" />
                                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${item.changeColor} text-white shadow`}>
                                        {item.change}
                                    </span>
                                </div>
                                <p className="text-3xl font-bold mb-1">{item.value}</p>
                                <p className="text-sm opacity-95">{item.label}</p>
                            </div>
                            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white rounded-full opacity-10"></div>
                        </div>
                    ))}
                </div>

                {/* Phân loại tài khoản */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                        { label: 'Khách hàng', value: stats?.totalCustomers, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
                        { label: 'Nhân viên', value: stats?.totalStaff, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
                        { label: 'Admin', value: stats?.totalAdmins, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
                    ].map((item) => (
                        <div key={item.label} className={`px-8 py-5 rounded-2xl ${item.bg} border border-gray-200 dark:border-gray-700 min-w-[180px] text-center`}>
                            <p className="text-3xl font-bold">{loadingStats ? '...' : (item.value || 0).toLocaleString('vi-VN')}</p>
                            <p className={`text-sm font-medium mt-1 ${item.color}`}>{item.label}</p>
                        </div>
                    ))}
                </div>

                {/* 2 biểu đồ: Tour theo tháng + Đặt tour theo tháng (bản gốc) + 7 ngày thật */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Tour tạo theo tháng */}
                    <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                        <h3 className="text-lg font-semibold mb-4">Số tour được tạo theo tháng</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={tourByMonth}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                                <XAxis dataKey="month" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                                <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', border: 'none', borderRadius: '8px' }} />
                                <Bar dataKey="tours" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* ĐẶT TOUR THEO THÁNG – BẢN GỐC ĐÃ ĐƯỢC THÊM LẠI */}
                    <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                        <h3 className="text-lg font-semibold mb-4">Lượt đặt tour theo tháng (2025)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={bookingByMonth}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                                <XAxis dataKey="month" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                                <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', border: 'none', borderRadius: '8px' }} />
                                <Line type="monotone" dataKey="bookings" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 6 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Biểu đồ 7 ngày gần nhất (dữ liệu thật) */}
                <div className={`rounded-2xl p-6 mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className="text-lg font-semibold mb-4">Người dùng đăng ký 7 ngày gần nhất</h3>
                    {loadingChart ? (
                        <div className="h-72 flex items-center justify-center text-gray-500">Đang tải...</div>
                    ) : chartData7Days.length === 0 ? (
                        <div className="h-72 flex items-center justify-center text-gray-500">Chưa có dữ liệu</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData7Days}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                                <XAxis dataKey="date" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                                <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                                <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', border: 'none', borderRadius: '8px' }} />
                                <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 6 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Pie + Top 5 + Recent Bookings – giữ nguyên đẹp */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className={`lg:col-span-4 rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                        <h3 className="text-lg font-semibold mb-6">Phân bố điểm đến theo khu vực</h3>
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie data={regionData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                                    {regionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-4 space-y-3">
                            {regionData.map((item) => (
                                <div key={item.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-sm">{item.name}</span>
                                    </div>
                                    <span className="font-semibold">{item.value} điểm</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`lg:col-span-8 rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <TrendingUp size={20} className="text-green-500" />
                                    Top 5 tour được đặt nhiều nhất
                                </h3>
                                <div className="space-y-3">
                                    {topTours.map((tour, idx) => (
                                        <div key={tour.id} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} flex items-center justify-between`}>
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl font-bold text-gray-400">#{idx + 1}</span>
                                                <div>
                                                    <p className="font-medium">{tour.name}</p>
                                                    <p className="text-sm text-gray-500">{tour.bookings} lượt đặt</p>
                                                </div>
                                            </div>
                                            <span className="font-bold text-green-600">{tour.revenue}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <MapPin size={20} className="text-orange-500" />
                                    Top 5 điểm đến nổi bật
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { rank: 1, name: 'Vịnh Hạ Long', province: 'Quảng Ninh', views: '182.4K', tours: 42 },
                                        { rank: 2, name: 'Phú Quốc', province: 'Kiên Giang', views: '156.8K', tours: 38 },
                                        { rank: 3, name: 'Sapa', province: 'Lào Cai', views: '142.3K', tours: 35 },
                                        { rank: 4, name: 'Đà Nẵng', province: 'Đà Nẵng', views: '138.7K', tours: 41 },
                                        { rank: 5, name: 'Hội An', province: 'Quảng Nam', views: '119.5K', tours: 28 },
                                    ].map((dest) => (
                                        <div key={dest.rank} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} flex items-center justify-between`}>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 text-white font-bold text-lg">
                                                    {dest.rank}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-base">{dest.name}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{dest.province}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">{dest.views} lượt xem</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{dest.tours} tour</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bảng đơn đặt tour gần nhất */}
                <div className={`mt-8 rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
                        <FileText size={20} className="text-blue-500" />
                        Đơn đặt tour gần nhất
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Mã đơn</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Khách hàng</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Tour</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Ngày đặt</th>
                                    <th className="text-center py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentBookings.map((booking) => (
                                    <tr key={booking.id} className={`border-b ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'} transition`}>
                                        <td className="py-4 px-4 font-mono font-semibold text-blue-600">#{booking.id}</td>
                                        <td className="py-4 px-4 font-medium">{booking.customer}</td>
                                        <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{booking.tour}</td>
                                        <td className="py-4 px-4 text-gray-500">{booking.date}</td>
                                        <td className="py-4 px-4 text-center">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${booking.color}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;