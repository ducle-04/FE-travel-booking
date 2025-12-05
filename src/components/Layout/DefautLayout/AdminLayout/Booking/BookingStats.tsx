import React from 'react';
import { Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';

interface Stats {
    pending: number;
    confirmed: number;
    cancelRequested: number;
    completed: number;
}

interface Props {
    stats: Stats;
    theme: 'light' | 'dark';
}

const BookingStats: React.FC<Props> = ({ stats, theme }) => {
    const items = [
        { label: 'Chờ xác nhận', value: stats.pending, icon: Clock, color: 'yellow' },
        { label: 'Đã xác nhận', value: stats.confirmed, icon: CheckCircle, color: 'green' },
        { label: 'Yêu cầu hủy', value: stats.cancelRequested, icon: XCircle, color: 'orange' },
        { label: 'Hoàn thành', value: stats.completed, icon: Calendar, color: 'blue' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {items.map((item, i) => (
                <div
                    key={i}
                    className={`rounded-2xl p-6 border ${theme === 'dark'
                        ? `bg-gradient-to-br from-${item.color}-900/40 to-${item.color}-800/20 border-${item.color}-700/50`
                        : `bg-gradient-to-br from-${item.color}-50 to-white border-${item.color}-200`
                        } backdrop-blur`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                {item.label}
                            </p>
                            <p className={`text-4xl font-bold mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                                {item.value}
                            </p>
                        </div>
                        <item.icon className={`w-12 h-12 ${theme === 'dark' ? `text-${item.color}-400` : `text-${item.color}-600`}`} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BookingStats;