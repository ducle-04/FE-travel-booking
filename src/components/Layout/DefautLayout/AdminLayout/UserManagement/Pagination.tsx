import React from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useTheme } from '../../../../../context/ThemeContext';

interface PaginationProps {
    currentPage: number;        // 1-based
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
    const { theme } = useTheme();

    // Logic mới: luôn hiện 3 số, trang hiện tại ở cuối, "đẩy" số cũ ra khi nhảy
    const getDisplayedPages = () => {
        if (totalPages <= 4) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        // Tính trang đầu tiên trong bộ 3 số (trang hiện tại là số cuối cùng trong bộ 3)
        const startPage = Math.max(1, currentPage - 2);

        const pages = [];
        for (let i = startPage; i <= Math.min(startPage + 2, totalPages); i++) {
            pages.push(i);
        }

        return pages;
    };

    const displayedPages = getDisplayedPages();

    if (totalPages <= 1) return null;

    return (
        <div
            className={`border-t px-4 py-3 flex items-center justify-between transition-colors duration-300 ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                }`}
        >
            <div className="flex items-center gap-2">
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
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
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    của {filteredUsersLength} hàng
                </span>
            </div>

            <div className="flex items-center gap-1">
                {/* Trang trước */}
                <button
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1 || loading}
                    className={`p-1.5 rounded ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} disabled:opacity-50`}
                >
                    <ChevronLeft size={16} />
                </button>

                {/* Trang đầu */}
                <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1 || loading}
                    className={`p-1.5 rounded ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} disabled:opacity-50`}
                >
                    &laquo;
                </button>

                {/* Hiển thị 3 số liên tiếp, trang hiện tại ở cuối */}
                {displayedPages.map((pageNum) => (
                    <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        disabled={loading}
                        className={`w-7 h-7 rounded flex items-center justify-center text-sm font-medium transition ${currentPage === pageNum
                                ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                                : theme === 'dark'
                                    ? 'text-gray-300 hover:bg-gray-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                            } disabled:opacity-50`}
                    >
                        {pageNum}
                    </button>
                ))}

                {/* ... và trang cuối (chỉ hiện khi trang hiện tại không gần cuối) */}
                {currentPage < totalPages - 2 && totalPages > 4 && (
                    <>
                        <span className={`px-1 text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>...</span>
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={loading}
                            className={`w-7 h-7 rounded flex items-center justify-center text-sm font-medium transition ${theme === 'dark'
                                    ? 'text-gray-300 hover:bg-gray-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                                } disabled:opacity-50`}
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                {/* Trang sau */}
                <button
                    onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages || loading}
                    className={`p-1.5 rounded ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} disabled:opacity-50`}
                >
                    <ChevronRight size={16} />
                </button>

                {/* Trang cuối */}
                <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages || loading}
                    className={`p-1.5 rounded ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} disabled:opacity-50`}
                >
                    &raquo;
                </button>
            </div>
        </div>
    );
};

export default Pagination;