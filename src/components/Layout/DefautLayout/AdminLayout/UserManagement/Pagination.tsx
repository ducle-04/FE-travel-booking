import React from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useTheme } from '../../../../../context/ThemeContext';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
    loading: boolean;
    filteredUsersLength: number;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    filteredUsersLength,
}) => {
    const { theme } = useTheme(); // Lấy trạng thái theme

    return (
        <div
            className={`border-t px-4 py-3 flex items-center justify-between transition-colors duration-300 ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                }`}
        >
            <div className="flex items-center gap-2">
                <span
                    className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}
                >
                    Hàng mỗi trang
                </span>
                <button
                    className={`flex items-center gap-1 px-2 py-1 border rounded text-sm hover:bg-gray-100 ${theme === 'dark'
                            ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                            : 'border-gray-300 text-gray-600'
                        }`}
                >
                    10 <ChevronDown size={14} />
                </button>
                <span
                    className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}
                >
                    của {filteredUsersLength} hàng
                </span>
            </div>
            <div className="flex items-center gap-1">
                <button
                    className={`p-1.5 rounded ${theme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1 || loading}
                    title="Trang trước"
                >
                    <ChevronLeft size={16} />
                </button>
                <button
                    className={`p-1.5 rounded ${theme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1 || loading}
                    title="Trang đầu"
                >
                    &laquo;
                </button>
                {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-7 h-7 rounded flex items-center justify-center text-sm ${currentPage === page
                                ? theme === 'dark'
                                    ? 'bg-slate-700 text-white'
                                    : 'bg-slate-800 text-white'
                                : theme === 'dark'
                                    ? 'text-gray-300 hover:bg-gray-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                        title={`Trang ${page}`}
                    >
                        {page}
                    </button>
                ))}
                {totalPages > 3 && (
                    <>
                        <span
                            className={`px-1 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}
                        >
                            ...
                        </span>
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            className={`w-7 h-7 rounded flex items-center justify-center text-sm ${theme === 'dark'
                                    ? 'text-gray-300 hover:bg-gray-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                            title={`Trang ${totalPages}`}
                        >
                            {totalPages}
                        </button>
                    </>
                )}
                <button
                    className={`p-1.5 rounded ${theme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages || loading}
                    title="Trang sau"
                >
                    <ChevronRight size={16} />
                </button>
                <button
                    className={`p-1.5 rounded ${theme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages || loading}
                    title="Trang cuối"
                >
                    &raquo;
                </button>
            </div>
        </div>
    );
};

export default Pagination;