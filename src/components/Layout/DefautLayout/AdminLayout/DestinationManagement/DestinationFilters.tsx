import React from 'react';
import { Search, Plus } from 'lucide-react';
import { useTheme } from '../../../../../context/ThemeContext';

interface DestinationFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    regionFilter: string;
    setRegionFilter: (region: string) => void;
    onOpenModal: () => void;
}

const DestinationFilters: React.FC<DestinationFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    regionFilter,
    setRegionFilter,
    onOpenModal,
}) => {
    const { theme } = useTheme();

    return (
        <div className={`rounded-2xl p-6 mb-6 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-400'}`} size={20} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm điểm đến..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-slate-300'}`}
                    />
                </div>

                <div className="flex gap-2">
                    {['all', 'Bắc', 'Trung', 'Nam'].map((region) => (
                        <button
                            key={region}
                            onClick={() => setRegionFilter(region)}
                            className={`px-5 py-3 rounded-xl font-medium transition-all ${regionFilter === region
                                ? theme === 'dark' ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white'
                                : theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            {region === 'all' ? 'Tất cả' : region}
                        </button>
                    ))}
                </div>

                <button
                    onClick={onOpenModal}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${theme === 'dark' ? 'bg-gradient-to-r from-blue-700 to-blue-800 text-white hover:from-blue-800 hover:to-blue-900' : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'}`}
                >
                    <Plus size={20} />
                    Thêm mới
                </button>
            </div>
        </div>
    );
};

export default DestinationFilters;