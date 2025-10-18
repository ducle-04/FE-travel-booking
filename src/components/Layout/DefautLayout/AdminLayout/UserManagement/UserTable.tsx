import React from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';

interface User {
    id: number;
    username: string;
    email: string;
    fullname: string;
    phoneNumber: string;
    status: 'Hoạt động' | 'Không hoạt động' | 'Bị cấm' | 'Đã xóa';
    role: string;
    createdAt: string;
}

interface UserTableProps {
    users: User[];
    isAdmin: boolean;
    loading: boolean;
    onViewDetails: (username: string) => void;
    onEditUser: (user: User) => void;
    onDeleteUser: (id: number, username: string) => void;
    onChangeStatus: (username: string, status: string) => void;
    setShowEditUserModal: (show: boolean) => void;
}

const UserTable: React.FC<UserTableProps> = ({
    users,
    isAdmin,
    loading,
    onViewDetails,
    onEditUser,
    onDeleteUser,
    onChangeStatus,
    setShowEditUserModal,
}) => {
    const getStatusColor = (status: string): string => {
        const colors: { [key: string]: string } = {
            'Hoạt động': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
            'Không hoạt động': 'bg-gray-100 text-gray-600 border border-gray-300',
            'Bị cấm': 'bg-red-50 text-red-700 border border-red-200',
            'Đã xóa': 'bg-slate-100 text-slate-600 border border-slate-300',
        };
        return colors[status] || 'bg-gray-100 text-gray-600 border border-gray-300';
    };

    const getAvatarColor = (index: number): string => {
        const colors: string[] = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500', 'bg-red-500', 'bg-green-500'];
        return colors[index % colors.length];
    };

    const getRoleLabel = (role: string): string => {
        const roleMap: { [key: string]: string } = {
            'USER': 'Khách',
            'STAFF': 'Nhân viên',
            'ADMIN': 'Quản trị'
        };
        return roleMap[role] || role;
    };

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            <table className="w-full">
                <thead>
                    <tr className="bg-gradient-to-r from-cyan-700 to-cyan-800 text-white text-sm font-semibold border-b-2 border-cyan-900">
                        <th className="px-5 py-3 text-left">#</th>
                        <th className="px-5 py-3 text-left min-w-[200px]">Họ tên</th>
                        <th className="px-5 py-3 text-left min-w-[220px]">Email</th>
                        <th className="px-5 py-3 text-left min-w-[140px]">Tài khoản</th>
                        <th className="px-5 py-3 text-left min-w-[130px]">Số điện thoại</th>
                        <th className="px-5 py-3 text-left min-w-[140px]">Trạng thái</th>
                        <th className="px-5 py-3 text-left min-w-[100px]">Vai trò</th>
                        <th className="px-5 py-3 text-center min-w-[120px]">Hành động</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {loading ? (
                        <tr>
                            <td colSpan={8} className="px-5 py-8 text-center text-gray-500 text-sm">
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin">⟳</div>
                                    <span className="ml-2">Đang tải...</span>
                                </div>
                            </td>
                        </tr>
                    ) : users.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="px-5 py-8 text-center text-gray-400 text-sm">
                                📭 Không tìm thấy tài khoản
                            </td>
                        </tr>
                    ) : (
                        users.map((user, index) => (
                            <tr key={user.id} className="hover:bg-slate-50 transition-colors duration-150">
                                <td className="px-5 py-3 text-gray-500 text-sm font-medium">{index + 1}</td>
                                <td className="px-5 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-full ${getAvatarColor(index)} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                                            {user.fullname.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-gray-900 text-sm font-medium">{user.fullname}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-3 text-gray-600 text-sm">{user.email}</td>
                                <td className="px-5 py-3 text-gray-600 text-sm font-mono text-xs bg-gray-50 px-2 py-1 rounded w-fit">{user.username}</td>
                                <td className="px-5 py-3 text-gray-600 text-sm">{user.phoneNumber}</td>
                                <td className="px-5 py-3">
                                    <select
                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${getStatusColor(user.status)} appearance-none pr-8 bg-right`}
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'right 6px center',
                                        }}
                                        value={user.status}
                                        onChange={(e) => onChangeStatus(user.username, e.target.value)}
                                        disabled={loading || !isAdmin || user.role === 'ADMIN'}
                                    >
                                        <option value="Hoạt động">Hoạt động</option>
                                        <option value="Không hoạt động">Không hoạt động</option>
                                        <option value="Bị cấm">Bị cấm</option>
                                        <option value="Đã xóa">Đã xóa</option>
                                    </select>
                                </td>
                                <td className="px-5 py-3 text-gray-700 text-sm font-medium">
                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                                        user.role === 'STAFF' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                        {getRoleLabel(user.role)}
                                    </span>
                                </td>
                                <td className="px-5 py-3">
                                    <div className="flex gap-2 justify-center">
                                        <button
                                            className="p-1.5 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-md transition-colors duration-150"
                                            onClick={() => onViewDetails(user.username)}
                                            disabled={loading}
                                            title="Xem chi tiết"
                                        >
                                            <Eye size={16} strokeWidth={2} />
                                        </button>
                                        {isAdmin && user.role !== 'USER' && user.role !== 'ADMIN' && (
                                            <button
                                                className="p-1.5 text-amber-600 hover:bg-amber-100 hover:text-amber-700 rounded-md transition-colors duration-150"
                                                onClick={() => {
                                                    onEditUser(user);
                                                    setShowEditUserModal(true);
                                                }}
                                                disabled={loading}
                                                title="Chỉnh sửa"
                                            >
                                                <Edit2 size={16} strokeWidth={2} />
                                            </button>
                                        )}
                                        {isAdmin && user.role !== 'ADMIN' && (
                                            <button
                                                className="p-1.5 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-md transition-colors duration-150"
                                                onClick={() => onDeleteUser(user.id, user.username)}
                                                disabled={loading}
                                                title="Xóa"
                                            >
                                                <Trash2 size={16} strokeWidth={2} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;