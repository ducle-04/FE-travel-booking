import { useState } from 'react';
import { Search, MoreVertical, ChevronLeft, ChevronRight, TrendingUp, DollarSign, AlertCircle, ArrowUpRight } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

type HotelType = 'PLUS' | 'LUX' | 'PENTHOUSE';

const colors: Record<HotelType, string> = {
    PLUS: 'bg-blue-500',
    LUX: 'bg-orange-500',
    PENTHOUSE: 'bg-pink-500'
};

const Dashboard = () => {
    const { theme } = useTheme();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMonth, setSelectedMonth] = useState(10);
    const [selectedYear, setSelectedYear] = useState(2025);
    const [selectedDate, setSelectedDate] = useState(5);

    const expenseData = [
        { month: 'Jan', value: 2000 },
        { month: 'Feb', value: 1800 },
        { month: 'Mar', value: 2200 },
        { month: 'Apr', value: 1600 },
        { month: 'May', value: 1400 },
        { month: 'Jun', value: 1900 },
        { month: 'Jul', value: 2100 }
    ];

    const travelData = [
        {
            id: 1,
            name: 'Glacier National Park',
            location: 'Argentina',
            nights: '11 Night',
            checkIn: '11 May 2023',
            checkOut: '17 May 2023',
            people: 4,
            price: '$445',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop'
        },
        {
            id: 2,
            name: 'Emerald Bay Inn.',
            location: 'Indonesia',
            nights: '11 Night',
            checkIn: '03 Aug 2023',
            checkOut: '12 Aug 2023',
            people: 5,
            price: '$455',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
        },
        {
            id: 3,
            name: 'Great Barrier Reef',
            location: 'South Africa',
            nights: '8 Night',
            checkIn: '01 Dec 2022',
            checkOut: '13 Dec 2022',
            people: 3,
            price: '$953',
            image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=100&h=100&fit=crop'
        },
        {
            id: 4,
            name: 'Tahiti',
            location: 'Indonesia',
            nights: '12 Night',
            checkIn: '22 Aug 2023',
            checkOut: '01 Sep 2023',
            people: 3,
            price: '$29',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&h=100&fit=crop'
        },
        {
            id: 5,
            name: 'South Island',
            location: 'Russia',
            nights: '9 Night',
            checkIn: '18 Sep 2023',
            checkOut: '24 Sep 2023',
            people: 4,
            price: '$333',
            image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop'
        },
        {
            id: 6,
            name: 'South Island',
            location: 'Czech Republic',
            nights: '9 Night',
            checkIn: '28 Oct 2023',
            checkOut: '02 Nov 2023',
            people: 3,
            price: '$938',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop'
        },
        {
            id: 7,
            name: 'Great Barrier Reef',
            location: 'Peru',
            nights: '6 Night',
            checkIn: '29 Mar 2023',
            checkOut: '09 Apr 2023',
            people: 4,
            price: '$522',
            image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=100&h=100&fit=crop'
        },
        {
            id: 8,
            name: 'Tahiti',
            location: 'Morocco',
            nights: '7 Night',
            checkIn: '25 May 2023',
            checkOut: '30 May 2023',
            people: 3,
            price: '$73',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&h=100&fit=crop'
        },
        {
            id: 9,
            name: 'Maui',
            location: 'Azerbaijan',
            nights: '7 Night',
            checkIn: '28 Sep 2023',
            checkOut: '03 Oct 2023',
            people: 4,
            price: '$7',
            image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop'
        }
    ];

    const hotels: { name: string; type: HotelType; beds: number; adults: number; price: string; rating: number; image: string }[] = [
        { name: 'Emerald Bay Inn.', type: 'PLUS', beds: 3, adults: 3, price: '$100', rating: 4.9, image: '🏨' },
        { name: 'Crowne Plaza.', type: 'LUX', beds: 2, adults: 4, price: '$80', rating: 4.8, image: '🏨' },
        { name: 'Sunset Lodge.', type: 'PENTHOUSE', beds: 3, adults: 3, price: '$100', rating: 4.9, image: '🏨' },
        { name: 'Hotel Elite.', type: 'PLUS', beds: 1, adults: 2, price: '$120', rating: 4.9, image: '🏨' },
        { name: 'Hotel Bliss.', type: 'LUX', beds: 2, adults: 4, price: '$90', rating: 4.9, image: '🏨' }
    ];

    const getTypeColor = (type: HotelType) => {
        return colors[type] || 'bg-gray-500';
    };

    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month, 0).getDate();
    };

    const getFirstDayOfMonth = (month: number, year: number) => {
        return new Date(year, month - 1, 1).getDay();
    };

    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);

    const calendarDays: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
        calendarDays.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i);
    }

    const handlePrevMonth = () => {
        if (selectedMonth === 1) {
            setSelectedMonth(12);
            setSelectedYear(selectedYear - 1);
        } else {
            setSelectedMonth(selectedMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (selectedMonth === 12) {
            setSelectedMonth(1);
            setSelectedYear(selectedYear + 1);
        } else {
            setSelectedMonth(selectedMonth + 1);
        }
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'} p-6`}>
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <div className="relative w-80">
                        <input
                            type="text"
                            placeholder="Tìm kiếm tại đây..."
                            className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-100' : 'border-gray-300 bg-white text-gray-800'} focus:outline-none focus:border-blue-500`}
                        />
                        <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                {/* Total Booking Card */}
                <div className={`group relative ${theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500'} rounded-xl p-5 text-white overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-300"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <TrendingUp className="w-4 h-4 text-blue-100" />
                                    <p className={`text-xs font-semibold tracking-wider ${theme === 'dark' ? 'text-gray-200' : 'text-blue-100'}`}>TỔNG ĐẶT CHỖ</p>
                                </div>
                                <h2 className="text-4xl font-bold tracking-tight">31,556</h2>
                                <div className={`flex items-center gap-2 mt-3 text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-blue-100'}`}>
                                    <ArrowUpRight className="w-4 h-4" />
                                    <span>Tăng 12% so với tháng trước</span>
                                </div>
                            </div>
                            <button className={`bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 border ${theme === 'dark' ? 'border-gray-700' : 'border-white/20'}`}>
                                Xem báo cáo
                            </button>
                        </div>
                    </div>
                </div>

                {/* Total Revenue Card */}
                <div className={`group relative ${theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-br from-orange-600 via-orange-500 to-rose-500'} rounded-xl p-5 text-white overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-300"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <DollarSign className="w-4 h-4 text-orange-100" />
                                    <p className={`text-xs font-semibold tracking-wider ${theme === 'dark' ? 'text-gray-200' : 'text-orange-100'}`}>TỔNG THU NHẬP</p>
                                </div>
                                <h2 className="text-4xl font-bold tracking-tight">$61,556</h2>
                                <div className={`flex items-center gap-2 mt-3 text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-orange-100'}`}>
                                    <ArrowUpRight className="w-4 h-4" />
                                    <span>Tăng 8% so với tháng trước</span>
                                </div>
                            </div>
                            <button className={`bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 border ${theme === 'dark' ? 'border-gray-700' : 'border-white/20'}`}>
                                Xem báo cáo
                            </button>
                        </div>
                    </div>
                </div>

                {/* Total Debt Card */}
                <div className={`group relative ${theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-br from-pink-600 via-pink-500 to-purple-500'} rounded-xl p-5 text-white overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-300"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <AlertCircle className="w-4 h-4 text-pink-100" />
                                    <p className={`text-xs font-semibold tracking-wider ${theme === 'dark' ? 'text-gray-200' : 'text-pink-100'}`}>TỔNG NỢ</p>
                                </div>
                                <h2 className="text-4xl font-bold tracking-tight">$12,556</h2>
                                <div className={`flex items-center gap-2 mt-3 text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-pink-100'}`}>
                                    <ArrowUpRight className="w-4 h-4" />
                                    <span>Giảm 3% so với tháng trước</span>
                                </div>
                            </div>
                            <button className={`bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 border ${theme === 'dark' ? 'border-gray-700' : 'border-white/20'}`}>
                                Xem báo cáo
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Travel List */}
                <div className="lg:col-span-3">
                    <div className={`rounded-2xl overflow-hidden border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <tbody>
                                    {travelData.map((travel) => (
                                        <tr key={travel.id} className={`border-b ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} transition`}>
                                            <td className="px-6 py-4">
                                                <input type="checkbox" className={`w-4 h-4 rounded border ${theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}`} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-16 h-16 rounded-lg overflow-hidden">
                                                    <img src={travel.image} alt={travel.name} className="w-full h-full object-cover" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className={`font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{travel.name}</p>
                                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{travel.location}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-1">
                                                    {[...Array(travel.people)].map((_, i) => (
                                                        <span key={i} className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-lg`}>👥</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className={`px-6 py-4 font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{travel.price}</td>
                                            <td className="px-6 py-4 text-center">
                                                <MoreVertical size={18} className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'} cursor-pointer`} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className={`flex items-center justify-between px-6 py-4 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                            <button className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'} p-2`}>
                                <ChevronLeft size={18} />
                            </button>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-8 h-8 rounded flex items-center justify-center font-semibold transition text-sm ${currentPage === page
                                            ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                                            : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'} p-2`}>
                                <ChevronRight size={18} />
                            </button>
                            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} ml-4`}>1 - 10 of 100 entries</div>
                        </div>
                    </div>
                </div>

                {/* Analytics Sidebar */}
                <div className="space-y-4">
                    {/* Analytics Section */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Phân tích</h3>
                            <MoreVertical size={18} className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'} cursor-pointer`} />
                        </div>

                        {/* Custom Donut Chart */}
                        <div className="flex flex-col items-center mb-4">
                            <svg width="120" height="120" viewBox="0 0 120 120" className="mb-4">
                                <circle cx="60" cy="60" r="55" fill="none" stroke={`${theme === 'dark' ? '#4b5563' : '#e5e7eb'}`} strokeWidth="3" opacity="0.5" />
                                <circle cx="60" cy="60" r="48" fill="none" stroke={`${theme === 'dark' ? '#4b5563' : '#e5e7eb'}`} strokeWidth="3" opacity="0.3" />
                                <circle cx="60" cy="60" r="42" fill="none" stroke="#22c55e" strokeWidth="8" strokeDasharray="98.96 310.88" strokeLinecap="round" transform="rotate(-90 60 60)" />
                                <circle cx="60" cy="60" r="42" fill="none" stroke="#ec4899" strokeWidth="8" strokeDasharray="62.83 310.88" strokeLinecap="round" transform="rotate(44 60 60)" />
                                <circle cx="60" cy="60" r="42" fill="none" stroke="#a855f7" strokeWidth="8" strokeDasharray="62.83 310.88" strokeLinecap="round" transform="rotate(117 60 60)" />
                                <text x="60" y="55" textAnchor="middle" fontSize="12" fontWeight="bold" fill={`${theme === 'dark' ? '#9ca3af' : '#6b7280'}`}>Tổng</text>
                                <text x="60" y="72" textAnchor="middle" fontSize="20" fontWeight="bold" fill={`${theme === 'dark' ? '#e5e7eb' : '#1f2937'}`}>166</text>
                            </svg>
                            <p className={`text-center text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Phân tích du lịch được tính</p>
                            <p className={`text-center text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>dựa trên số lượng chuyến du lịch</p>
                        </div>
                    </div>

                    {/* Expense Section */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h4 className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Chi phí</h4>
                                <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>$34.6k</p>
                            </div>
                            <MoreVertical size={18} className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'} cursor-pointer`} />
                        </div>
                        <ResponsiveContainer width="100%" height={180}>
                            <AreaChart
                                data={expenseData}
                                margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
                            >
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="0" stroke={`${theme === 'dark' ? '#4b5563' : '#f0f0f0'}`} vertical={false} />
                                <XAxis dataKey="month" stroke={`${theme === 'dark' ? '#9ca3af' : '#9ca3af'}`} style={{ fontSize: '12px' }} />
                                <YAxis stroke={`${theme === 'dark' ? '#9ca3af' : '#9ca3af'}`} style={{ fontSize: '12px' }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: theme === 'dark' ? '#1f2937' : '#f3f4f6',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '8px 12px',
                                        color: theme === 'dark' ? '#e5e7eb' : '#1f2937'
                                    }}
                                    formatter={(value) => [`Chi phí: ${value}`, '']}
                                    labelFormatter={(label) => label}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    fill="url(#colorValue)"
                                    dot={false}
                                    isAnimationActive={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Calendar Section */}
                    <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <button onClick={handlePrevMonth} className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} p-2`}>
                                ‹
                            </button>
                            <div className="flex items-center gap-2">
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                    className={`text-sm ${theme === 'dark' ? 'text-gray-300 bg-gray-800' : 'text-gray-600 bg-transparent'} border-0 focus:outline-none cursor-pointer`}
                                >
                                    <option value={1}>Tháng 1</option>
                                    <option value={2}>Tháng 2</option>
                                    <option value={3}>Tháng 3</option>
                                    <option value={4}>Tháng 4</option>
                                    <option value={5}>Tháng 5</option>
                                    <option value={6}>Tháng 6</option>
                                    <option value={7}>Tháng 7</option>
                                    <option value={8}>Tháng 8</option>
                                    <option value={9}>Tháng 9</option>
                                    <option value={10}>Tháng 10</option>
                                    <option value={11}>Tháng 11</option>
                                    <option value={12}>Tháng 12</option>
                                </select>
                            </div>
                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{selectedYear}</span>
                            <button onClick={handleNextMonth} className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} p-2`}>
                                ›
                            </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                                <div key={day} className={`text-center text-xs font-semibold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} py-1`}>
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((day, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => day && setSelectedDate(day)}
                                    className={`py-2 rounded text-xs font-medium transition ${day === null
                                        ? theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                                        : day === selectedDate
                                            ? theme === 'dark' ? 'bg-blue-600 text-white font-bold' : 'bg-blue-500 text-white font-bold'
                                            : theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Hotels Section */}
            <div className="mt-8">
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'} mb-6`}>Khách sạn hàng đầu</h2>
                <div className={`rounded-3xl p-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
                    <div className="flex gap-6 overflow-x-auto pb-4">
                        {hotels.map((hotel) => (
                            <div key={hotel.name} className={`flex-shrink-0 w-80 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} rounded-3xl overflow-hidden`}>
                                <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url("https://images.unsplash.com/photo-${hotel.name === 'Emerald Bay Inn.' ? '1566456162354-f8ac002112b2' : hotel.name === 'Crowne Plaza.' ? '1559827260-dc66d52bef19' : hotel.name === 'Sunset Lodge.' ? '1522708323590-d24dbb6b0267' : hotel.name === 'Hotel Elite.' ? '1631049307264-da0ec9d70304' : '1578821656276-f8ac002112b2'}?w=400&h=300&fit=crop")` }}>
                                    <div className="h-full w-full bg-gradient-to-b from-transparent to-black/20"></div>
                                </div>
                                <div className="p-5">
                                    <div className="mb-3 flex items-center gap-2">
                                        <span className={`${getTypeColor(hotel.type)} text-white text-xs font-bold px-3 py-1.5 rounded-full`}>{hotel.type}</span>
                                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} font-medium`}>{hotel.beds} BEDS {hotel.adults} ADULT</span>
                                    </div>
                                    <h3 className={`font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'} mb-3`}>{hotel.name}</h3>
                                    <div className="flex justify-between items-center">
                                        <span className={`font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{hotel.price}<span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} font-normal`}>/day</span></span>
                                        <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>⭐ {hotel.rating}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;