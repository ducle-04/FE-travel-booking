import React from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../../../../context/ThemeContext';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validateAddUserForm } from '../../../../../utils/formValidation';

interface AddUserModalProps {
    newUser: {
        username: string;
        password: string;
        email: string;
        fullname: string;
        phoneNumber: string;
        status: string;
        roles: string[];
    };
    setNewUser: (user: any) => void;
    onAddUser: (e: React.FormEvent) => Promise<void>;
    onClose: () => void;
    loading: boolean;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
    newUser,
    setNewUser,
    onAddUser,
    onClose,
    loading,
}) => {
    const { theme } = useTheme();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Kiểm tra validation
        const errors = validateAddUserForm(newUser);
        if (Object.keys(errors).length > 0) {
            // Hiển thị lỗi đầu tiên bằng toast
            const firstError = Object.values(errors)[0];
            toast.error(firstError, {
                position: 'top-right',
                autoClose: 5000,
                theme: theme === 'dark' ? 'dark' : 'light',
            });
            return;
        }

        // Hiển thị SweetAlert2 để xác nhận
        const result = await Swal.fire({
            title: 'Xác nhận thêm tài khoản',
            text: `Bạn có chắc muốn thêm tài khoản "${newUser.username}"?`,
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
                await onAddUser(e);
                toast.success('Thêm tài khoản thành công!', {
                    position: 'top-right',
                    autoClose: 3000,
                    theme: theme === 'dark' ? 'dark' : 'light',
                });
                onClose();
            } catch (error: any) {
                toast.error(error.message || 'Không thể thêm tài khoản. Vui lòng thử lại.', {
                    position: 'top-right',
                    autoClose: 5000,
                    theme: theme === 'dark' ? 'dark' : 'light',
                });
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className={`rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}>
                {/* Header */}
                <div className={`sticky top-0 bg-gradient-to-r from-slate-700 to-slate-800 text-white px-6 py-4 flex items-center justify-between border-b-2 border-slate-900`}>
                    <h2 className="text-xl font-bold">Thêm tài khoản mới</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-slate-600 rounded-lg transition-colors"
                        disabled={loading}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-2 gap-5 mb-6">
                        {/* Tài khoản */}
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                }`}>Tài khoản *</label>
                            <input
                                type="text"
                                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                    }`}
                                value={newUser.username}
                                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                placeholder="Nhập tài khoản"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Mật khẩu */}
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                }`}>Mật khẩu *</label>
                            <input
                                type="password"
                                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                    }`}
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                placeholder="Nhập mật khẩu"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                }`}>Email *</label>
                            <input
                                type="email"
                                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                    }`}
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                placeholder="example@email.com"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Họ tên */}
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                }`}>Họ tên *</label>
                            <input
                                type="text"
                                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                    }`}
                                value={newUser.fullname}
                                onChange={(e) => setNewUser({ ...newUser, fullname: e.target.value })}
                                placeholder="Nhập họ tên"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Số điện thoại */}
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                }`}>Số điện thoại *</label>
                            <input
                                type="text"
                                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                    }`}
                                value={newUser.phoneNumber}
                                onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                                placeholder="0123456789"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Vai trò */}
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                }`}>Vai trò *</label>
                            <select
                                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all appearance-none cursor-pointer ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                                value={newUser.roles[0]}
                                onChange={(e) => setNewUser({ ...newUser, roles: [e.target.value] })}
                                disabled={loading}
                            >
                                <option value="ADMIN">Quản trị</option>
                                <option value="STAFF">Nhân viên</option>
                                <option value="USER">Khách</option>
                            </select>
                        </div>

                        {/* Trạng thái */}
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                }`}>Trạng thái *</label>
                            <select
                                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all appearance-none cursor-pointer ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                                value={newUser.status}
                                onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
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
                    <div className={`flex justify-end gap-3 pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                        <button
                            type="button"
                            className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 disabled:opacity-50 ${theme === 'dark' ? 'text-gray-200 bg-gray-700 hover:bg-gray-600' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                                }`}
                            onClick={onClose}
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg ${theme === 'dark' ? 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white' : 'bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white'
                                }`}
                            disabled={loading}
                        >
                            {loading ? 'Đang thêm...' : 'Thêm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;