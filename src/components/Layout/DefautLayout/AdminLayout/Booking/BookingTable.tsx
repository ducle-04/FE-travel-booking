import React from 'react';
import BookingRow from './BookingRow';
import type { Booking } from '../../../../../services/bookingService';

interface Props {

    bookings: Booking[];
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onOpenModal: (booking: Booking) => void;
    onDelete: (id: number) => void;
    theme: 'light' | 'dark';
}

const BookingTable: React.FC<Props> = ({
    bookings,
    page,
    totalPages,
    onPageChange,
    onOpenModal,
    onDelete,
    theme,
}) => {
    return (
        <div className={`rounded-2xl overflow-hidden border ${theme === 'dark' ? 'bg-gray-800/70 border-gray-700' : 'bg-white/80 border-slate-200'} backdrop-blur`}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className={`${theme === 'dark' ? 'bg-gray-900/70' : 'bg-gray-50'} border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                        <tr>
                            <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>#</th>
                            <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Khách hàng</th>
                            <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Tour</th>
                            <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Ngày đi</th>
                            <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Số người</th>
                            <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Tổng tiền</th>
                            <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Phương thức</th>
                            <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Thanh toán</th>
                            <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Trạng thái</th>
                            <th className={`px-6 py-5 text-left text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                        {bookings.map((booking, idx) => (
                            <BookingRow
                                key={booking.id}
                                booking={booking}
                                index={idx}
                                page={page}
                                theme={theme}
                                onOpenModal={onOpenModal}
                                onDelete={onDelete}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className={`px-6 py-5 border-t ${theme === 'dark' ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'} flex items-center justify-between`}>
                    <button onClick={() => onPageChange(page - 1)} disabled={page === 0}
                        className={`px-6 py-3 rounded-xl font-medium transition ${page === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-600 hover:text-white'} ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700 border'}`}>
                        Trước
                    </button>
                    <span className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                        Trang {page + 1} / {totalPages}
                    </span>
                    <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages - 1}
                        className={`px-6 py-3 rounded-xl font-medium transition ${page >= totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-600 hover:text-white'} ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700 border'}`}>
                        Sau
                    </button>
                </div>
            )}

            {bookings.length === 0 && (
                <div className="text-center py-16 text-xl text-gray-500">
                    Không có booking nào phù hợp
                </div>
            )}
        </div>
    );
};

export default BookingTable;