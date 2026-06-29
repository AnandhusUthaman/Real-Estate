import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Search,
  UserCheck,
  Award
} from 'lucide-react';

export default function AdminUsers({ users }) {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  React.useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const userId = urlParams.get('id');
    if (userId) {
      setTimeout(() => {
        const element = document.getElementById(`user-row-${userId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('bg-accent-gold/15');
          setTimeout(() => {
            element.classList.remove('bg-accent-gold/15');
          }, 3000);
        }
      }, 300);
    }
  }, [location.search]);

  // Filter users
  const filteredUsers = users.filter((u) => {
    return searchQuery
      ? u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
  });

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-[18px] border border-neutral-laurel/20 p-6 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-grow max-w-md w-full">
          <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-neutral-laurel" />
          <input
            type="text"
            placeholder="Search users by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-bg-cream border border-neutral-laurel/10 rounded-[12px] text-sm pl-11 pr-4 py-2.5 w-full focus:outline-none focus:ring-1 focus:ring-accent-gold/40 text-primary"
          />
        </div>
        <div className="text-xs font-sans text-neutral-laurel font-bold uppercase tracking-wider">
          Total Directory: {users.length} Users
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[18px] border border-neutral-laurel/20 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-sm text-primary">
            <thead>
              <tr className="bg-primary/5 text-neutral-laurel text-[10px] tracking-widest uppercase font-bold border-b border-neutral-laurel/20">
                <th className="py-4 px-6">User details</th>
                <th className="py-4 px-6">Email Address</th>
                <th className="py-4 px-6">Role / Privilege</th>
                <th className="py-4 px-6">Joined Date</th>
                <th className="py-4 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-laurel/10">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-neutral-laurel">
                    No users match your search description.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} id={`user-row-${u.id}`} className="hover:bg-primary/5 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center font-bold text-xs border border-accent-gold/25">
                          {u.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <div className="font-bold text-primary text-sm">{u.name}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-neutral-laurel font-mono">{u.email}</td>
                    <td className="py-4 px-6 font-semibold">
                      <span className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-[4px] ${
                        u.role.toLowerCase() === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-primary/5 text-primary'
                      }`}>
                        {u.role.toLowerCase() === 'admin' ? <Award className="w-3 h-3 text-amber-700" /> : <UserCheck className="w-3 h-3" />}
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-neutral-laurel font-semibold">{u.joined}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2.5 py-0.5 rounded-[50px] text-[10px] font-bold uppercase tracking-wider ${
                        u.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
