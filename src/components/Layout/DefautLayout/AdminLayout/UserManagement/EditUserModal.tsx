import React from 'react';
import { X } from 'lucide-react';

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
    onEditUser: (e: React.FormEvent) => void;
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
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-slate-700 to-slate-800 text-white px-6 py-4 flex items-center justify-between border-b-2 border-slate-900">
                    <h2 className="text-xl font-bold">Chỉnh sửa tài khoản</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-slate-600 rounded-lg transition-colors"
                        disabled={loading}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={onEditUser} className="p-6">
                    <div className="grid grid-cols-2 gap-5 mb-6">
                        {/* Tài khoản (Disabled) */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Tài khoản</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-600 cursor-not-allowed"
                                value={editUser.username}
                                disabled
                            />
                            <p className="text-xs text-gray-500 mt-1">Không thể thay đổi</p>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                                value={editUser.email}
                                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                placeholder="example@email.com"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Họ tên */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Họ tên *</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                                value={editUser.fullname}
                                onChange={(e) => setEditUser({ ...editUser, fullname: e.target.value })}
                                placeholder="Nhập họ tên"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Số điện thoại */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại *</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                                value={editUser.phoneNumber}
                                onChange={(e) => setEditUser({ ...editUser, phoneNumber: e.target.value })}
                                placeholder="0123456789"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Vai trò */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Vai trò *</label>
                            <select
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all appearance-none cursor-pointer bg-white"
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
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái *</label>
                            <select
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all appearance-none cursor-pointer bg-white"
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
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-150 disabled:opacity-50"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-gradient-to-r from-slate-700 to-slate-800 text-white text-sm font-medium rounded-lg hover:from-slate-600 hover:to-slate-700 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
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