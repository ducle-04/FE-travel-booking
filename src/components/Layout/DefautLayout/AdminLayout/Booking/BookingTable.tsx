import React from 'react';
import BookingRow from './BookingRow';
import Pagination from '../UserManagement/Pagination';
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

            {/* ⭐ DÙNG COMPONENT PAGINATION CHUNG ⭐ */}
            <Pagination
                currentPage={page + 1} // Pagination dùng 1-based, bạn đang dùng 0-based → +1
                totalPages={totalPages}
                setCurrentPage={(newPage) => onPageChange(newPage - 1)} // Chuyển lại về 0-based
                loading={false} // Nếu cần disable khi loading, bạn truyền từ parent
                filteredUsersLength={bookings.length} // Hoặc truyền totalItems từ API nếu có
            />

            {/* Thông báo khi không có booking */}
            {bookings.length === 0 && (
                <div className="text-center py-16 text-xl text-gray-500">
                    Không có booking nào phù hợp
                </div>
            )}
        </div>
    );
};

export default BookingTable;