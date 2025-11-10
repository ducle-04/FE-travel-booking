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
import { useTheme } from '../../context/ThemeContext';

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

const UserManagement: React.FC = () => {
    const { theme } = useTheme();
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
    const roles = JSON.parse(
        localStorage.getItem('jwtToken')
            ? localStorage.getItem('roles') || '[]'
            : sessionStorage.getItem('roles') || '[]'
    ) as string[];

    useEffect(() => {
        if (!token) {
            setError('Vui lòng đăng nhập để truy cập.');
            setTimeout(() => navigate('/login'), 1000);
            return;
        }

        if (!roles.includes('ADMIN') && !roles.includes('STAFF')) {
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
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, [token, navigate, selectedRole]);

    const handleViewUserDetails = async (username: string) => {
        if (!token) return;
        setLoading(true);
        try {
            const userData = await fetchUserDetails(token, username);
            setDetailUser(userData);
            setShowDetailUserModal(true);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        setLoading(true);
        try {
            const createdUser = await createUser(token, newUser);
            setUsers([...users, createdUser]);
            setShowAddUserModal(false);
        } finally {
            setLoading(false);
        }
    };

    const handleEditUser = async (payload: {
        fullname: string;
        phoneNumber: string;
        status: User['status'];
        role: string;
    }) => {
        if (!editUser || !token) return;
        setLoading(true);
        try {
            const updatedUser = await updateUser(token, editUser.username, payload);
            setUsers(users.map((u) => (u.id === editUser.id ? updatedUser : u)));
            setShowEditUserModal(false);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!token) return;
        setLoading(true);
        try {
            await deleteUser(token, id);
            setUsers(users.filter((u) => u.id !== id));
        } finally {
            setLoading(false);
        }
    };

    const handleChangeStatus = async (username: string, status: string) => {
        if (!token) return;
        setLoading(true);
        try {
            const updatedUser = await updateUserStatus(token, username, status);
            setUsers(users.map((u) => (u.username === username ? updatedUser : u)));
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter((u) => {
        const matchesSearch =
            u.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.username.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus ? u.status === selectedStatus : true;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
    const isAdmin = roles.includes('ADMIN');

    return (
        <div
            className={`w-full min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'
                }`}
        >
            <div
                className={`border-b p-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    }`}
            >
                <div className="flex items-center justify-between mb-3">
                    <h1 className="text-xl font-semibold">Quản lý tài khoản</h1>
                    {isAdmin && (
                        <div className="flex gap-2">
                            <button
                                className={`flex items-center gap-1 px-3 py-1 text-sm rounded-lg ${theme === 'dark'
                                    ? 'text-gray-200 bg-gray-800 hover:bg-gray-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                disabled={loading}
                            >
                                <Download size={16} />
                                Xuất dữ liệu
                            </button>
                            <button
                                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
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

            {error && <div className="p-4 text-red-500">{error}</div>}
            {loading && <div className="p-4 text-gray-400">Đang tải...</div>}

            <UserTable
                users={paginatedUsers}
                isAdmin={isAdmin}
                roles={roles}
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