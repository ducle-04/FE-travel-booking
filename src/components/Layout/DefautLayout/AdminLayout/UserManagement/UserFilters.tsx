import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useTheme } from '../../../../../context/ThemeContext';

interface UserFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedRole: string;
    setSelectedRole: (role: string) => void;
    selectedStatus: string;
    setSelectedStatus: (status: string) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    selectedRole,
    setSelectedRole,
    selectedStatus,
    setSelectedStatus,
}) => {
    const { theme } = useTheme();

    return (
        <div className="flex gap-3">
            <div className="flex-1 max-w-xs">
                <div className="relative">
                    <Search size={16} className={`absolute left-2 top-2.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm"
                        className={`w-full pl-8 pr-3 py-1.5 border rounded-full text-sm focus:outline-none transition-colors ${theme === 'dark'
                            ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-gray-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-400'
                            }`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="relative">
                <select
                    className={`flex items-center gap-1 px-3 pr-6 py-1.5 border rounded-lg text-sm transition-colors appearance-none ${theme === 'dark'
                        ? 'bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-cyan-50'
                        }`}
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                >
                    <option value="">Tất cả vai trò</option>
                    <option value="ADMIN">Quản trị</option>
                    <option value="STAFF">Nhân viên</option>
                    <option value="USER">Khách</option>
                </select>
                <ChevronDown size={16} className={`absolute right-2 top-2.5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
            </div>
            <div className="relative">
                <select
                    className={`flex items-center gap-1 px-3 pr-6 py-1.5 border rounded-lg text-sm transition-colors appearance-none ${theme === 'dark'
                        ? 'bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Không hoạt động">Không hoạt động</option>
                    <option value="Bị cấm">Bị cấm</option>
                    <option value="Đã xóa">Đã xóa</option>
                </select>
                <ChevronDown size={16} className={`absolute right-2 top-2.5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
            </div>
        </div>
    );
};

export default UserFilters;