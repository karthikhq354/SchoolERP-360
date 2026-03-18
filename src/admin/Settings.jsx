import React, { useState, useEffect, useRef } from 'react';
import {
  User, Mail, Phone, Lock, Eye, EyeOff,
  Bell, Moon, Sun, Shield, Save, CheckCircle,
  AlertCircle, Camera, Trash2, Download, RefreshCw,
  Globe, Clock, Database, Key, ChevronRight,
  LogOut, XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error:   'bg-red-50 border-red-200 text-red-700',
    info:    'bg-blue-50 border-blue-200 text-blue-700',
  };
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />,
    error:   <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />,
    info:    <Bell className="w-5 h-5 text-blue-500 flex-shrink-0" />,
  };

  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl border shadow-lg animate-fade-in-up ${colors[type]}`}>
      {icons[type]}
      <span className="text-sm font-semibold">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
        <XCircle className="w-4 h-4" />
      </button>
    </div>
  );
};

const Toggle = ({ enabled, onChange, disabled }) => (
  <button
    onClick={() => !disabled && onChange(!enabled)}
    disabled={disabled}
    className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
      enabled ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-gray-200'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
  </button>
);

const SectionCard = ({ title, subtitle, icon: Icon, children, loading }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
      <div className="w-9 h-9 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {loading && (
        <div className="ml-auto">
          <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />
        </div>
      )}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Settings = () => {
  const navigate = useNavigate();
  const fileRef = useRef();

  const [activeTab, setActiveTab] = useState('profile');
  const [toast, setToast] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [profile, setProfile] = useState({
    name: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || '',
    phone: '',
    avatar: null,
  });
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [password, setPassword] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [system, setSystem] = useState({
    notifications: true,
    emailAlerts: true,
    darkMode: false,
    autoBackup: true,
    maintenanceMode: false,
    twoFactor: false,
  });

  const showToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.get('/auth/me');
        if (data.success) {
          const u = data.data.user;
          setProfile({
            name:   u.name  || localStorage.getItem('userName') || '',
            email:  u.email || localStorage.getItem('userEmail') || '',
            phone:  u.phone || '',
            avatar: u.avatar || null,
          });
          if (u.avatar) setAvatarPreview(u.avatar);
        }
      } catch {
        showToast('Could not load profile from server', 'info');
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  const calcStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8)  score++;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const handlePasswordInput = (e) => {
    const { name, value } = e.target;
    setPassword(prev => ({ ...prev, [name]: value }));
    if (name === 'newPass') setPasswordStrength(calcStrength(value));
  };

  const strengthLabel = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const strengthColor = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-400', 'bg-green-600'];
  const strengthText  = ['', 'text-red-500', 'text-orange-500', 'text-yellow-600', 'text-green-500', 'text-green-700'];

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('Image must be under 2MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
    showToast('Avatar selected. Save profile to apply.', 'info');
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    if (!profile.name.trim()) { showToast('Name cannot be empty', 'error'); return; }
    if (!profile.email.trim()) { showToast('Email cannot be empty', 'error'); return; }

    setSavingProfile(true);
    try {
      const token = localStorage.getItem('adminToken');
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const userId = decoded.id;

      const data = await api.put(`/users/${userId}`, {
        name:  profile.name,
        email: profile.email,
        phone: profile.phone,
      });

      if (data.success) {
        localStorage.setItem('userName',  profile.name);
        localStorage.setItem('userEmail', profile.email);
        showToast('Profile updated successfully!', 'success');
      } else {
        showToast(data.message || 'Failed to update profile', 'error');
      }
    } catch {
      showToast('Server error. Changes saved locally.', 'info');
      localStorage.setItem('userName',  profile.name);
      localStorage.setItem('userEmail', profile.email);
    } finally {
      setSavingProfile(false);
    }
  };

  const updatePassword = async () => {
    if (!password.current) { showToast('Enter your current password', 'error'); return; }
    if (password.newPass.length < 6) { showToast('New password must be at least 6 characters', 'error'); return; }
    if (password.newPass !== password.confirm) { showToast('Passwords do not match', 'error'); return; }
    if (passwordStrength < 2) { showToast('Password is too weak. Add numbers and symbols.', 'error'); return; }

    setSavingPassword(true);
    try {
      const data = await api.put('/auth/change-password', {
        currentPassword: password.current,
        newPassword: password.newPass,
      });

      if (data.success) {
        setPassword({ current: '', newPass: '', confirm: '' });
        setPasswordStrength(0);
        showToast('Password changed successfully!', 'success');
      } else {
        showToast(data.message || 'Failed to change password', 'error');
      }
    } catch {
      showToast('Server error. Please try again.', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  const toggleSystem = (key) => {
    setSystem(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      const labels = {
        notifications:    updated.notifications    ? 'Notifications enabled' : 'Notifications disabled',
        emailAlerts:      updated.emailAlerts      ? 'Email alerts enabled'  : 'Email alerts disabled',
        darkMode:         updated.darkMode         ? 'Dark mode enabled'     : 'Dark mode disabled',
        autoBackup:       updated.autoBackup       ? 'Auto backup enabled'   : 'Auto backup disabled',
        maintenanceMode:  updated.maintenanceMode  ? 'Maintenance mode ON — users cannot login' : 'Maintenance mode OFF',
        twoFactor:        updated.twoFactor        ? 'Two-factor authentication enabled' : '2FA disabled',
      };
      showToast(labels[key], 'info');
      return updated;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/admin/login');
  };

  const handleExportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      user: { name: profile.name, email: profile.email },
      settings: system,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `school360-settings-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Settings exported successfully!', 'success');
  };

  const handleClearCache = () => {
    const keys = ['school360_users', 'school360_cache'];
    keys.forEach(k => localStorage.removeItem(k));
    showToast('Cache cleared successfully!', 'success');
  };

  const initials = profile.name
    ? profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const tabs = [
    { id: 'profile',  label: 'Profile',  icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system',   label: 'System',   icon: Database },
    { id: 'account',  label: 'Account',  icon: Key },
  ];

  return (
    <div className="space-y-6 max-w-4xl">

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your profile, security and system preferences</p>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'profile' && (
        <div className="space-y-6">
          <SectionCard title="Profile Picture" subtitle="Click to change your avatar" icon={Camera} loading={loadingProfile}>
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-100 shadow-md">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">{initials}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileRef.current.click()}
                  className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <Camera className="w-5 h-5 text-white" />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>
              <div>
                <button
                  onClick={() => fileRef.current.click()}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-all mr-2"
                >
                  Upload Photo
                </button>
                {avatarPreview && (
                  <button
                    onClick={() => { setAvatarPreview(null); showToast('Avatar removed', 'info'); }}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-semibold transition-all"
                  >
                    Remove
                  </button>
                )}
                <p className="text-xs text-gray-400 mt-2">JPG, PNG or GIF. Max 2MB.</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Personal Information" subtitle="Update your name, email and phone" icon={User} loading={loadingProfile}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={localStorage.getItem('userRole') || 'admin'}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-400 cursor-not-allowed capitalize outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={saveProfile}
                disabled={savingProfile}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {savingProfile ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {savingProfile ? 'Saving...' : 'Save Profile'}
              </button>
              <button
                onClick={() => {
                  setProfile({ name: localStorage.getItem('userName') || '', email: localStorage.getItem('userEmail') || '', phone: '' });
                  showToast('Changes discarded', 'info');
                }}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-all"
              >
                Discard
              </button>
            </div>
          </SectionCard>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          <SectionCard title="Change Password" subtitle="Use a strong password with letters, numbers and symbols" icon={Lock}>
            <div className="space-y-4 max-w-md">
              {[
                { field: 'current', label: 'Current Password', key: 'current', placeholder: 'Enter current password' },
                { field: 'newPass', label: 'New Password',     key: 'new',     placeholder: 'Enter new password' },
                { field: 'confirm', label: 'Confirm Password', key: 'confirm', placeholder: 'Confirm new password' },
              ].map(item => (
                <div key={item.field}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{item.label}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPass[item.key] ? 'text' : 'password'}
                      name={item.field}
                      value={password[item.field]}
                      onChange={handlePasswordInput}
                      placeholder={item.placeholder}
                      className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(p => ({ ...p, [item.key]: !p[item.key] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPass[item.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}

              {password.newPass && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-500">Password Strength</span>
                    <span className={`text-xs font-semibold ${strengthText[passwordStrength]}`}>
                      {strengthLabel[passwordStrength]}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          i <= passwordStrength ? strengthColor[passwordStrength] : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <ul className="mt-2 space-y-1">
                    {[
                      { rule: password.newPass.length >= 8,           label: 'At least 8 characters' },
                      { rule: /[A-Z]/.test(password.newPass),         label: 'At least one uppercase letter' },
                      { rule: /[0-9]/.test(password.newPass),         label: 'At least one number' },
                      { rule: /[^A-Za-z0-9]/.test(password.newPass),  label: 'At least one special character' },
                    ].map((r, i) => (
                      <li key={i} className={`text-xs flex items-center gap-1.5 ${r.rule ? 'text-green-600' : 'text-gray-400'}`}>
                        {r.rule ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {r.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={updatePassword}
                disabled={savingPassword}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {savingPassword ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                {savingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </SectionCard>

          <SectionCard title="Security Options" subtitle="Additional security settings for your account" icon={Shield}>
            <div className="space-y-5">
              {[
                {
                  key: 'twoFactor',
                  label: 'Two-Factor Authentication',
                  desc: 'Require a verification code when logging in',
                  badge: system.twoFactor ? { text: 'Enabled', color: 'bg-green-100 text-green-700' } : { text: 'Disabled', color: 'bg-gray-100 text-gray-500' },
                },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.badge.color}`}>{item.badge.text}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                  <Toggle enabled={system[item.key]} onChange={() => toggleSystem(item.key)} />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="space-y-6">
          <SectionCard title="Notifications" subtitle="Control how and when you receive alerts" icon={Bell}>
            <div className="space-y-5">
              {[
                { key: 'notifications', label: 'Push Notifications',  desc: 'Receive in-app notifications for activity' },
                { key: 'emailAlerts',   label: 'Email Alerts',        desc: 'Get important updates sent to your email' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                  <Toggle enabled={system[item.key]} onChange={() => toggleSystem(item.key)} />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Appearance" subtitle="Customize how the application looks" icon={Sun}>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                {system.darkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-yellow-500" />}
                <div>
                  <p className="text-sm font-semibold text-gray-900">Dark Mode</p>
                  <p className="text-xs text-gray-500 mt-0.5">{system.darkMode ? 'Dark theme is active' : 'Light theme is active'}</p>
                </div>
              </div>
              <Toggle enabled={system.darkMode} onChange={() => toggleSystem('darkMode')} />
            </div>
          </SectionCard>

          <SectionCard title="System Configuration" subtitle="Advanced system management options" icon={Database}>
            <div className="space-y-5">
              {[
                {
                  key: 'autoBackup',
                  label: 'Auto Backup',
                  desc: 'Automatically backup data every 24 hours',
                  badge: null,
                },
                {
                  key: 'maintenanceMode',
                  label: 'Maintenance Mode',
                  desc: 'Temporarily disable access for all non-admin users',
                  badge: system.maintenanceMode ? { text: 'Active', color: 'bg-red-100 text-red-600' } : null,
                },
              ].map(item => (
                <div key={item.key} className={`flex items-center justify-between py-3 border-b border-gray-50 last:border-0 ${item.key === 'maintenanceMode' && system.maintenanceMode ? 'bg-red-50 -mx-6 px-6 rounded-xl' : ''}`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                      {item.badge && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.badge.color}`}>{item.badge.text}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                  <Toggle enabled={system[item.key]} onChange={() => toggleSystem(item.key)} />
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-700 mb-3">Data Management</p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleExportData}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-semibold transition-all border border-blue-100"
                >
                  <Download className="w-4 h-4" />
                  Export Settings
                </button>
                <button
                  onClick={handleClearCache}
                  className="flex items-center gap-2 px-4 py-2.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-xl text-sm font-semibold transition-all border border-yellow-100"
                >
                  <RefreshCw className="w-4 h-4" />
                  Clear Cache
                </button>
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {activeTab === 'account' && (
        <div className="space-y-6">
          <SectionCard title="Account Information" subtitle="Your account details and session info" icon={Key}>
            <div className="space-y-4">
              {[
                { label: 'User ID',    value: 'Stored in JWT token', icon: Key },
                { label: 'Role',       value: localStorage.getItem('userRole') || 'admin', icon: Shield },
                { label: 'Name',       value: localStorage.getItem('userName') || '-', icon: User },
                { label: 'Email',      value: localStorage.getItem('userEmail') || '-', icon: Mail },
                { label: 'Session',    value: 'Active (7 day token)', icon: Clock },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-900 capitalize">{item.value}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="Danger Zone" subtitle="Irreversible actions — proceed with caution" icon={AlertCircle}>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 px-4 bg-orange-50 rounded-xl border border-orange-100">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Sign Out</p>
                  <p className="text-xs text-gray-500 mt-0.5">Log out of your current session</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-xl text-sm font-semibold transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>

              <div className="flex items-center justify-between py-4 px-4 bg-red-50 rounded-xl border border-red-100">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Delete Account</p>
                  <p className="text-xs text-gray-500 mt-0.5">Permanently remove your account and all data</p>
                </div>
                <button
                  onClick={() => showToast('Contact your system administrator to delete account', 'info')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl text-sm font-semibold transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </SectionCard>
        </div>
      )}

    </div>
  );
};

export default Settings;