import React from 'react';
import { Eye, Edit2, Trash2, ChevronDown } from 'lucide-react';
import type { User } from '../../../../../services/userService';
import { useTheme } from '../../../../../context/ThemeContext';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface UserTableProps {
    users: User[];
    isAdmin: boolean;
    roles: string[];
    loading: boolean;
    onViewDetails: (username: string) => void;
    onEditUser: (user: User) => void;
    onDeleteUser: (id: number, username: string) => Promise<void>;
    onChangeStatus: (username: string, status: string) => void;
    setShowEditUserModal: (show: boolean) => void;
}

const UserTable: React.FC<UserTableProps> = ({
    users,
    isAdmin,
    roles,
    loading,
    onViewDetails,
    onEditUser,
    onDeleteUser,
    onChangeStatus,
    setShowEditUserModal,
}) => {
    const { theme } = useTheme();

    const getStatusStyles = (status: 'Hoạt động' | 'Không hoạt động' | 'Bị cấm' | 'Đã xóa'): string => {
        const light: Record<string, string> = {
            'Hoạt động': 'bg-emerald-500/50 text-emerald-700 border-emerald-200',
            'Không hoạt động': 'bg-gray-100 text-gray-600 border-gray-300',
            'Bị cấm': 'bg-red-50 text-red-700 border-red-200',
            'Đã xóa': 'bg-slate-100 text-slate-600 border-slate-300',
        };
        const dark: Record<string, string> = {
            'Hoạt động': 'bg-emerald-800/80 text-emerald-200 border-emerald-700',
            'Không hoạt động': 'bg-gray-700/80 text-gray-300 border-gray-600',
            'Bị cấm': 'bg-red-800/80 text-red-300 border-red-700',
            'Đã xóa': 'bg-slate-700/80 text-slate-300 border-slate-600',
        };

        const styles = theme === 'dark' ? dark[status] : light[status];
        return `${styles} px-3 py-1.5 rounded-full text-xs font-semibold border transition-all`;
    };

    const getAvatarColor = (index: number): string => {
        const colors: string[] = [
            'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500', 'bg-red-500', 'bg-green-500',
        ];
        return colors[index % colors.length];
    };

    const getRoleLabel = (role: string): string => {
        const roleMap: { [key: string]: string } = {
            USER: 'Khách',
            STAFF: 'Nhân viên',
            ADMIN: 'Quản trị',
        };
        return roleMap[role] || role;
    };

    const isStaffOnly = roles.includes('STAFF') && !roles.includes('ADMIN');

    const handleDelete = async (id: number, username: string) => {
        const result = await Swal.fire({
            title: 'Xác nhận xóa tài khoản',
            text: `Bạn có chắc muốn xóa tài khoản "${username}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
            reverseButtons: true,
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#e5e7eb' : '#374151',
        });

        if (result.isConfirmed) {
            try {
                await onDeleteUser(id, username);
                toast.success(`Xóa tài khoản "${username}" thành công!`, {
                    theme: theme === 'dark' ? 'dark' : 'light',
                });
            } catch (error: any) {
                toast.error(error.message || 'Không thể xóa tài khoản.', {
                    theme: theme === 'dark' ? 'dark' : 'light',
                });
            }
        }
    };

    return (
        <div className={`overflow-x-auto rounded-lg shadow-sm border transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
            }`}>
            <table className="w-full">
                <thead className={`bg-gradient-to-r ${theme === 'dark' ? 'from-cyan-900 to-cyan-950' : 'from-cyan-700 to-cyan-800'
                    } text-white`}>
                    <tr className={`border-b-2 ${theme === 'dark' ? 'border-cyan-800' : 'border-cyan-900'}`}>
                        <th className="px-5 py-3 text-left text-sm font-semibold">#</th>
                        <th className="px-5 py-3 text-left text-sm font-semibold">Họ tên</th>
                        <th className="px-5 py-3 text-left text-sm font-semibold">Email</th>
                        <th className="px-5 py-3 text-left text-sm font-semibold">Tài khoản</th>
                        <th className="px-5 py-3 text-left text-sm font-semibold">Số điện thoại</th>
                        <th className="px-5 py-3 text-left text-sm font-semibold">Trạng thái</th>
                        <th className="px-5 py-3 text-left text-sm font-semibold">Vai trò</th>
                        <th className="px-5 py-3 text-center text-sm font-semibold">Hành động</th>
                    </tr>
                </thead>

                <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'
                    }`}>
                    {loading ? (
                        <tr>
                            <td colSpan={8} className="px-5 py-12 text-center">
                                <div className="flex justify-center items-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
                                    <span className={`ml-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Đang tải...
                                    </span>
                                </div>
                            </td>
                        </tr>
                    ) : users.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="px-5 py-12 text-center text-gray-400">
                                Không tìm thấy tài khoản
                            </td>
                        </tr>
                    ) : (
                        users.map((user, index) => (
                            <tr
                                key={user.id}
                                className={`transition-colors ${theme === 'dark' ? 'hover:bg-gray-700/70' : 'hover:bg-gray-50'
                                    }`}
                            >
                                <td className={`px-5 py-3 font-medium text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                    {index + 1}
                                </td>

                                <td className="px-5 py-3">
                                    <div className="flex items-center gap-3">
                                        {user.avatarUrl ? (
                                            <img
                                                src={user.avatarUrl}
                                                alt={user.fullname}
                                                className={`w-9 h-9 rounded-full object-cover ring-2 ${theme === 'dark' ? 'ring-gray-700' : 'ring-white'
                                                    } shadow-sm`}
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className={`w-9 h-9 rounded-full ${getAvatarColor(index)} flex items-center justify-center text-white font-bold shadow-sm`}>
                                                {user.fullname.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <span className={`font-medium text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                                            }`}>
                                            {user.fullname}
                                        </span>
                                    </div>
                                </td>

                                <td className={`px-5 py-3 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                    {user.email}
                                </td>

                                <td className="px-5 py-3">
                                    <code className={`px-2 py-1 text-xs font-mono rounded ${theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {user.username}
                                    </code>
                                </td>

                                <td className={`px-5 py-3 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                    {user.phoneNumber}
                                </td>

                                {/* TRẠNG THÁI – ĐÃ SỬA ĐẸP */}
                                <td className="px-5 py-3">
                                    <div className="relative">
                                        <select
                                            className={`w-full min-w-32 appearance-none pr-9 bg-transparent rounded-full text-xs font-semibold cursor-pointer transition-all outline-none focus:ring-2 focus:ring-cyan-500 ${getStatusStyles(user.status)}`}
                                            style={{
                                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                                                backgroundPosition: 'right 0.75rem center',
                                                backgroundSize: '12px',
                                                backgroundRepeat: 'no-repeat',
                                            }}
                                            value={user.status}
                                            onChange={(e) => onChangeStatus(user.username, e.target.value)}
                                            disabled={loading || isStaffOnly || !isAdmin || user.role === 'ADMIN'}
                                        >
                                            <option value="Hoạt động">Hoạt động</option>
                                            <option value="Không hoạt động">Không hoạt động</option>
                                            <option value="Bị cấm">Bị cấm</option>
                                            <option value="Đã xóa">Đã xóa</option>
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-current opacity-70" />
                                    </div>
                                </td>

                                {/* VAI TRÒ */}
                                <td className="px-5 py-3">
                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${user.role === 'ADMIN'
                                        ? theme === 'dark' ? 'bg-red-900/80 text-red-200' : 'bg-red-100 text-red-700'
                                        : user.role === 'STAFF'
                                            ? theme === 'dark' ? 'bg-blue-900/80 text-blue-200' : 'bg-blue-100 text-blue-700'
                                            : theme === 'dark' ? 'bg-gray-700/80 text-gray-300' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {getRoleLabel(user.role)}
                                    </span>
                                </td>

                                {/* HÀNH ĐỘNG */}
                                <td className="px-5 py-3">
                                    <div className="flex justify-center gap-3">
                                        <button
                                            onClick={() => onViewDetails(user.username)}
                                            className={`p-2 rounded-lg transition ${theme === 'dark'
                                                ? 'text-blue-400 hover:bg-blue-900/30'
                                                : 'text-blue-600 hover:bg-blue-100'
                                                }`}
                                            title="Xem"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        {isAdmin && !isStaffOnly && user.role !== 'USER' && user.role !== 'ADMIN' && (
                                            <button
                                                onClick={() => {
                                                    onEditUser(user);
                                                    setShowEditUserModal(true);
                                                }}
                                                className={`p-2 rounded-lg transition ${theme === 'dark'
                                                    ? 'text-amber-400 hover:bg-amber-900/30'
                                                    : 'text-amber-600 hover:bg-amber-100'
                                                    }`}
                                                title="Sửa"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                        )}
                                        {isAdmin && !isStaffOnly && user.role !== 'ADMIN' && (
                                            <button
                                                onClick={() => handleDelete(user.id, user.username)}
                                                className={`p-2 rounded-lg transition ${theme === 'dark'
                                                    ? 'text-red-400 hover:bg-red-900/30'
                                                    : 'text-red-600 hover:bg-red-100'
                                                    }`}
                                                title="Xóa"
                                            >
                                                <Trash2 size={16} />
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