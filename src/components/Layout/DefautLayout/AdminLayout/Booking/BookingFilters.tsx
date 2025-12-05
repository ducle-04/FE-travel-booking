import React from 'react';
import { Search, Filter } from 'lucide-react';
import type { BookingStatus } from '../../../../../services/bookingService';

interface Props {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    statusFilter: BookingStatus | 'ALL';
    setStatusFilter: (status: BookingStatus | 'ALL') => void;
    theme: 'light' | 'dark';
}

const BookingFilters: React.FC<Props> = ({
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    theme,
}) => {
    return (
        <div className={`rounded-2xl p-6 mb-8 ${theme === 'dark' ? 'bg-gray-800/70 border border-gray-700' : 'bg-white/80 border border-slate-200'} backdrop-blur`}>
            <div className="flex flex-col lg:flex-row gap-5">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
                    <input
                        type="text"
                        placeholder="Tìm khách, tour, số điện thoại..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-12 pr-5 py-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${theme === 'dark'
                            ? 'bg-gray-700/60 border-gray-600 text-gray-200 placeholder-gray-500'
                            : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                            }`}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <Filter size={22} className="text-gray-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className={`px-6 py-4 rounded-xl border focus:ring-2 focus:ring-purple-500 transition-all ${theme === 'dark'
                            ? 'bg-gray-700/60 border-gray-600 text-gray-200'
                            : 'bg-white border-gray-300 text-gray-800'
                            }`}
                    >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="PENDING">Chờ xác nhận</option>
                        <option value="CONFIRMED">Đã xác nhận</option>
                        <option value="CANCEL_REQUEST">Yêu cầu hủy</option>
                        <option value="COMPLETED">Hoàn thành</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default BookingFilters;