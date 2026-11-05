import React, { useState, useEffect } from 'react';
import { mockStorage, STORAGE_KEYS } from '../../services/api/mockStorage';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Modal } from '../../components/common/Modal';
import { ROLES } from '../../utils/constants';
import { Users, Plus, ShieldCheck, Mail, Phone } from 'lucide-react';

export function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ROLES.DISPATCHER,
    title: 'Operations Member',
    phone: ''
  });

  const fetchUsers = () => {
    setUsers(mockStorage.get(STORAGE_KEYS.USERS));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const list = mockStorage.get(STORAGE_KEYS.USERS);
    const newUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      title: formData.title,
      status: 'Active',
      phone: formData.phone || '+1 (555) 000-0000',
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };

    list.unshift(newUser);
    mockStorage.set(STORAGE_KEYS.USERS, list);
    setModalOpen(false);
    fetchUsers();
  };

  const handleChangeRole = (userId, newRole) => {
    const list = mockStorage.get(STORAGE_KEYS.USERS);
    const u = list.find(item => item.id === userId);
    if (u) {
      u.role = newRole;
      mockStorage.set(STORAGE_KEYS.USERS, list);
      fetchUsers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            User Accounts & Role Permissions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure Role-Based Access Control (RBAC) across Driver, Dispatcher, Manager, and Admin roles.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setModalOpen(true)}
        >
          Add User
        </Button>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-850/75 text-slate-500 uppercase font-semibold">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Role Permission</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Change Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{u.name}</span>
                        <span className="text-[11px] text-slate-400">{u.title}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    <div>{u.email}</div>
                    <div className="text-[10px] text-slate-400">{u.phone}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={u.role === ROLES.ADMIN ? 'Normal' : u.role === ROLES.MANAGER ? 'In Transit' : 'Available'} size="sm">
                      {u.role.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-emerald-600">Active</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={u.role}
                      onChange={(e) => handleChangeRole(u.id, e.target.value)}
                      className="px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium"
                    >
                      <option value={ROLES.MANAGER}>Manager</option>
                      <option value={ROLES.DISPATCHER}>Dispatcher</option>
                      <option value={ROLES.DRIVER}>Driver</option>
                      <option value={ROLES.ADMIN}>Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add System User"
        maxWidth="max-w-md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreate}>Save User</Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <Input
            label="Full Name"
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Rachel Adams"
          />

          <Input
            label="Work Email"
            type="email"
            required
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            placeholder="e.g. rachel@fleetflow.io"
          />

          <Select
            label="Assigned Role"
            value={formData.role}
            onChange={e => setFormData({ ...formData, role: e.target.value })}
            options={[ROLES.MANAGER, ROLES.DISPATCHER, ROLES.DRIVER, ROLES.ADMIN]}
          />

          <Input
            label="Designation / Title"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Terminal Supervisor"
          />
        </form>
      </Modal>
    </div>
  );
}
