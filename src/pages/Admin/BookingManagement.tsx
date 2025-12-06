// src/pages/admin/BookingManagement.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

import {
    fetchPendingBookings,
    fetchBookingStats,
} from '../../services/bookingService';

import type {
    Booking,
    BookingPage,
    BookingStatus,
    BookingStats as IBookingStats,
} from '../../services/bookingService';

import BookingStats from '../../components/Layout/DefautLayout/AdminLayout/Booking/BookingStats';
import BookingFilters from '../../components/Layout/DefautLayout/AdminLayout/Booking/BookingFilters';
import BookingTable from '../../components/Layout/DefautLayout/AdminLayout/Booking/BookingTable';

const BookingManagement: React.FC = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const urlPage = Number(searchParams.get("page") || 0);

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loadingBookings, setLoadingBookings] = useState(true);

    const [stats, setStats] = useState<IBookingStats>({
        totalBookings: 0,
        pending: 0,
        confirmed: 0,
        cancelRequest: 0,
        cancelled: 0,
        rejected: 0,
        completed: 0,
    });

    const [loadingStats, setLoadingStats] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');

    // Load danh sách booking
    const loadBookings = useCallback(async (pageNum: number = 0, filterStatus?: BookingStatus[]) => {
        setLoadingBookings(true);
        try {
            const data: BookingPage = await fetchPendingBookings(pageNum, filterStatus);
            setBookings(data.content);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            console.error('Load bookings error:', err);
        } finally {
            setLoadingBookings(false);
        }
    }, []);

    // Load thống kê
    const loadStats = useCallback(async () => {
        setLoadingStats(true);
        try {
            const data = await fetchBookingStats();
            setStats(data);
        } catch (err) {
            console.error('Load stats error:', err);
        } finally {
            setLoadingStats(false);
        }
    }, []);

    // Load theo page trên URL
    useEffect(() => {
        const filter = statusFilter === 'ALL' ? undefined : [statusFilter];
        loadBookings(urlPage, filter);
        loadStats();
    }, [urlPage]);

    // Khi đổi trạng thái — reset page về 0 nhưng KHÔNG reload data sai
    const handleStatusFilterChange = (newStatus: BookingStatus | 'ALL') => {
        setStatusFilter(newStatus);
        setSearchParams({ page: "0" });
    };

    const filteredBookings = useMemo(() => {
        if (!searchTerm.trim()) return bookings;
        const term = searchTerm.toLowerCase();
        return bookings.filter(b =>
            b.id.toString().includes(term) ||
            b.tourName.toLowerCase().includes(term) ||
            (b.userFullname || '').toLowerCase().includes(term) ||
            (b.contactName || '').toLowerCase().includes(term) ||
            (b.userPhone || b.contactPhone || '').includes(term) ||
            b.contactEmail.toLowerCase().includes(term)
        );
    }, [bookings, searchTerm]);

    const handleOpenBookingDetail = (booking: Booking) => {
        navigate(`/admin/bookings/${booking.id}?page=${urlPage}`);
    };

    const handleBookingDeleted = (id: number) => {
        setBookings(prev => prev.filter(b => b.id !== id));
        loadStats();
    };

    return (
        <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-blue-50'}`}>
            <div className="max-w-7xl mx-auto">

                {(loadingBookings || loadingStats) && (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin h-12 w-12 border-t-4 border-b-4 border-cyan-600 rounded-full"></div>
                    </div>
                )}

                {!loadingBookings && !loadingStats && (
                    <>
                        <BookingStats stats={stats} theme={theme} />

                        <BookingFilters
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            statusFilter={statusFilter}
                            setStatusFilter={handleStatusFilterChange}
                            theme={theme}
                        />

                        <BookingTable
                            bookings={filteredBookings}
                            page={urlPage}
                            totalPages={totalPages}
                            onPageChange={(p) => setSearchParams({ page: p.toString() })}
                            onOpenModal={handleOpenBookingDetail}
                            onDelete={handleBookingDeleted}
                            theme={theme}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default BookingManagement;
