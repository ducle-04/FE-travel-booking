import React from 'react';
import { Clock, CheckCircle, XCircle, Calendar, Users, AlertCircle, X } from 'lucide-react';

interface BookingStatsProps {
    stats: {
        totalBookings: number;
        pending: number;
        confirmed: number;
        cancelRequest: number;
        cancelled: number;
        rejected: number;
        completed: number;
    };
    loading?: boolean;
    theme: 'light' | 'dark';
}

const BookingStats: React.FC<BookingStatsProps> = ({ stats, loading = false, theme }) => {
    const items = [
        { label: 'Tổng Booking', value: stats.totalBookings, icon: Users, color: 'purple' },
        { label: 'Chờ xác nhận', value: stats.pending, icon: Clock, color: 'yellow' },
        { label: 'Đã xác nhận', value: stats.confirmed, icon: CheckCircle, color: 'green' },
        { label: 'Yêu cầu hủy', value: stats.cancelRequest, icon: AlertCircle, color: 'orange' },
        { label: 'Đã hủy', value: stats.cancelled, icon: XCircle, color: 'red' },
        { label: 'Bị từ chối', value: stats.rejected, icon: X, color: 'rose' },
        { label: 'Hoàn thành', value: stats.completed, icon: Calendar, color: 'blue' },
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-6 mb-8">
                {[...Array(7)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-6 mb-8">
            {items.map((item, i) => (
                <div
                    key={i}
                    className={`rounded-2xl p-6 border backdrop-blur transition-all hover:scale-105 ${theme === 'dark'
                            ? `bg-gradient-to-br from-${item.color}-900/30 to-${item.color}-800/10 border-${item.color}-700/50`
                            : `bg-gradient-to-br from-${item.color}-50 to-white border-${item.color}-200`
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                {item.label}
                            </p>
                            <p className={`text-4xl font-bold mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                                {item.value.toLocaleString()}
                            </p>
                        </div>
                        <item.icon className={`w-10 h-10 ${theme === 'dark' ? `text-${item.color}-400` : `text-${item.color}-600`} opacity-80`} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BookingStats;