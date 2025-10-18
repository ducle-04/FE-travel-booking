import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Plus } from 'lucide-react';
import UserTable from '../../components/Layout/DefautLayout/AdminLayout/UserManagement/UserTable';
import UserFilters from '../../components/Layout/DefautLayout/AdminLayout/UserManagement/UserFilters';
import AddUserModal from '../../components/Layout/DefautLayout/AdminLayout/UserManagement/AddUserModal';
import EditUserModal from '../../components/Layout/DefautLayout/AdminLayout/UserManagement/EditUserModal';
import DetailUserModal from '../../components/Layout/DefautLayout/AdminLayout/UserManagement/DetailUserModal';
import Pagination from '../../components/Layout/DefautLayout/AdminLayout/UserManagement/Pagination';
import { fetchUsers, fetchUserDetails, createUser, updateUser, deleteUser, updateUserStatus } from '../../services/userService';

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
    const [newUser, setNewUser] = useState<{
        username: string;
        password: string;
        email: string;
        fullname: string;
        phoneNumber: string;
        status: User['status'];
        roles: string[];
    }>({
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

    const token = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');

    const decodeJwt = (token: string): JwtPayload => {
        try {
            const base64Url = token.split('.')[1];
            if (!base64Url) return { sub: '', roles: [] };
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

        const loadUsers = async () => {
            setLoading(true);
            try {
                const fetchedUsers = await fetchUsers(token as string, selectedRole);
                setUsers(fetchedUsers);
            } catch (err: any) {
                setError(err.message);
                if (err.message.includes('Phiên đăng nhập hết hạn') || err.message.includes('không có quyền')) {
                    setTimeout(() => navigate('/login'), 1000);
                }
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, [token, navigate, selectedRole]);

    const handleViewUserDetails = async (username: string) => {
        if (!token) {
            setError('Vui lòng đăng nhập để truy cập.');
            setTimeout(() => navigate('/login'), 1000);
            return;
        }
        setLoading(true);
        try {
            const userData = await fetchUserDetails(token as string, username);
            setDetailUser(userData);
            setShowDetailUserModal(true);
        } catch (err: any) {
            setError(err.message);
            if (err.message.includes('Phiên đăng nhập hết hạn') || err.message.includes('không có quyền')) {
                setTimeout(() => navigate('/login'), 1000);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            setError('Vui lòng đăng nhập để truy cập.');
            setTimeout(() => navigate('/login'), 1000);
            return;
        }
        setLoading(true);
        try {
            const createdUser = await createUser(token as string, newUser);
            setUsers([...users, createdUser]);
            setShowAddUserModal(false);
            setNewUser({
                username: '',
                password: '',
                email: '',
                fullname: '',
                phoneNumber: '',
                status: 'Hoạt động',
                roles: ['USER'],
            });
        } catch (err: any) {
            setError(err.message);
            if (err.message.includes('Phiên đăng nhập hết hạn') || err.message.includes('không có quyền')) {
                setTimeout(() => navigate('/login'), 1000);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEditUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editUser || !token) {
            setError('Vui lòng đăng nhập để truy cập.');
            setTimeout(() => navigate('/login'), 1000);
            return;
        }
        setLoading(true);
        try {
            const updatedUser = await updateUser(token as string, editUser.username, editUser);
            setUsers(
                users.map((user) =>
                    user.id === editUser.id ? updatedUser : user
                )
            );
            setShowEditUserModal(false);
            setEditUser(null);
        } catch (err: any) {
            setError(err.message);
            if (err.message.includes('Phiên đăng nhập hết hạn') || err.message.includes('không có quyền')) {
                setTimeout(() => navigate('/login'), 1000);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id: number, username: string) => {
        if (!window.confirm(`Bạn có chắc muốn xóa tài khoản ${username}?`)) return;
        if (!token) {
            setError('Vui lòng đăng nhập để truy cập.');
            setTimeout(() => navigate('/login'), 1000);
            return;
        }
        setLoading(true);
        try {
            await deleteUser(token as string, id);
            setUsers(users.filter((user) => user.id !== id));
        } catch (err: any) {
            setError(err.message);
            if (err.message.includes('Phiên đăng nhập hết hạn') || err.message.includes('không có quyền')) {
                setTimeout(() => navigate('/login'), 1000);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChangeStatus = async (username: string, status: string) => {
        if (!token) {
            setError('Vui lòng đăng nhập để truy cập.');
            setTimeout(() => navigate('/login'), 1000);
            return;
        }
        setLoading(true);
        try {
            const updatedUser = await updateUserStatus(token as string, username, status);
            setUsers(
                users.map((user) =>
                    user.username === username ? updatedUser : user
                )
            );
        } catch (err: any) {
            setError(err.message);
            if (err.message.includes('Phiên đăng nhập hết hạn') || err.message.includes('không có quyền')) {
                setTimeout(() => navigate('/login'), 1000);
            }
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus ? user.status === selectedStatus : true;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const isAdmin = token ? (decodeJwt(token).roles?.includes('ADMIN') ?? false) : false;

    return (
        <div className="w-full bg-white">
            <div className="border-b border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                    <h1 className="text-xl font-semibold text-gray-800">Quản lý tài khoản</h1>
                    {isAdmin && (
                        <div className="flex gap-2">
                            <button
                                className="flex items-center gap-1 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                                disabled={loading}
                            >
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
                <UserFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedRole={selectedRole}
                    setSelectedRole={setSelectedRole}
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                />
            </div>
            {error && <div className="p-4 text-red-600 text-sm">{error}</div>}
            {loading && <div className="p-4 text-gray-600 text-sm">Đang tải...</div>}
            <UserTable
                users={paginatedUsers}
                isAdmin={isAdmin}
                loading={loading}
                onViewDetails={handleViewUserDetails}
                onEditUser={setEditUser}
                onDeleteUser={handleDeleteUser}
                onChangeStatus={handleChangeStatus}
                setShowEditUserModal={setShowEditUserModal}
            />
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                loading={loading}
                filteredUsersLength={filteredUsers.length}
            />
            {showAddUserModal && isAdmin && (
                <AddUserModal
                    newUser={newUser}
                    setNewUser={setNewUser}
                    onAddUser={handleAddUser}
                    onClose={() => setShowAddUserModal(false)}
                    loading={loading}
                />
            )}
            {showEditUserModal && isAdmin && editUser && (
                <EditUserModal
                    editUser={editUser}
                    setEditUser={setEditUser}
                    onEditUser={handleEditUser}
                    onClose={() => setShowEditUserModal(false)}
                    loading={loading}
                />
            )}
            {showDetailUserModal && detailUser && (
                <DetailUserModal user={detailUser} onClose={() => setShowDetailUserModal(false)} />
            )}
        </div>
    );
};

export default UserManagement;