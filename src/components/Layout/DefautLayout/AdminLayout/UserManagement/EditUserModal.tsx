import React from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../../../../context/ThemeContext';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validateEditUserForm } from '../../../../../utils/formValidation';

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

interface EditUserModalProps {
    editUser: User;
    setEditUser: (user: User) => void;
    onEditUser: (payload: {
        fullname: string;
        phoneNumber: string;
        status: User['status'];
        role: string;
    }) => Promise<void>;
    onClose: () => void;
    loading: boolean;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
    editUser,
    setEditUser,
    onEditUser,
    onClose,
    loading,
}) => {
    const { theme } = useTheme();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const errors = validateEditUserForm(editUser);
        if (Object.keys(errors).length > 0) {
            const firstError = Object.values(errors)[0];
            toast.error(firstError, {
                position: 'top-right',
                autoClose: 5000,
                theme: theme === 'dark' ? 'dark' : 'light',
            });
            return;
        }

        const result = await Swal.fire({
            title: 'Xác nhận chỉnh sửa tài khoản',
            text: `Bạn có chắc muốn chỉnh sửa tài khoản "${editUser.username}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
            reverseButtons: true,
            customClass: {
                popup: theme === 'dark' ? 'swal2-dark' : '',
                title: theme === 'dark' ? 'text-gray-200' : 'text-gray-800',
                htmlContainer: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
                confirmButton: theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white',
                cancelButton: theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-800',
            },
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#e5e7eb' : '#374151',
        });

        if (result.isConfirmed) {
            try {
                const payload = {
                    fullname: editUser.fullname,
                    phoneNumber: editUser.phoneNumber,
                    status: editUser.status,
                    role: editUser.role,
                };

                await onEditUser(payload);

                toast.success('Chỉnh sửa tài khoản thành công!', {
                    position: 'top-right',
                    autoClose: 3000,
                    theme: theme === 'dark' ? 'dark' : 'light',
                });
                onClose();
            } catch (error: any) {
                toast.error(error.message || 'Không thể chỉnh sửa tài khoản. Vui lòng thử lại.', {
                    position: 'top-right',
                    autoClose: 5000,
                    theme: theme === 'dark' ? 'dark' : 'light',
                });
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div
                className={`rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}
            >
                {/* Header */}
                <div
                    className={`sticky top-0 bg-gradient-to-r ${theme === 'dark'
                        ? 'from-gray-800 to-gray-900'
                        : 'from-slate-700 to-slate-800'
                        } text-white px-6 py-4 flex items-center justify-between border-b-2 ${theme === 'dark' ? 'border-gray-700' : 'border-slate-900'
                        }`}
                >
                    <h2 className="text-xl font-bold">Chỉnh sửa tài khoản</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-slate-600 rounded-lg transition-colors"
                        disabled={loading}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-2 gap-5 mb-6">
                        {/* Tài khoản (Disabled) */}
                        <div>
                            <label
                                className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                    }`}
                            >
                                Tài khoản
                            </label>
                            <input
                                type="text"
                                className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-gray-100 text-gray-600 cursor-not-allowed ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                                    }`}
                                value={editUser.username}
                                disabled
                            />
                            <p className="text-xs text-gray-500 mt-1">Không thể thay đổi</p>
                        </div>

                        {/* Email (Disabled) */}
                        <div>
                            <label
                                className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                    }`}
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-gray-100 text-gray-600 cursor-not-allowed ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                                    }`}
                                value={editUser.email}
                                disabled
                            />
                            <p className="text-xs text-gray-500 mt-1">Không thể thay đổi</p>
                        </div>

                        {/* Họ tên */}
                        <div>
                            <label
                                className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                    }`}
                            >
                                Họ tên <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all ${theme === 'dark'
                                    ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                    }`}
                                value={editUser.fullname}
                                onChange={(e) => setEditUser({ ...editUser, fullname: e.target.value })}
                                placeholder="Nhập họ tên"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Số điện thoại */}
                        <div>
                            <label
                                className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                    }`}
                            >
                                Số điện thoại <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all ${theme === 'dark'
                                    ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                    }`}
                                value={editUser.phoneNumber}
                                onChange={(e) => setEditUser({ ...editUser, phoneNumber: e.target.value })}
                                placeholder="0123456789"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Vai trò */}
                        <div>
                            <label
                                className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                    }`}
                            >
                                Vai trò <span className="text-red-500">*</span>
                            </label>
                            <select
                                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all appearance-none cursor-pointer ${theme === 'dark'
                                    ? 'bg-gray-800 border-gray-600 text-gray-200'
                                    : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                                value={editUser.role}
                                onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                                disabled={loading}
                            >
                                <option value="ADMIN">Quản trị</option>
                                <option value="STAFF">Nhân viên</option>
                                <option value="USER">Khách</option>
                            </select>
                        </div>

                        {/* Trạng thái */}
                        <div>
                            <label
                                className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                    }`}
                            >
                                Trạng thái <span className="text-red-500">*</span>
                            </label>
                            <select
                                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all appearance-none cursor-pointer ${theme === 'dark'
                                    ? 'bg-gray-800 border-gray-600 text-gray-200'
                                    : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                                value={editUser.status}
                                onChange={(e) =>
                                    setEditUser({
                                        ...editUser,
                                        status: e.target.value as 'Hoạt động' | 'Không hoạt động' | 'Bị cấm' | 'Đã xóa',
                                    })
                                }
                                disabled={loading}
                            >
                                <option value="Hoạt động">Hoạt động</option>
                                <option value="Không hoạt động">Không hoạt động</option>
                                <option value="Bị cấm">Bị cấm</option>
                                <option value="Đã xóa">Đã xóa</option>
                            </select>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div
                        className={`flex justify-end gap-3 pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                            }`}
                    >
                        <button
                            type="button"
                            className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 disabled:opacity-50 ${theme === 'dark'
                                ? 'text-gray-200 bg-gray-700 hover:bg-gray-600'
                                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                                }`}
                            onClick={onClose}
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg ${theme === 'dark'
                                ? 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white'
                                : 'bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white'
                                }`}
                            disabled={loading}
                        >
                            {loading ? 'Đang lưu...' : 'Lưu'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;