import React, { useState, useEffect } from 'react';
import {
    Search,
    Download,
    Calendar,
    TrendingUp,
    MapPin,
    Users,

    FileText,
    DollarSign,
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
    LabelList,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';

// ─────────────────────────────────────────────────────────────────────────────
// Axios + Token (chuẩn như mày đã setup)
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
// Types (đúng với backend)
// ─────────────────────────────────────────────────────────────────────────────
interface DashboardStats {
    totalUsers: number;
    totalCustomers: number;
    totalStaff: number;
    totalAdmins: number;
    totalInactive: number;
    newUsersToday: number;
    totalDeleted: number;

    totalTours: number;
    activeTours: number;
    totalConfirmedBookings: number;
    totalViews: number;
    totalReviews: number;
    topPopularTours: PopularTour[];
    top5BookedTours: TopBookedTour[];
    destinationStatsByRegion: [string, number][];  // [Region, count]
    top5PopularDestinations: PopularDestination[];
    latestBookings: LatestBookingDTO[];
    actualRevenue: number;
    expectedRevenue: number;

}

interface PopularTour {
    tourId: number;
    tourName: string;
    imageUrl: string;
    destinationName: string;
    views: number;
    bookingsCount: number;
    reviewsCount: number;
    averageRating: number;
}

interface TopBookedTour {
    tourId: number;
    tourName: string;
    imageUrl: string;
    destinationName: string;
    bookingCount: number;
}

interface PopularDestination {
    destinationId: number;
    destinationName: string;
    imageUrl: string;
    region: 'NORTH' | 'CENTRAL' | 'SOUTH';
    tourCount: number;
    totalViews: number;
    bookingCount: number;
}

interface LatestBookingDTO {
    bookingId: string;
    customerName: string;
    customerPhone: string;
    customerAvatarUrl: string;
    tourName: string;
    bookingDate: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCEL_REQUEST' | 'CANCELLED' | 'REJECTED' | 'COMPLETED';
    totalPrice: number;
}

// Dữ liệu giả (giữ nguyên như yêu cầu)
const tourByMonth = [
    { month: 'Th1', tours: 12 }, { month: 'Th2', tours: 19 }, { month: 'Th3', tours: 15 },
    { month: 'Th4', tours: 28 }, { month: 'Th5', tours: 32 }, { month: 'Th6', tours: 45 },
    { month: 'Th7', tours: 58 }, { month: 'Th8', tours: 61 }, { month: 'Th9', tours: 42 },
    { month: 'Th10', tours: 35 }, { month: 'Th11', tours: 28 }, { month: 'Th12', tours: 40 },
];

const bookingByMonth = [
    { month: 'Th1', bookings: 89 }, { month: 'Th2', bookings: 156 }, { month: 'Th3', bookings: 198 },
    { month: 'Th4', bookings: 312 }, { month: 'Th5', bookings: 428 }, { month: 'Th6', bookings: 589 },
    { month: 'Th7', bookings: 756 }, { month: 'Th8', bookings: 812 }, { month: 'Th9', bookings: 634 },
    { month: 'Th10', bookings: 512 }, { month: 'Th11', bookings: 398 }, { month: 'Th12', bookings: 720 },
];

const handleExportExcel = async () => {
    try {
        const response = await api.get('/admin/dashboard/export/excel', {
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Bao_cao_Dashboard_${new Date().toLocaleDateString('vi-VN')}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (err) {
        console.error('Lỗi xuất Excel:', err);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Component chính
// ─────────────────────────────────────────────────────────────────────────────
const Dashboard: React.FC = () => {
    const { theme } = useTheme();

    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [registrationChart, setRegistrationChart] = useState<{ date: string; count: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [statsRes, chartRes] = await Promise.all([
                    api.get<DashboardStats>('/admin/dashboard/stats/full'),
                    api.get<any[][]>('/admin/dashboard/chart/last-7-days')
                ]);

                setStats(statsRes.data);

                const formattedChart = chartRes.data.map((item: any[]) => {
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
                        label = String(rawDate);
                    }
                    return { date: label, count: Number(item[1]) };
                }).reverse();

                setRegistrationChart(formattedChart);
            } catch (err) {
                console.error('Lỗi tải dashboard:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-2xl text-gray-600 dark:text-gray-300">Đang tải dashboard...</div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-red-600 text-xl">Không thể tải dữ liệu dashboard</div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Dashboard Quản trị</h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleExportExcel}
                            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <Download size={24} />
                            Xuất báo cáo Excel
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

                {/* KPIs – DỮ LIỆU THẬT */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    {[
                        { label: 'Tổng tour', value: stats.totalTours.toLocaleString('vi-VN'), icon: MapPin, bg: 'bg-blue-600' },
                        { label: 'Tour hoạt động', value: stats.activeTours.toLocaleString('vi-VN'), icon: MapPin, bg: 'bg-emerald-600' },
                        { label: 'Tổng lượt đặt', value: stats.totalConfirmedBookings.toLocaleString('vi-VN'), icon: Calendar, bg: 'bg-purple-600' },
                        {
                            label: 'Tổng Doanh thu ',
                            value: stats.actualRevenue
                                ? Number(stats.actualRevenue).toLocaleString('vi-VN') + '₫'
                                : '0₫',
                            icon: DollarSign,
                            bg: 'bg-green-600',
                            change: '+38%',
                            changeColor: 'bg-green-500'
                        },
                        { label: 'Tổng người dùng', value: stats.totalUsers.toLocaleString('vi-VN'), icon: Users, bg: 'bg-indigo-600', change: `+${stats.newUsersToday}` },
                    ].map((item, idx) => (
                        <div key={idx} className={`${item.bg} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group`}>
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <item.icon size={32} className="opacity-90" />
                                    {item.change && (
                                        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-green-500 text-white shadow">
                                            {item.change}
                                        </span>
                                    )}
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
                        { label: 'Khách hàng', value: stats.totalCustomers, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
                        { label: 'Nhân viên', value: stats.totalStaff, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
                        { label: 'Admin', value: stats.totalAdmins, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
                    ].map((item) => (
                        <div key={item.label} className={`px-8 py-5 rounded-2xl ${item.bg} border border-gray-200 dark:border-gray-700 text-center`}>
                            <p className="text-3xl font-bold">{item.value.toLocaleString('vi-VN')}</p>
                            <p className={`text-sm font-medium mt-1 ${item.color}`}>{item.label}</p>
                        </div>
                    ))}
                </div>

                {/* BIỂU ĐỒ DOANH THU THỰC TẾ VS DỰ KIẾN */}
                <div className={`rounded-2xl p-6 mb-8 ${theme === 'dark' ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
                    <h3 className="text-lg font-semibold mb-4">
                        So sánh tổng doanh thu thực tế vs dự kiến
                    </h3>

                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart
                            data={[
                                { name: 'Thực tế', doanhthu: stats.actualRevenue },
                                { name: 'Dự kiến', doanhthu: stats.expectedRevenue }
                            ]}
                        >
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis dataKey="name" />

                            <YAxis tickFormatter={(v) => v.toLocaleString("vi-VN")} />

                            <Tooltip
                                formatter={(v) => v.toLocaleString("vi-VN") + "₫"}
                                labelFormatter={() => "Doanh thu"}
                            />

                            <Bar dataKey="doanhthu" name="Doanh thu" radius={[10, 10, 0, 0]}>
                                <LabelList
                                    dataKey="doanhthu"
                                    position="top"
                                    content={(props) => {
                                        const { x, y, value, textAnchor } = props;

                                        return (
                                            <text
                                                x={Number(x)}
                                                y={Number(y) - 8}   // ⬅ FIXED: ép về number
                                                textAnchor={textAnchor}
                                                fill={theme === 'dark' ? "#fff" : "#000"}
                                                fontSize={12}
                                                fontWeight={600}
                                            >
                                                {Number(value).toLocaleString("vi-VN") + "₫"}
                                            </text>
                                        );
                                    }}
                                />


                                <Cell fill="#10B981" />
                                <Cell fill="#F59E0B" />
                            </Bar>

                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Biểu đồ 7 ngày – DỮ LIỆU THẬT */}
                <div className={`rounded-2xl p-6 mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className="text-lg font-semibold mb-4">Người dùng đăng ký 7 ngày gần nhất</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={registrationChart}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>


                {/* TOP 10 TOUR HOT NHẤT – DỮ LIỆU THẬT TỪ API */}
                <div className={`rounded-2xl p-6 mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <TrendingUp size={24} className="text-green-500" />
                        Top 10 tour phổ biến nhất
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {stats.topPopularTours?.map((tour, idx) => (
                            <div key={tour.tourId} className={`p-5 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} flex items-center gap-5 hover:shadow-lg transition`}>
                                <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-300">
                                    <img src={tour.imageUrl || '/placeholder.jpg'} alt={tour.tourName} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl font-bold text-gray-400">#{idx + 1}</span>
                                        <h4 className="font-semibold text-base line-clamp-2">{tour.tourName}</h4>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-3">{tour.destinationName}</p>
                                    <div className="grid grid-cols-3 gap-3 text-xs">
                                        <div className="text-center">
                                            <p className="font-bold text-cyan-600">{tour.views.toLocaleString()}</p>
                                            <p className="text-gray-500">lượt xem</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold text-green-600">{tour.bookingsCount}</p>
                                            <p className="text-gray-500">đặt tour</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold text-yellow-600">{tour.averageRating.toFixed(1)}</p>
                                            <p className="text-gray-500">điểm ({tour.reviewsCount} đánh giá)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Các phần còn lại giữ nguyên dữ liệu giả như yêu cầu */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                        <h3 className="text-lg font-semibold mb-4">Số tour được tạo theo tháng</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={tourByMonth}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="tours" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                        <h3 className="text-lg font-semibold mb-4">Lượt đặt tour theo tháng (2025)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={bookingByMonth}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="bookings" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                    {/* BIỂU ĐỒ PIE + SỐ LIỆU THEO KHU VỰC – DỮ LIỆU THẬT */}
                    <div className={`lg:col-span-4 rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                        <h3 className="text-lg font-semibold mb-6">Phân bố điểm đến theo khu vực</h3>

                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={stats.destinationStatsByRegion?.map(([region, count]) => ({
                                        name: region === 'NORTH' ? 'Miền Bắc' : region === 'CENTRAL' ? 'Miền Trung' : 'Miền Nam',
                                        value: Number(count)
                                    }))}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.destinationStatsByRegion?.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={['#3b82f6', '#f59e0b', '#10b981'][index]}
                                        />
                                    ))}
                                </Pie>

                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Legend bên dưới – sửa theo index */}
                        <div className="mt-6 space-y-4">
                            {stats.destinationStatsByRegion?.map(([region, count], index) => (
                                <div key={region} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-5 h-5 rounded-full"
                                            style={{
                                                backgroundColor: ['#3b82f6', '#f59e0b', '#10b981'][index]
                                            }}
                                        />
                                        <span className="font-medium text-sm">
                                            {region === 'NORTH' ? 'Miền Bắc' : region === 'CENTRAL' ? 'Miền Trung' : 'Miền Nam'}
                                        </span>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-bold text-lg">{Number(count)}</p>
                                        <p className="text-xs text-gray-500">điểm đến</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className={`lg:col-span-8 rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* TOP 5 TOUR ĐẶT NHIỀU NHẤT – DỮ LIỆU THẬT TỪ BACKEND */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Calendar size={20} className="text-blue-500" />
                                    Top 5 tour được đặt nhiều nhất
                                </h3>
                                <div className="space-y-3">
                                    {stats.top5BookedTours?.map((tour, idx) => (
                                        <div key={tour.tourId} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} flex items-center justify-between hover:shadow-md transition`}>
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl font-bold text-blue-600">#{idx + 1}</span>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-300">
                                                        <img
                                                            src={tour.imageUrl || '/placeholder.jpg'}
                                                            alt={tour.tourName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm line-clamp-1">{tour.tourName}</p>
                                                        <p className="text-xs text-gray-500">{tour.destinationName}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-blue-600">{tour.bookingCount}</p>
                                                <p className="text-xs text-gray-500">lượt đặt</p>
                                            </div>
                                        </div>
                                    ))}
                                    {(!stats.top5BookedTours || stats.top5BookedTours.length === 0) && (
                                        <p className="text-gray-500 text-center py-8">Chưa có dữ liệu đặt tour</p>
                                    )}
                                </div>
                            </div>

                            {/* TOP 5 ĐIỂM ĐẾN NỔI BẬT NHẤT – DỮ LIỆU THẬT TỪ BACKEND */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <MapPin size={20} className="text-orange-500" />
                                    Top 5 điểm đến nổi bật nhất
                                </h3>
                                <div className="space-y-3">
                                    {stats.top5PopularDestinations?.map((dest, idx) => (
                                        <div key={dest.destinationId} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} flex items-center justify-between hover:shadow-md transition`}>
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl font-bold text-orange-600">#{idx + 1}</span>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-300">
                                                        <img
                                                            src={dest.imageUrl || '/placeholder.jpg'}
                                                            alt={dest.destinationName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm line-clamp-1">{dest.destinationName}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {dest.region === 'NORTH' ? 'Miền Bắc' : dest.region === 'CENTRAL' ? 'Miền Trung' : 'Miền Nam'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-orange-600">{dest.bookingCount} lượt đặt</p>
                                                <p className="text-xs text-gray-500">{dest.tourCount} tour • {dest.totalViews.toLocaleString()} lượt xem</p>
                                            </div>
                                        </div>
                                    ))}
                                    {(!stats.top5PopularDestinations || stats.top5PopularDestinations.length === 0) && (
                                        <p className="text-gray-500 text-center py-8">Chưa có dữ liệu điểm đến</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bảng đơn đặt tour gần nhất */}
                {/* 5 ĐƠN ĐẶT TOUR GẦN NHẤT – DỮ LIỆU THẬT 100% TỪ BACKEND */}
                <div className={`mt-8 rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
                        <FileText size={20} className="text-blue-500" />
                        5 đơn đặt tour gần nhất
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <th className="text-left py-3 px-4 font-semibold">Mã đơn</th>
                                    <th className="text-left py-3 px-4 font-semibold">Khách hàng</th>
                                    <th className="text-left py-3 px-4 font-semibold">Tour</th>
                                    <th className="text-left py-3 px-4 font-semibold">Ngày đặt</th>
                                    <th className="text-left py-3 px-4 font-semibold">Giá trị</th>
                                    <th className="text-center py-3 px-4 font-semibold">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.latestBookings?.map((booking) => (
                                    <tr key={booking.bookingId} className={`border-b ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'} transition`}>
                                        {/* MÃ ĐƠN */}
                                        <td className="py-4 px-4 font-mono font-bold text-blue-600">
                                            #{booking.bookingId}
                                        </td>

                                        {/* KHÁCH HÀNG + AVATAR */}
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
                                                    <img
                                                        src={booking.customerAvatarUrl || '/default-avatar.jpg'}
                                                        alt={booking.customerName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{booking.customerName}</p>
                                                    <p className="text-xs text-gray-500">{booking.customerPhone}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* TÊN TOUR */}
                                        <td className="py-4 px-4 text-gray-600 dark:text-gray-300">
                                            {booking.tourName}
                                        </td>

                                        {/* NGÀY ĐẶT */}
                                        <td className="py-4 px-4 text-gray-500">
                                            {new Date(booking.bookingDate).toLocaleString('vi-VN', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>

                                        {/* GIÁ TRỊ ĐƠN */}
                                        <td className="py-4 px-4 font-semibold text-green-600">
                                            {Number(booking.totalPrice).toLocaleString('vi-VN')}₫
                                        </td>

                                        {/* TRẠNG THÁI */}
                                        <td className="py-4 px-4 text-center">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                                                booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                                                    booking.status === 'CANCEL_REQUEST' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' :
                                                        booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                                                            booking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                                                                'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                                }`}>
                                                {booking.status === 'CONFIRMED' ? 'Đã xác nhận' :
                                                    booking.status === 'PENDING' ? 'Chờ xác nhận' :
                                                        booking.status === 'CANCEL_REQUEST' ? 'Yêu cầu hủy' :
                                                            booking.status === 'CANCELLED' ? 'Đã hủy' :
                                                                booking.status === 'COMPLETED' ? 'Hoàn thành' :
                                                                    booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}

                                {/* Nếu chưa có booking nào */}
                                {(!stats.latestBookings || stats.latestBookings.length === 0) && (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12 text-gray-500">
                                            Chưa có đơn đặt tour nào
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;