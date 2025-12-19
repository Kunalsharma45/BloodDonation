import { useState, useEffect } from "react";
import adminApi from "../../api/adminApi";
import { toast } from "sonner";
import { Search, Filter, Plus, Settings, Trash2 } from "lucide-react";

const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchUsers();
        }, 300); // Debounce search
        return () => clearTimeout(timeoutId);
    }, [page, search, roleFilter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = { page, limit: 10 };
            if (search) params.search = search;
            if (roleFilter !== "ALL") params.role = roleFilter;

            const res = await adminApi.getUsers(params);
            setUsers(res.items || []);
            setTotal(res.total || 0);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleBlockUnblock = async (id, currentStatus) => {
        const action = currentStatus === 'BLOCKED' ? 'unblock' : 'block';
        if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

        try {
            if (action === 'block') {
                await adminApi.blockUser(id);
            } else {
                await adminApi.unblockUser(id);
            }
            toast.success(`User ${action}ed successfully`);
            fetchUsers();
        } catch (err) {
            console.error(err);
            toast.error(`Failed to ${action} user`);
        }
    };

    const handleDelete = async (id, userName) => {
        if (!window.confirm(`⚠️ Are you sure you want to DELETE user "${userName}"?\n\nThis action CANNOT be undone!`)) return;

        try {
            await adminApi.deleteUser(id);
            toast.success(`User deleted successfully`);
            fetchUsers();
        } catch (err) {
            console.error(err);
            toast.error(`Failed to delete user`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">
                            User Management
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage donors, volunteers and admins.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <input
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                placeholder="Search users..."
                                className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm w-64 transition-all"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                            <Plus className="w-4 h-4" /> Add User
                        </button>
                    </div>
                </div>
            </section>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    User Profile
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Verification
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3"></div>
                                            <p>Loading users...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            ) : users.map((u) => (
                                <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                                {u.Name?.split(" ").map(n => n[0]).slice(0, 2).join("") || "U"}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm text-gray-900">{u.Name}</p>
                                                <p className="text-xs text-gray-400">{u.Email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                            {u.Role === "Admin" && <Settings className="w-3 h-3" />}
                                            {u.Role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${u.accountStatus === 'BLOCKED'
                                            ? 'bg-red-100 text-red-700 border-red-200'
                                            : 'bg-green-100 text-green-700 border-green-200'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${u.accountStatus === 'BLOCKED' ? 'bg-red-500' : 'bg-green-500'
                                                }`}></span>
                                            {u.accountStatus || 'ACTIVE'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${u.verificationStatus === 'APPROVED' ? 'bg-green-100 text-green-700 border-green-200' :
                                            u.verificationStatus === 'REJECTED' ? 'bg-red-100 text-red-700 border-red-200' :
                                                'bg-yellow-100 text-yellow-700 border-yellow-200'
                                            }`}>
                                            {u.verificationStatus || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleBlockUnblock(u._id, u.accountStatus)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm ${u.accountStatus === 'BLOCKED'
                                                    ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 hover:shadow'
                                                    : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 hover:shadow'
                                                    }`}
                                            >
                                                {u.accountStatus === 'BLOCKED' ? 'Unblock' : 'Block'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(u._id, u.Name)}
                                                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-200"
                                                title="Delete user"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                    <span className="text-sm text-gray-500">
                        Showing <span className="font-bold text-gray-900">{users.length}</span> of{" "}
                        <span className="font-bold text-gray-900">{total}</span> users
                    </span>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        <span className="px-3 py-1.5 text-sm font-medium text-gray-700 flex items-center">
                            Page {page}
                        </span>
                        <button
                            disabled={users.length < 10}
                            onClick={() => setPage(p => p + 1)}
                            className="px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsersTable;
