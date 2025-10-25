import React from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import type { User } from '../../../../../services/userService';
import { useTheme } from '../../../../../context/ThemeContext'; // Nhập useTheme
import Swal from 'sweetalert2'; // Nhập SweetAlert2
import { toast } from 'react-toastify'; // Nhập react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Nhập CSS cho react-toastify

interface UserTableProps {
    users: User[];
    isAdmin: boolean;
    roles: string[];
    loading: boolean;
    onViewDetails: (username: string) => void;
    onEditUser: (user: User) => void;
    onDeleteUser: (id: number, username: string) => Promise<void>; // Cập nhật để trả về Promise
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
    const { theme } = useTheme(); // Lấy trạng thái theme

    const getStatusColor = (status: string): string => {
        const colors: { [key: string]: string } = {
            'Hoạt động': 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
            'Không hoạt động': 'bg-gray-100 text-gray-600 border border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
            'Bị cấm': 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
            'Đã xóa': 'bg-slate-100 text-slate-600 border border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
        };
        return colors[status] || '';
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

    // Kiểm tra vai trò STAFF để vô hiệu hóa các hành động
    const isStaffOnly = roles.includes('STAFF') && !roles.includes('ADMIN');

    // Hàm xử lý xóa với xác nhận
    const handleDelete = async (id: number, username: string) => {
        const result = await Swal.fire({
            title: 'Xác nhận xóa tài khoản',
            text: `Bạn có chắc muốn xóa tài khoản "${username}"? Hành động này không thể hoàn tác.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
            reverseButtons: true,
            customClass: {
                popup: theme === 'dark' ? 'swal2-dark' : '',
                title: theme === 'dark' ? 'text-gray-200' : 'text-gray-800',
                htmlContainer: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
                confirmButton: theme === 'dark' ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-red-600 hover:bg-red-500 text-white',
                cancelButton: theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-800',
            },
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#e5e7eb' : '#374151',
        });

        if (result.isConfirmed) {
            try {
                await onDeleteUser(id, username);
                toast.success(`Xóa tài khoản "${username}" thành công!`, {
                    position: 'top-right',
                    autoClose: 3000,
                    theme: theme === 'dark' ? 'dark' : 'light',
                });
            } catch (error: any) {
                toast.error(error.message || 'Không thể xóa tài khoản. Vui lòng thử lại.', {
                    position: 'top-right',
                    autoClose: 5000,
                    theme: theme === 'dark' ? 'dark' : 'light',
                });
            }
        }
    };

    return (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors">
            <table className="w-full">
                <thead>
                    <tr className="bg-gradient-to-r from-cyan-700 to-cyan-800 dark:from-cyan-900 dark:to-cyan-950 text-white text-sm font-semibold border-b-2 border-cyan-900">
                        <th className="px-5 py-3 text-left">#</th>
                        <th className="px-5 py-3 text-left">Họ tên</th>
                        <th className="px-5 py-3 text-left">Email</th>
                        <th className="px-5 py-3 text-left">Tài khoản</th>
                        <th className="px-5 py-3 text-left">Số điện thoại</th>
                        <th className="px-5 py-3 text-left">Trạng thái</th>
                        <th className="px-5 py-3 text-left">Vai trò</th>
                        <th className="px-5 py-3 text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {loading ? (
                        <tr>
                            <td colSpan={8} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin">⟳</div>
                                    <span className="ml-2">Đang tải...</span>
                                </div>
                            </td>
                        </tr>
                    ) : users.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="px-5 py-8 text-center text-gray-400 dark:text-gray-500 text-sm">
                                📭 Không tìm thấy tài khoản
                            </td>
                        </tr>
                    ) : (
                        users.map((user, index) => (
                            <tr
                                key={user.id}
                                className="hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors duration-150"
                            >
                                <td className="px-5 py-3 text-gray-500 dark:text-gray-400 text-sm font-medium">{index + 1}</td>
                                <td className="px-5 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-full ${getAvatarColor(index)} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                                            {user.fullname.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-gray-900 dark:text-gray-100 text-sm font-medium">
                                            {user.fullname}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-5 py-3 text-gray-600 dark:text-gray-300 text-sm">{user.email}</td>
                                <td className="px-5 py-3 text-gray-600 dark:text-gray-300 text-sm font-mono text-xs bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded w-fit">{user.username}</td>
                                <td className="px-5 py-3 text-gray-600 dark:text-gray-300 text-sm">{user.phoneNumber}</td>
                                <td className="px-5 py-3">
                                    <select
                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${getStatusColor(user.status)} appearance-none pr-8 bg-right`}
                                        value={user.status}
                                        onChange={(e) => onChangeStatus(user.username, e.target.value)}
                                        disabled={loading || isStaffOnly || !isAdmin || user.role === 'ADMIN'}
                                    >
                                        <option value="Hoạt động">Hoạt động</option>
                                        <option value="Không hoạt động">Không hoạt động</option>
                                        <option value="Bị cấm">Bị cấm</option>
                                        <option value="Đã xóa">Đã xóa</option>
                                    </select>
                                </td>
                                <td className="px-5 py-3 text-gray-700 dark:text-gray-200 text-sm font-medium">
                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${user.role === 'ADMIN'
                                        ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                                        : user.role === 'STAFF'
                                            ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                        }`}>
                                        {getRoleLabel(user.role)}
                                    </span>
                                </td>
                                <td className="px-5 py-3">
                                    <div className="flex gap-2 justify-center">
                                        <button
                                            className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md transition-colors duration-150"
                                            onClick={() => onViewDetails(user.username)}
                                            disabled={loading}
                                            title="Xem chi tiết"
                                        >
                                            <Eye size={16} strokeWidth={2} />
                                        </button>
                                        {isAdmin && !isStaffOnly && user.role !== 'USER' && user.role !== 'ADMIN' && (
                                            <button
                                                className="p-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-md transition-colors duration-150"
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
                                        {isAdmin && !isStaffOnly && user.role !== 'ADMIN' && (
                                            <button
                                                className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md transition-colors duration-150"
                                                onClick={() => handleDelete(user.id, user.username)} // Sử dụng handleDelete
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