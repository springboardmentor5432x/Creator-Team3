import React, { useState } from 'react';
import { Users, UserPlus, Shield, Mail, Trash2, CheckCircle, Lock as LockIcon, RefreshCw } from 'lucide-react';

const initialMembers = [
  {
    id: 1,
    name: 'Mukesh Kumar',
    email: 'mukesh@creatoriq.app',
    role: 'Admin / Owner',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  },
  {
    id: 2,
    name: 'Sandhya Sharma',
    email: 'sandhya@creatoriq.app',
    role: 'Lead Analyst',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  },
  {
    id: 3,
    name: 'Lohitha R',
    email: 'lohitha@creatoriq.app',
    role: 'Content Manager',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
  },
  {
    id: 4,
    name: 'Chandan Kumar',
    email: 'chandan@creatoriq.app',
    role: 'Financial Editor',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  }
];

export default function TeamWorkspaceView({ token }) {
  const [members, setMembers] = useState(initialMembers);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Editor');
  const [statusNotice, setStatusNotice] = useState('');

  const handleInvite = (e) => {
    e.preventDefault();
    if (!newEmail) return;

    const newMember = {
      id: Date.now(),
      name: newEmail.split('@')[0],
      email: newEmail,
      role: newRole,
      status: 'Pending Invite',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    };

    setMembers([...members, newMember]);
    setNewEmail('');
    setShowInviteModal(false);
    setStatusNotice(`Invitation link successfully sent to ${newEmail}`);
    setTimeout(() => setStatusNotice(''), 4000);
  };

  const handleRemoveMember = (id) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const handleRoleChange = (id, role) => {
    setMembers(members.map(m => m.id === id ? { ...m, role } : m));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={24} color="var(--accent-primary)" />
            Team Workspace & Access Management
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>
            Manage team members, assign workspace permission roles, and invite co-creators
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowInviteModal(true)}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            background: 'var(--accent-primary)',
            color: '#ffffff',
            border: 'none',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <UserPlus size={16} />
          Invite Team Member
        </button>
      </div>

      {statusNotice && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '10px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#10b981',
          fontSize: '13px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle size={16} />
          {statusNotice}
        </div>
      )}

      {/* Team Members List Table */}
      <div className="theme-card" style={{ padding: '22px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
          Active Workspace Members ({members.length})
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-primary)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 12px' }}>Member</th>
                <th style={{ padding: '10px 12px' }}>Email</th>
                <th style={{ padding: '10px 12px' }}>Role</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                  <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={m.avatar} alt={m.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{m.name}</span>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{m.email}</td>
                  <td style={{ padding: '12px' }}>
                    <select
                      value={m.role}
                      onChange={(e) => handleRoleChange(m.id, e.target.value)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-primary)',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                        fontWeight: 600
                      }}
                    >
                      <option>Admin / Owner</option>
                      <option>Lead Analyst</option>
                      <option>Content Manager</option>
                      <option>Financial Editor</option>
                      <option>Editor</option>
                      <option>Viewer</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '12px',
                      background: m.status === 'Active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: m.status === 'Active' ? '#10b981' : '#f59e0b'
                    }}>
                      ● {m.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {m.role !== 'Admin / Owner' ? (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(m.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                        title="Remove member"
                      >
                        <Trash2 size={16} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'default',
                          padding: '4px'
                        }}
                        title="Remove member"
                      >
                        <LockIcon size={20} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="theme-card" style={{ width: '90%', maxWidth: '440px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Invite Team Member
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--text-muted)' }}>
              Send an email invitation to grant access to this workspace
            </p>

            <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="colleague@domain.com"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Role Permission
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                >
                  <option>Editor</option>
                  <option>Lead Analyst</option>
                  <option>Content Manager</option>
                  <option>Financial Editor</option>
                  <option>Viewer</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: '1px solid var(--border-primary)',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    background: 'var(--accent-primary)',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
