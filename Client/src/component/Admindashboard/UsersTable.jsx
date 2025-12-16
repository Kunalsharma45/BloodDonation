import { useState, useEffect } from "react";
import adminApi from "../../api/adminApi";
import { toast } from "sonner";
import { Search, Filter } from "lucide-react";

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
                await adminApi.manageUser(id, 'block');
            } else {
                await adminApi.manageUser(id, 'unblock');
            }
            toast.success(`User ${action}ed successfully`);
            fetchUsers();
        } catch (err) {
            console.error(err);
            toast.error(`Failed to ${action} user`);
        }
    };

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">All Users ({total})</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="text-left text-gray-500 border-b">
                        <tr>
                            <th className="py-3 px-2">Name</th>
                            <th className="py-3 px-2">Email</th>
                            <th className="py-3 px-2">Role</th>
                            <th className="py-3 px-2">Status</th>
                            <th className="py-3 px-2">Verification</th>
                            <th className="py-3 px-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className="py-4 text-center">Loading...</td></tr>
                        ) : users.map((u) => (
                            <tr key={u._id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-2 font-medium text-gray-800">{u.Name}</td>
                                <td className="py-3 px-2 text-gray-600">{u.Email}</td>
                                <td className="py-3 px-2">
                                    <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                                        {u.Role}
                                    </span>
                                </td>
                                <td className="py-3 px-2">
                                    <span className={`px-2 py-0.5 rounded text-xs ${u.accountStatus === 'BLOCKED' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                        {u.accountStatus || 'ACTIVE'}
                                    </span>
                                </td>
                                <td className="py-3 px-2">
                                    <span className={`px-2 py-0.5 rounded text-xs ${u.verificationStatus === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                        u.verificationStatus === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {u.verificationStatus || 'N/A'}
                                    </span>
                                </td>
                                <td className="py-3 px-2">
                                    {u.accountStatus !== 'BLOCKED' && (
                                        <button
                                            onClick={() => blockUser(u._id)}
                                            className="text-red-500 hover:text-red-700 text-xs font-medium"
                                        >
                                            Block
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Simple Pagination */}
            <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span>Page {page}</span>
                <button
                    disabled={users.length < 20}
                    onClick={() => setPage(p => p + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default UsersTable;
