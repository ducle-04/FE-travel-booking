import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

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
    return (
        <div className="flex gap-3">
            <div className="flex-1 max-w-xs">
                <div className="relative">
                    <Search size={16} className="absolute left-2 top-2.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm"
                        className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="relative">
                <select
                    className="flex items-center gap-1 px-3 pr-6 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-cyan-50 appearance-none"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                >
                    <option value="">Tất cả vai trò</option>
                    <option value="ADMIN">Quản trị</option>
                    <option value="STAFF">Nhân viên</option>
                    <option value="USER">Khách</option>
                </select>
                <ChevronDown size={16} className="absolute right-2 top-2.5 text-cyan-700" />
            </div>
            <div className="relative">
                <select
                    className="flex items-center gap-1 px-3 pr-6 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 appearance-none"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Không hoạt động">Không hoạt động</option>
                    <option value="Bị cấm">Bị cấm</option>
                    <option value="Đã xóa">Đã xóa</option>
                </select>
                <ChevronDown size={16} className="absolute right-2 top-2.5 text-cyan-700" />
            </div>
        </div>
    );
};

export default UserFilters;