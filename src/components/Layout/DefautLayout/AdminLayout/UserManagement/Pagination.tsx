import React from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

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
    return (
        <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Hàng mỗi trang</span>
                <button className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    10 <ChevronDown size={14} />
                </button>
                <span className="text-sm text-gray-600">của {filteredUsersLength} hàng</span>
            </div>
            <div className="flex items-center gap-1">
                <button
                    className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1 || loading}
                    title="Trang trước"
                >
                    <ChevronLeft size={16} />
                </button>
                <button
                    className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
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
                        className={`w-7 h-7 rounded flex items-center justify-center text-sm ${currentPage === page ? 'bg-slate-800 text-white' : 'text-gray-600 hover:bg-gray-100'
                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                        title={`Trang ${page}`}
                    >
                        {page}
                    </button>
                ))}
                {totalPages > 3 && (
                    <>
                        <span className="px-1 text-gray-600 text-sm">...</span>
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            className={`w-7 h-7 rounded flex items-center justify-center text-sm text-gray-600 hover:bg-gray-100 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            disabled={loading}
                            title={`Trang ${totalPages}`}
                        >
                            {totalPages}
                        </button>
                    </>
                )}
                <button
                    className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                    onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages || loading}
                    title="Trang sau"
                >
                    <ChevronRight size={16} />
                </button>
                <button
                    className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
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