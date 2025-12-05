// src/pages/admin/BookingManagement.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';

import {
    fetchPendingBookings,
} from '../../services/bookingService';
import { axiosInstance } from '../../services/bookingService';
import type { Booking, BookingPage, BookingStatus } from '../../services/bookingService';

import BookingStats from '../../components/Layout/DefautLayout/AdminLayout/Booking/BookingStats';
import BookingFilters from '../../components/Layout/DefautLayout/AdminLayout/Booking/BookingFilters';
import BookingTable from '../../components/Layout/DefautLayout/AdminLayout/Booking/BookingTable';
import BookingModal from '../../components/Layout/DefautLayout/AdminLayout/Booking/BookingModal';

const BookingManagement: React.FC = () => {
    const { theme } = useTheme();

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [showModal, setShowModal] = useState(false);

    const loadBookings = useCallback(async (pageNum: number, filterStatus?: BookingStatus[]) => {
        setLoading(true);
        setError(null);
        try {
            const data: BookingPage = await fetchPendingBookings(pageNum, filterStatus);
            setBookings(data.content);
            setTotalPages(data.totalPages || 1);
            setPage(pageNum);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không thể tải danh sách booking');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const filter = statusFilter === 'ALL' ? undefined : [statusFilter];
        loadBookings(0, filter);
    }, [statusFilter, loadBookings]);

    useEffect(() => {
        loadBookings(0);
    }, [loadBookings]);

    const filteredBookings = useMemo(() => {
        if (!searchTerm.trim()) return bookings;
        const term = searchTerm.toLowerCase();
        return bookings.filter(b =>
            (b.userFullname || b.contactName || '').toLowerCase().includes(term) ||
            b.tourName.toLowerCase().includes(term) ||
            (b.userPhone || b.contactPhone || '').includes(term) ||
            b.id.toString().includes(term)
        );
    }, [bookings, searchTerm]);

    const stats = useMemo(() => ({
        pending: bookings.filter(b => b.status === 'PENDING').length,
        confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
        cancelRequested: bookings.filter(b => b.status === 'CANCEL_REQUEST').length,
        completed: bookings.filter(b => b.status === 'COMPLETED').length,
    }), [bookings]);

    // Xóa hoàn toàn handleDeleteFromTable → để BookingRow tự xử lý
    const handleUpdateBooking = (updated: Booking) => {
        setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
        setSelectedBooking(updated);
    };

    return (
        <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
            <div className="max-w-7xl mx-auto">

                <div className={`rounded-2xl p-8 mb-8 ${theme === 'dark' ? 'bg-gray-800/70 border border-gray-700 backdrop-blur' : 'bg-white/80 border border-slate-200 backdrop-blur'}`}>
                    <h1 className={`text-4xl font-bold mb-3 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Quản Lý Booking Tour</h1>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Theo dõi và xử lý đơn đặt tour nhanh chóng</p>
                </div>

                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-cyan-600"></div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-6 py-4 rounded-xl mb-8">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <>
                        <BookingStats stats={stats} theme={theme} />
                        <BookingFilters
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            theme={theme}
                        />
                        <BookingTable
                            bookings={filteredBookings}
                            page={page}
                            totalPages={totalPages}
                            onPageChange={(p) => loadBookings(p, statusFilter === 'ALL' ? undefined : [statusFilter])}
                            onOpenModal={(b) => {
                                setSelectedBooking(b);
                                setShowModal(true);
                            }}
                            onDelete={(id) => {
                                // Chỉ cập nhật danh sách sau khi xóa thành công (BookingRow đã xử lý confirm + toast)
                                setBookings(prev => prev.filter(b => b.id !== id));
                            }}
                            theme={theme}
                        />
                        <BookingModal
                            booking={selectedBooking}
                            isOpen={showModal}
                            onClose={() => setShowModal(false)}
                            onUpdate={handleUpdateBooking}
                            axiosInstance={axiosInstance}
                            theme={theme}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default BookingManagement;