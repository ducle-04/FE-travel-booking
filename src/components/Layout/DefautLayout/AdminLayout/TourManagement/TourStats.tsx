import React, { useState, useEffect } from 'react';

interface TourStatsProps {
    theme: string;
}

interface TourStatsData {
    totalTours: number;
    activeTours: number;
    inactiveTours: number;
    totalBookings: number;
}

const TourStats: React.FC<TourStatsProps> = ({ theme }) => {
    const [stats, setStats] = useState<TourStatsData>({
        totalTours: 0,
        activeTours: 0,
        inactiveTours: 0,
        totalBookings: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/tours/stats');
                if (!response.ok) throw new Error('Không thể tải thống kê tour');
                const result = await response.json();

                // Kiểm tra cấu trúc response
                const data = result.data;
                setStats({
                    totalTours: data.totalTours || 0,
                    activeTours: data.activeTours || 0,
                    inactiveTours: data.inactiveTours || 0,
                    totalBookings: data.totalConfirmedBookings || 0  // ĐÃ SỬA
                });
            } catch (error) {
                console.error('Lỗi khi tải thống kê tour:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className={`rounded-xl p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'}`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Tổng Tours</p>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                    {stats.totalTours}
                </p>
            </div>
            <div className={`rounded-xl p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Đang Hoạt Động</p>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                    {stats.activeTours}
                </p>
            </div>
            <div className={`rounded-xl p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-orange-50'}`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Tạm Dừng</p>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>
                    {stats.inactiveTours}
                </p>
            </div>
            <div className={`rounded-xl p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-purple-50'}`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Tổng Đặt Tour</p>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                    {stats.totalBookings}
                </p>
            </div>
        </div>
    );
};

export default TourStats;