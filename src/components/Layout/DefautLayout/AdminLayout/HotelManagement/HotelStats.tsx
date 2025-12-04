import React from 'react';
import { Hotel, Building2, Star, MapPin, AlertCircle } from 'lucide-react';
import { fetchHotelStats } from '../../../../../services/hotelService';

interface HotelStatsData {
    totalHotels: number;
    activeHotels: number;
    fiveStarHotels: number;
    uniqueAddresses: number;
}

interface Props {
    theme: 'light' | 'dark';
    refreshTrigger?: number;
}

const HotelStats: React.FC<Props> = ({ theme, refreshTrigger = 0 }) => {
    const [stats, setStats] = React.useState<HotelStatsData | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const loadStats = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchHotelStats();
                setStats(data);
            } catch (err) {
                console.error('Lỗi khi lấy thống kê khách sạn:', err);
                setError('Không thể tải thống kê');
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, [refreshTrigger]);

    const StatCard = ({
        title,
        value,
        icon: Icon,
        color,
        bgColor
    }: {
        title: string;
        value: number;
        icon: React.ElementType;
        color: string;
        bgColor: string;
    }) => (
        <div className={`p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:shadow-xl
            ${theme === 'dark' ? 'bg-gray-800/80 border-gray-700' : 'bg-white/90 border-gray-200'}`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {title}
                    </p>
                    <p className={`text-3xl font-extrabold mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {loading ? '...' : value.toLocaleString()}
                    </p>
                </div>
                <div className={`p-4 rounded-2xl ${bgColor}`}>
                    <Icon size={36} className={`${color} drop-shadow-lg`} />
                </div>
            </div>
            <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                    className={`h-full ${color.replace('text-', 'bg-')} bg-opacity-30 rounded-full transition-all duration-1000`}
                    style={{ width: loading ? '30%' : '100%' }}
                />
            </div>
        </div>
    );

    if (error) {
        return (
            <div className="p-8 text-center">
                <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="Tổng khách sạn"
                value={stats?.totalHotels || 0}
                icon={Hotel}
                color="text-blue-600"
                bgColor="bg-blue-100 dark:bg-blue-900/30"
            />
            <StatCard
                title="Đang hoạt động"
                value={stats?.activeHotels || 0}
                icon={Building2}
                color="text-emerald-600"
                bgColor="bg-emerald-100 dark:bg-emerald-900/30"
            />
            <StatCard
                title="Khách sạn 5 sao"
                value={stats?.fiveStarHotels || 0}
                icon={Star}
                color="text-yellow-500"
                bgColor="bg-yellow-100 dark:bg-yellow-900/30"
            />
            <StatCard
                title="Địa điểm duy nhất"
                value={stats?.uniqueAddresses || 0}
                icon={MapPin}
                color="text-purple-600"
                bgColor="bg-purple-100 dark:bg-purple-900/30"
            />
        </div>
    );
};

export default HotelStats;