import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, Download, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface User {
    id: number;
    username: string;
    email: string;
    fullname: string;
    phoneNumber: string;
    status: 'Hoạt động' | 'Không hoạt động' | 'Bị cấm' | 'Đã xóa';
    role: string; // Vai trò chính (USER, STAFF, ADMIN)
    createdAt: string;
}

interface StatusColor {
    [key: string]: string;
}

interface JwtPayload {
    sub: string;
    roles?: string[];
}

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage] = useState<number>(10);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
    const [showEditUserModal, setShowEditUserModal] = useState<boolean>(false);
    const [showDetailUserModal, setShowDetailUserModal] = useState<boolean>(false);
    const [newUser, setNewUser] = useState({
        username: '',
        password: '',
        email: '',
        fullname: '',
        phoneNumber: '',
        status: 'Hoạt động',
        roles: ['USER'],
    });
    const [editUser, setEditUser] = useState<User | null>(null);
    const [detailUser, setDetailUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Lấy token từ storage
    const token = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');

    // Decode JWT để kiểm tra vai trò
    const decodeJwt = (token: string): JwtPayload => {
        try {
            const base64Url = token.split('.')[1];
            if (!base64Url) {
                return { sub: '', roles: [] };
            }
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload) as JwtPayload;
        } catch (error) {
            console.warn('Không decode được token:', error);
            return { sub: '', roles: [] };
        }
    };

    // Kiểm tra quyền ADMIN hoặc STAFF và lấy danh sách tài khoản
    useEffect(() => {
        if (!token) {
            setError('Vui lòng đăng nhập để truy cập.');
            setTimeout(() => navigate('/login'), 1000);
            return;
        }
        const decoded = decodeJwt(token);
        if (!decoded.roles?.includes('ADMIN') && !decoded.roles?.includes('STAFF')) {
            setError('Bạn không có quyền truy cập trang này.');
            setTimeout(() => navigate('/'), 1000);
            return;
        }

        // Lấy danh sách tài khoản từ API
        const fetchUsers = async () => {
            setLoading(true);
            try {
                let fetchedUsers: User[] = [];
                let response;

                if (!selectedRole) {
                    // Gọi API lấy tất cả tài khoản
                    response = await fetch('http://localhost:8080/api/user/accounts/all', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                } else if (selectedRole === 'USER') {
                    // Gọi API lấy danh sách USER
                    response = await fetch('http://localhost:8080/api/user/all', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                } else if (selectedRole === 'STAFF') {
                    // Gọi API lấy danh sách STAFF
                    response = await fetch('http://localhost:8080/api/user/staff/all', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                } else if (selectedRole === 'ADMIN') {
                    // Gọi API lấy danh sách ADMIN
                    response = await fetch('http://localhost:8080/api/user/admin/all', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                }

                if (response?.status === 401 || response?.status === 403) {
                    setError('Phiên đăng nhập hết hạn hoặc không có quyền.');
                    setTimeout(() => navigate('/login'), 1000);
                    return;
                }
                if (!response?.ok) {
                    throw new Error('Không thể lấy danh sách tài khoản.');
                }
                const data = await response.json();
                fetchedUsers = data.map((user: any) => ({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    fullname: user.fullname,
                    phoneNumber: user.phoneNumber,
                    status: mapStatus(user.status),
                    role: user.roles[0] || selectedRole || 'USER',
                    createdAt: new Date(user.createdAt).toLocaleDateString('vi-VN'),
                }));

                setUsers(fetchedUsers);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [token, navigate, selectedRole]);

    // Xử lý xem chi tiết tài khoản
    const handleViewUserDetails = async (username: string) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/user/${username}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 401 || response.status === 403) {
                setError('Phiên đăng nhập hết hạn hoặc không có quyền.');
                setTimeout(() => navigate('/login'), 1000);
                return;
            }
            if (!response.ok) {
                throw new Error('Không thể lấy thông tin chi tiết tài khoản.');
            }
            const userData = await response.json();
            setDetailUser({
                id: userData.id,
                username: userData.username,
                email: userData.email,
                fullname: userData.fullname,
                phoneNumber: userData.phoneNumber,
                status: mapStatus(userData.status),
                role: userData.roles[0] || 'USER',
                createdAt: new Date(userData.createdAt).toLocaleDateString('vi-VN'),
            });
            setShowDetailUserModal(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Ánh xạ trạng thái từ backend sang tiếng Việt
    const mapStatus = (status: string): User['status'] => {
        switch (status) {
            case 'ACTIVE':
                return 'Hoạt động';
            case 'INACTIVE':
                return 'Không hoạt động';
            case 'BANNED':
                return 'Bị cấm';
            case 'DELETED':
                return 'Đã xóa';
            default:
                return 'Hoạt động';
        }
    };

    // Ánh xạ trạng thái ngược lại cho API
    const mapStatusToBackend = (status: string): string => {
        switch (status) {
            case 'Hoạt động':
                return 'ACTIVE';
            case 'Không hoạt động':
                return 'INACTIVE';
            case 'Bị cấm':
                return 'BANNED';
            case 'Đã xóa':
                return 'DELETED';
            default:
                return 'ACTIVE';
        }
    };

    const getStatusColor = (status: string): string => {
        const colors: StatusColor = {
            'Hoạt động': 'bg-green-500',
            'Không hoạt động': 'bg-gray-400',
            'Bị cấm': 'bg-red-500',
            'Đã xóa': 'bg-slate-800',
        };
        return colors[status] || 'bg-gray-400';
    };

    const getAvatarColor = (index: number): string => {
        const colors: string[] = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500', 'bg-red-500', 'bg-green-500'];
        return colors[index % colors.length];
    };

    // Logic tìm kiếm và lọc trạng thái
    const filteredUsers = users.filter((user) => {
        const matchesSearch = user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus ? user.status === selectedStatus : true;
        return matchesSearch && matchesStatus;
    });

    const totalPages: number = Math.ceil(filteredUsers.length / rowsPerPage);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    // Xử lý thêm tài khoản (chỉ cho ADMIN)
    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/user/create', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...newUser,
                    status: mapStatusToBackend(newUser.status),
                }),
            });
            if (response.status === 401 || response.status === 403) {
                setError('Phiên đăng nhập hết hạn hoặc không có quyền.');
                setTimeout(() => navigate('/login'), 1000);
                return;
            }
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Không thể tạo tài khoản.');
            }
            const createdUser = await response.json();
            setUsers([
                ...users,
                {
                    id: createdUser.id,
                    username: createdUser.username,
                    email: createdUser.email,
                    fullname: createdUser.fullname,
                    phoneNumber: createdUser.phoneNumber,
                    status: mapStatus(createdUser.status),
                    role: createdUser.roles[0] || 'USER',
                    createdAt: new Date(createdUser.createdAt).toLocaleDateString('vi-VN'),
                },
            ]);
            setShowAddUserModal(false);
            setNewUser({ username: '', password: '', email: '', fullname: '', phoneNumber: '', status: 'Hoạt động', roles: ['USER'] });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Xử lý chỉnh sửa tài khoản (chỉ cho ADMIN)
    const handleEditUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editUser) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/user/staff/update/${editUser.username}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: editUser.username,
                    email: editUser.email,
                    fullname: editUser.fullname,
                    phoneNumber: editUser.phoneNumber,
                    status: mapStatusToBackend(editUser.status),
                    roles: [editUser.role],
                }),
            });
            if (response.status === 401 || response.status === 403) {
                setError('Phiên đăng nhập hết hạn hoặc không có quyền.');
                setTimeout(() => navigate('/login'), 1000);
                return;
            }
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Không thể cập nhật tài khoản.');
            }
            const updatedUser = await response.json();
            setUsers(users.map((user) =>
                user.id === editUser.id
                    ? {
                        ...user,
                        email: updatedUser.email,
                        fullname: updatedUser.fullname,
                        phoneNumber: updatedUser.phoneNumber,
                        status: mapStatus(updatedUser.status),
                        role: updatedUser.roles[0] || user.role,
                    }
                    : user
            ));
            setShowEditUserModal(false);
            setEditUser(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Xử lý xóa tài khoản (chỉ cho ADMIN)
    const handleDeleteUser = async (id: number, username: string) => {
        if (!window.confirm(`Bạn có chắc muốn xóa tài khoản ${username}?`)) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/user/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 401 || response.status === 403) {
                setError('Phiên đăng nhập hết hạn hoặc không có quyền.');
                setTimeout(() => navigate('/login'), 1000);
                return;
            }
            if (!response.ok) {
                throw new Error('Không thể xóa tài khoản.');
            }
            setUsers(users.filter((user) => user.id !== id));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Xử lý cập nhật trạng thái (chỉ cho ADMIN)
    const handleChangeStatus = async (username: string, status: string) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/user/status/${username}?status=${mapStatusToBackend(status)}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 401 || response.status === 403) {
                setError('Phiên đăng nhập hết hạn hoặc không có quyền.');
                setTimeout(() => navigate('/login'), 1000);
                return;
            }
            if (!response.ok) {
                throw new Error('Không thể cập nhật trạng thái.');
            }
            const updatedUser = await response.json();
            setUsers(users.map((user) =>
                user.username === username
                    ? { ...user, status: mapStatus(updatedUser.status) }
                    : user
            ));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Kiểm tra vai trò người dùng hiện tại
    const decoded = token ? decodeJwt(token) : { roles: [] };
    const isAdmin = decoded.roles?.includes('ADMIN');

    return (
        <div className="w-full bg-white">
            {/* Header */}
            <div className="border-b border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                    <h1 className="text-xl font-semibold text-gray-800">Quản lý tài khoản</h1>
                    {isAdmin && (
                        <div className="flex gap-2">
                            <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                                <Download size={16} />
                                Xuất dữ liệu
                            </button>
                            <button
                                className="flex items-center gap-1 px-3 py-1 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700"
                                onClick={() => setShowAddUserModal(true)}
                                disabled={loading}
                            >
                                <Plus size={16} />
                                Thêm tài khoản
                            </button>
                        </div>
                    )}
                </div>

                {/* Filters */}
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
                            className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 appearance-none"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            <option value="">Tất cả vai trò</option>
                            <option value="ADMIN">Quản trị</option>
                            <option value="STAFF">Nhân viên</option>
                            <option value="USER">Khách</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-2 top-2.5 text-gray-700" />
                    </div>
                    <div className="relative">
                        <select
                            className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 appearance-none"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="Hoạt động">Hoạt động</option>
                            <option value="Không hoạt động">Không hoạt động</option>
                            <option value="Bị cấm">Bị cấm</option>
                            <option value="Đã xóa">Đã xóa</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-2 top-2.5 text-gray-700" />
                    </div>
                </div>
            </div>

            {/* Hiển thị lỗi */}
            {error && (
                <div className="p-4 text-red-600 text-sm">{error}</div>
            )}

            {/* Hiển thị loading */}
            {loading && (
                <div className="p-4 text-gray-600 text-sm">Đang tải...</div>
            )}

            {/* Modal thêm tài khoản (chỉ cho ADMIN) */}
            {showAddUserModal && isAdmin && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-5 rounded-lg w-112">
                        <h2 className="text-lg font-semibold mb-3">Thêm tài khoản mới</h2>
                        <form onSubmit={handleAddUser}>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Tài khoản</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                                <input
                                    type="password"
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                                    value={newUser.fullname}
                                    onChange={(e) => setNewUser({ ...newUser, fullname: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                                    value={newUser.phoneNumber}
                                    onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                                <select
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                                    value={newUser.roles[0]}
                                    onChange={(e) => setNewUser({ ...newUser, roles: [e.target.value] })}
                                >
                                    <option value="ADMIN">Quản trị</option>
                                    <option value="STAFF">Nhân viên</option>
                                    <option value="USER">Khách</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                                <select
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                                    value={newUser.status}
                                    onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                                >
                                    <option value="Hoạt động">Hoạt động</option>
                                    <option value="Không hoạt động">Không hoạt động</option>
                                    <option value="Bị cấm">Bị cấm</option>
                                    <option value="Đã xóa">Đã xóa</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                                    onClick={() => setShowAddUserModal(false)}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-3 py-1.5 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700"
                                    disabled={loading}
                                >
                                    Thêm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal chỉnh sửa tài khoản (chỉ cho ADMIN) */}
            {showEditUserModal && isAdmin && editUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-5 rounded-lg w-112">
                        <h2 className="text-lg font-semibold mb-3">Chỉnh sửa tài khoản</h2>
                        <form onSubmit={handleEditUser}>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Tài khoản</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-gray-100"
                                    value={editUser.username}
                                    disabled
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                                    value={editUser.email}
                                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                                    value={editUser.fullname}
                                    onChange={(e) => setEditUser({ ...editUser, fullname: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                                    value={editUser.phoneNumber}
                                    onChange={(e) => setEditUser({ ...editUser, phoneNumber: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                                <select
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                                    value={editUser.role}
                                    onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                                >
                                    <option value="STAFF">Nhân viên</option>
                                    <option value="USER">Khách</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                                <select
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                                    value={editUser.status}
                                    onChange={(e) => setEditUser({ ...editUser, status: e.target.value })}
                                >
                                    <option value="Hoạt động">Hoạt động</option>
                                    <option value="Không hoạt động">Không hoạt động</option>
                                    <option value="Bị cấm">Bị cấm</option>
                                    <option value="Đã xóa">Đã xóa</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                                    onClick={() => setShowEditUserModal(false)}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-3 py-1.5 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700"
                                    disabled={loading}
                                >
                                    Lưu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal xem chi tiết tài khoản */}
            {showDetailUserModal && detailUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-5 rounded-lg w-112">
                        <h2 className="text-lg font-semibold mb-3">Chi tiết tài khoản</h2>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">Tài khoản</label>
                            <input
                                type="text"
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-gray-100"
                                value={detailUser.username}
                                disabled
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-gray-100"
                                value={detailUser.email}
                                disabled
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                            <input
                                type="text"
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-gray-100"
                                value={detailUser.fullname}
                                disabled
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                            <input
                                type="text"
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-gray-100"
                                value={detailUser.phoneNumber}
                                disabled
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                            <input
                                type="text"
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-gray-100"
                                value={detailUser.role === 'USER' ? 'Khách' : detailUser.role === 'STAFF' ? 'Nhân viên' : 'Quản trị'}
                                disabled
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                            <input
                                type="text"
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-gray-100"
                                value={detailUser.status}
                                disabled
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">Ngày tạo</label>
                            <input
                                type="text"
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-gray-100"
                                value={detailUser.createdAt}
                                disabled
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                                onClick={() => setShowDetailUserModal(false)}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-800 text-white text-sm">
                        <tr>
                            <th className="px-4 py-2 text-left">
                                <input type="checkbox" className="w-4 h-4 rounded" />
                            </th>
                            <th className="px-4 py-2 text-left font-semibold min-w-[120px]">Họ tên</th>
                            <th className="px-4 py-2 text-left font-semibold min-w-[180px]">Email</th>
                            <th className="px-4 py-2 text-left font-semibold min-w-[100px]">Tài khoản</th>
                            <th className="px-4 py-2 text-left font-semibold min-w-[100px]">Số điện thoại</th>
                            <th className="px-4 py-2 text-left font-semibold min-w-[100px]">Trạng thái</th>
                            <th className="px-4 py-2 text-left font-semibold min-w-[80px]">Vai trò</th>
                            <th className="px-4 py-2 text-left font-semibold min-w-[100px]">Ngày tạo</th>
                            <th className="px-4 py-2 text-left font-semibold min-w-[120px]">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.map((user, index) => (
                            <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <input type="checkbox" className="w-4 h-4 rounded" />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-full ${getAvatarColor(index)} flex items-center justify-center text-white text-sm font-semibold`}>
                                            {user.fullname.charAt(0)}
                                        </div>
                                        <span className="text-gray-800 text-sm font-medium truncate">{user.fullname}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-gray-600 text-sm truncate">{user.email}</td>
                                <td className="px-4 py-3 text-gray-600 text-sm truncate">{user.username}</td>
                                <td className="px-4 py-3 text-gray-600 text-sm">{user.phoneNumber}</td>
                                <td className="px-4 py-3">
                                    <select
                                        className={`px-2 py-1 rounded-full text-white text-xs font-medium ${getStatusColor(user.status)} whitespace-nowrap`}
                                        value={user.status}
                                        onChange={(e) => handleChangeStatus(user.username, e.target.value)}
                                        disabled={loading || !isAdmin || user.role === 'ADMIN'} // STAFF và ADMIN không thể thay đổi trạng thái
                                    >
                                        <option value="Hoạt động">Hoạt động</option>
                                        <option value="Không hoạt động">Không hoạt động</option>
                                        <option value="Bị cấm">Bị cấm</option>
                                        <option value="Đã xóa">Đã xóa</option>
                                    </select>
                                </td>
                                <td className="px-4 py-3 text-gray-600 text-sm">{user.role === 'USER' ? 'Khách' : user.role === 'STAFF' ? 'Nhân viên' : 'Quản trị'}</td>
                                <td className="px-4 py-3 text-gray-600 text-sm">{user.createdAt}</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1">
                                        <button
                                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded"
                                            onClick={() => handleViewUserDetails(user.username)}
                                            disabled={loading}
                                        >
                                            <Eye size={14} />
                                        </button>
                                        {isAdmin && user.role !== 'USER' && user.role !== 'ADMIN' && (
                                            <button
                                                className="p-1.5 text-gray-600 hover:bg-gray-200 rounded"
                                                onClick={() => {
                                                    setEditUser(user);
                                                    setShowEditUserModal(true);
                                                }}
                                                disabled={loading}
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                        )}
                                        {isAdmin && user.role !== 'ADMIN' && (
                                            <button
                                                className="p-1.5 text-red-600 hover:bg-red-100 rounded"
                                                onClick={() => handleDeleteUser(user.id, user.username)}
                                                disabled={loading}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Hàng mỗi trang</span>
                    <button className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                        10 <ChevronDown size={14} />
                    </button>
                    <span className="text-sm text-gray-600">của {filteredUsers.length} hàng</span>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1 || loading}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1 || loading}
                    >
                        &laquo;
                    </button>
                    {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-7 h-7 rounded flex items-center justify-center text-sm ${currentPage === page ? 'bg-slate-800 text-white' : 'text-gray-600 hover:bg-gray-100'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {page}
                        </button>
                    ))}
                    {totalPages > 3 && (
                        <>
                            <span className="px-1 text-gray-600 text-sm">...</span>
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                className={`w-7 h-7 rounded flex items-center justify-center text-sm text-gray-600 hover:bg-gray-100 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={loading}
                            >
                                {totalPages}
                            </button>
                        </>
                    )}
                    <button
                        className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || loading}
                    >
                        <ChevronRight size={16} />
                    </button>
                    <button
                        className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages || loading}
                    >
                        &raquo;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;