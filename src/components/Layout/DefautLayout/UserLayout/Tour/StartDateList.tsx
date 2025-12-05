// src/components/Layout/DefautLayout/UserLayout/Tour/StartDateList.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface StartDateAvailabilityDTO {
    date: string;
    formattedDate: string;
    remainingSeats: number;
    available: boolean;
}

interface StartDateListProps {
    tourId: number;
    selectedDate: string;
    onDateSelect: (date: string) => void;
}

const StartDateList: React.FC<StartDateListProps> = ({ tourId, selectedDate, onDateSelect }) => {
    const [dates, setDates] = useState<StartDateAvailabilityDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDates = async () => {
            try {
                const res = await axios.get<StartDateAvailabilityDTO[]>(
                    `http://localhost:8080/api/tours/${tourId}/start-dates`
                );
                const data = res.data;

                setDates(data);
                setLoading(false);

                // TỰ ĐỘNG CHỌN NGÀY ĐẦU TIÊN CÒN CHỖ (chỉ chạy 1 lần)
                if (data.length > 0 && !selectedDate) {
                    const firstAvailable = data.find(d => d.available);
                    if (firstAvailable) {
                        onDateSelect(firstAvailable.date);
                    }
                }
            } catch (err) {
                console.error('Lỗi tải ngày khởi hành:', err);
                setDates([]);
                setLoading(false);
            }
        };

        fetchDates();
    }, [tourId, onDateSelect]); // ← Không phụ thuộc selectedDate → tránh loop

    if (loading) {
        return <div className="text-white/70 text-sm">Đang tải lịch khởi hành...</div>;
    }

    if (dates.length === 0) {
        return (
            <div className="text-red-400 font-medium bg-red-900/30 backdrop-blur px-6 py-4 rounded-xl">
                Chưa có lịch khởi hành
            </div>
        );
    }

    return (
        <div className="flex flex-wrap gap-3">
            {dates.map((d) => {
                const isSelected = selectedDate === d.date;
                const isSoldOut = !d.available;

                return (
                    <button
                        key={d.date}
                        onClick={() => !isSoldOut && onDateSelect(d.date)}
                        disabled={isSoldOut}
                        className={`px-6 py-3.5 rounded-xl font-medium text-sm transition-all shadow-lg border-2 relative
                            ${isSelected
                                ? 'bg-white text-gray-900 border-white scale-105 shadow-2xl z-10'
                                : isSoldOut
                                    ? 'bg-gray-600/40 text-gray-500 border-gray-500 cursor-not-allowed opacity-70'
                                    : 'bg-white/20 backdrop-blur-md text-white border-white/40 hover:bg-white/35 hover:border-white/70'
                            }`}
                    >
                        <div>{d.formattedDate}</div>
                        {d.remainingSeats > 0 && !isSoldOut && (
                            <div className="text-xs mt-1 font-bold text-yellow-300">
                                Còn {d.remainingSeats} chỗ
                            </div>
                        )}
                        {isSoldOut && (
                            <div className="text-xs mt-1 font-bold text-red-400">
                                Hết chỗ
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default StartDateList;