import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield,
  Trash2,
  Save,
  AlertCircle,
  Monitor,
  FileText,
  Clock,
  Smartphone,
  Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { projectService } from '../services/projectService';
import { s3Service } from '../services/s3Service';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

const UserSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const { loading, currentUser, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    language: 'en',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    avatarUrl: '',
    twoFactorAuth: false,
    notifications: {
      projectUpdates: true,
      tokenEvents: true,
      investorReports: true
    },
    preferences: {
      darkMode: true,
      defaultDashboard: 'investor',
      currency: 'USD'
    }
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState('');

  const [initialProfile, setInitialProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    avatarUrl: '',
  });

  // Mock data for recent sessions
  const recentSessions = [
    {
      id: 1,
      device: 'Chrome on MacBook Pro',
      location: 'New York, USA',
      ip: '192.168.1.1',
      lastAccess: '2025-03-20 14:30:00',
      current: true
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'Los Angeles, USA',
      ip: '192.168.1.2',
      lastAccess: '2025-03-19 09:15:00',
      current: false
    }
  ];

  useEffect(() => {
    if (
      formData.newPassword &&
      formData.confirmPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      setPasswordMatchError('New password and confirm password do not match.');
    } else {
      setPasswordMatchError('');
    }
  }, [formData.newPassword, formData.confirmPassword]);

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        firstName: currentUser.user_metadata?.first_name || '',
        lastName: currentUser.user_metadata?.last_name || '',
        avatarUrl: currentUser.user_metadata?.avatar_url || '',
        email: currentUser.email || '',
      }));
      setInitialProfile({
        firstName: currentUser.user_metadata?.first_name || '',
        lastName: currentUser.user_metadata?.last_name || '',
        avatarUrl: currentUser.user_metadata?.avatar_url || '',
        email: currentUser.email || '',
      });
    }
  }, [currentUser]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    try {
      setSaving(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser.id}/${Date.now()}.${fileExt}`;
      const url = await projectService.uploadFile('avatars', fileName, file);

      if (url) {
        setFormData(prev => ({ ...prev, avatarUrl: url }));
        toast.success('Avatar uploaded successfully!');
      }
    } catch (error: any) {
      toast.error('Failed to upload avatar', error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate first name and last name
    if (!formData.firstName.trim()) {
      toast.error('First name is required');
      return;
    }

    if (!formData.lastName.trim()) {
      toast.error('Last name is required');
      return;
    }

    const isFirstNameChanged = formData.firstName.trim() !== initialProfile.firstName.trim();
    const isLastNameChanged = formData.lastName.trim() !== initialProfile.lastName.trim();
    const isNewPassword = formData.newPassword.trim() !== '';
    const isAvatarChanged = formData.avatarUrl !== initialProfile.avatarUrl;

    if (!isFirstNameChanged && !isLastNameChanged && !isNewPassword && !isAvatarChanged) {
      toast.error('Please change at least one field (first name, last name, avatar, or new password) before saving.');
      return;
    }

    setSaving(true);

    try {
      await updateProfile(
        isFirstNameChanged ? formData.firstName : initialProfile.firstName,
        isLastNameChanged ? formData.lastName : initialProfile.lastName,
        formData.avatarUrl,
        formData.currentPassword,
        isNewPassword ? formData.newPassword : ''
      );
      toast.success('Settings updated successfully!');
      setInitialProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        avatarUrl: formData.avatarUrl,
      });
    } catch (error: any) {
      toast.error('Failed to update settings', error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) return;

    try {
      setDeleting(true);

      // 1. Delete user's avatar from storage if exists
      if (formData.avatarUrl) {
        const previousPath = formData.avatarUrl.split('avatars/')[1];
        if (previousPath) {
          await s3Service.deleteFile("avatars", previousPath);
        }
      }

      // 2. Delete user via Edge Function
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      await supabase.from('users').delete().eq('id', currentUser.id);

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ userId: currentUser.id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete account');
      }

      toast.success('Account deleted successfully');
      // 3. Logout and redirect
      await logout();
      navigate('/');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account', error.message);
    } finally {
      setDeleting(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Monitor },
    { id: 'kyc', label: 'KYC & Compliance', icon: FileText }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 py-5">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex sm:flex-row flex-col items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
              <p className="text-gray-400">Manage your account preferences and security settings</p>
            </div>
            <button
              type="submit"
              disabled={saving}
              onClick={handleSubmit}
              className="flex items-center w-full sm:w-auto justify-center sm:justify-start px-6 py-3 bg-gold-500 text-navy-900 rounded-lg hover:bg-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} className="mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Tabs Navigation */}
            <div className="md:w-64 flex-shrink-0 mb-4 md:mb-0">
              <div className="flex md:block overflow-x-auto space-x-2 md:space-x-0 bg-navy-800 rounded-xl border border-navy-700">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center px-4 py-3 whitespace-nowrap transition-colors sm:w-full max-w-[180px] sm:max-w-none ${
                        activeTab === tab.id
                          ? 'bg-navy-700 text-gold-500'
                          : 'text-gray-400 hover:bg-navy-700/50'
                      }`}
                    >
                      <Icon size={18} className="mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Tab Content */}
            <div className="flex-grow w-full">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Information */}
                {activeTab === 'profile' && (
                  <section className="bg-navy-800 rounded-xl p-6 border border-navy-700">
                    <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>
                    <div className="space-y-4">
                      <div className="flex flex-col items-center mb-6">
                        <div className="relative">
                          <img
                            src={formData.avatarUrl || '/avatar.png'}
                            alt="User Avatar"
                            className="w-24 h-24 rounded-full object-cover border-4 border-gold-500"
                          />
                          <div className="absolute bottom-0 right-0 bg-gold-500 rounded-full p-2 cursor-pointer hover:bg-gold-600 transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarChange}
                              className="hidden"
                              id="avatar-upload"
                            />
                            <label htmlFor="avatar-upload" className="cursor-pointer">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-navy-900" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </label>
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">Click the edit icon to change your avatar</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <div className="flex flex-col gap-1 w-full">
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            First Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                            className="w-full bg-navy-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500"
                            required
                          />
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Last Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                            className="w-full bg-navy-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500"
                            required
                          />
                        </div>
                        
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          disabled
                          className="w-full bg-navy-700 text-gray-400 rounded-lg px-4 py-3 cursor-not-allowed"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Contact support to change your email address
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full bg-navy-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500"
                          placeholder="+1 (555) 000-0000"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Used for two-factor authentication and important alerts
                        </p>
                      </div>

                      {/* <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Preferred Language
                        </label>
                        <select
                          value={formData.language}
                          onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                          className="w-full bg-navy-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500"
                        >
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                          <option value="de">Deutsch</option>
                        </select>
                      </div> */}
                    </div>
                  </section>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <section className="bg-navy-800 rounded-xl p-6 border border-navy-700">
                      <h2 className="text-xl font-bold text-white mb-6">Change Password</h2>
                      {passwordMatchError && (
                        <div className="mb-2 text-red-500">{passwordMatchError}</div>
                      )}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={formData.currentPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            className="w-full bg-navy-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={formData.newPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                            className="w-full bg-navy-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="w-full bg-navy-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500"
                          />
                        </div>
                      </div>
                    </section>

                    <section className="bg-navy-800 rounded-xl p-6 border border-navy-700">
                      <h2 className="text-xl font-bold text-white mb-6">Two-Factor Authentication</h2>
                      <div className="flex items-center justify-between p-4 bg-navy-700 rounded-lg mb-4">
                        <div className="flex items-center">
                          <Shield className="text-gold-500 mr-3" size={24} />
                          <div>
                            <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                            <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.twoFactorAuth}
                            onChange={(e) => setFormData(prev => ({ ...prev, twoFactorAuth: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-navy-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold-500/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
                        </label>
                      </div>
                    </section>

                    {/* <section className="bg-navy-800 rounded-xl p-6 border border-navy-700">
                      <h2 className="text-xl font-bold text-white mb-6">Active Sessions</h2>
                      <div className="space-y-4">
                        {recentSessions.map((session) => (
                          <div key={session.id} className="flex items-center justify-between p-4 bg-navy-700 rounded-lg">
                            <div className="flex items-center">
                              <Smartphone className="text-gold-500 mr-3" size={24} />
                              <div>
                                <h3 className="text-white font-medium">{session.device}</h3>
                                <p className="text-sm text-gray-400">
                                  {session.location} • {session.ip}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Last active: {session.lastAccess}
                                </p>
                              </div>
                            </div>
                            {session.current ? (
                              <span className="text-sm text-gold-500">Current Session</span>
                            ) : (
                              <button className="text-sm text-red-500 hover:text-red-400">
                                Revoke Access
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </section> */}
                  </div>
                )}

                {/* Notification Preferences */}
                {activeTab === 'notifications' && (
                  <section className="bg-navy-800 rounded-xl p-6 border border-navy-700">
                    <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-navy-700 rounded-lg">
                        <div>
                          <h3 className="text-white font-medium">Project Updates</h3>
                          <p className="text-sm text-gray-400">
                            Receive updates about projects you've invested in
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.notifications.projectUpdates}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                projectUpdates: e.target.checked
                              }
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-navy-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold-500/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-navy-700 rounded-lg">
                        <div>
                          <h3 className="text-white font-medium">FFA Token Events</h3>
                          <p className="text-sm text-gray-400">
                            Updates about staking rewards and token allocations
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.notifications.tokenEvents}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                tokenEvents: e.target.checked
                              }
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-navy-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold-500/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-navy-700 rounded-lg">
                        <div>
                          <h3 className="text-white font-medium">Investor Reports</h3>
                          <p className="text-sm text-gray-400">
                            Quarterly reports and important financial updates
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.notifications.investorReports}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                investorReports: e.target.checked
                              }
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-navy-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold-500/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
                        </label>
                      </div>
                    </div>
                  </section>
                )}

                {/* Preferences */}
                {activeTab === 'preferences' && (
                  <section className="bg-navy-800 rounded-xl p-6 border border-navy-700">
                    <h2 className="text-xl font-bold text-white mb-6">Display & Currency Preferences</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Default Dashboard View
                        </label>
                        <select
                          value={formData.preferences.defaultDashboard}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              defaultDashboard: e.target.value
                            }
                          }))}
                          className="w-full bg-navy-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500"
                        >
                          <option value="investor">Investor Dashboard</option>
                          <option value="filmmaker">Filmmaker Dashboard</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Display Currency
                        </label>
                        <select
                          value={formData.preferences.currency}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              currency: e.target.value
                            }
                          }))}
                          className="w-full bg-navy-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-navy-700 rounded-lg">
                        <div>
                          <h3 className="text-white font-medium">Dark Mode</h3>
                          <p className="text-sm text-gray-400">
                            Toggle between light and dark theme
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.preferences.darkMode}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              preferences: {
                                ...prev.preferences,
                                darkMode: e.target.checked
                              }
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-navy-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold-500/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
                        </label>
                      </div>
                    </div>
                  </section>
                )}

                {/* KYC & Compliance */}
                {activeTab === 'kyc' && (
                  <div className="space-y-6">
                    <section className="bg-navy-800 rounded-xl p-6 border border-navy-700">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">KYC Status</h2>
                        <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm">
                          Verified
                        </span>
                      </div>
                      <p className="text-gray-400 mb-4">
                        Your identity has been verified and you can participate in all investment opportunities.
                      </p>
                      <div className="flex items-center text-sm text-gray-400">
                        <Clock size={16} className="mr-2" />
                        Last verified: March 15, 2025
                      </div>
                    </section>

                    <section className="bg-navy-800 rounded-xl p-6 border border-navy-700">
                      <h2 className="text-xl font-bold text-white mb-6">Documents</h2>
                      <div className="space-y-4">
                        <div className="p-4 bg-navy-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-white font-medium">Government ID</h3>
                            <span className="text-sm text-green-500">Verified</span>
                          </div>
                          <button className="text-sm text-gold-500 hover:text-gold-400">
                            Update Document
                          </button>
                        </div>

                        <div className="p-4 bg-navy-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-white font-medium">Proof of Address</h3>
                            <span className="text-sm text-green-500">Verified</span>
                          </div>
                          <button className="text-sm text-gold-500 hover:text-gold-400">
                            Update Document
                          </button>
                        </div>

                        <div className="p-4 bg-navy-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-white font-medium">Accredited Investor Status</h3>
                            <span className="text-sm text-green-500">Verified</span>
                          </div>
                          <button className="text-sm text-gold-500 hover:text-gold-400">
                            Update Document
                          </button>
                        </div>
                      </div>
                    </section>
                  </div>
                )}

                {/* Danger Zone */}
                <section className="bg-navy-800 rounded-xl p-6 border border-red-900/20">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                    <AlertCircle size={20} className="mr-2 text-red-500" />
                    Danger Zone
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-red-500/10 rounded-lg">
                      <h3 className="text-white font-medium mb-2">Delete Account</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <button
                        type="button"
                        className="flex items-center px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
                        onClick={() => setShowDeleteModal(true)}
                      >
                        <Trash2 size={16} className="mr-2" />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </section>
              </form>
            </div>
          </div>
        </motion.div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-navy-900 rounded-xl p-8 max-w-md w-full border border-red-500 shadow-2xl">
            <h2 className="text-xl font-bold text-red-500 mb-4 flex items-center">
              <AlertCircle size={20} className="mr-2" />
              Confirm Account Deletion
            </h2>
            <p className="text-gray-300 mb-4">
              This action is <span className="text-red-500 font-bold">undoable</span>. <br></br>To confirm, type <span className="font-mono bg-navy-800 px-2 py-1 rounded">delete account</span> below.
            </p>
            <input
              type="text"
              className="w-full bg-navy-800 text-white rounded-lg px-4 py-3 mb-2 focus:outline-none focus:ring-2 focus:ring-gold-500"
              placeholder="Type 'delete account' to confirm"
              value={deleteConfirmText}
              onChange={e => {
                setDeleteConfirmText(e.target.value);
                setDeleteError('');
              }}
              disabled={deleting}
            />
            {deleteError && <div className="text-red-500 mb-2">{deleteError}</div>}
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                  setDeleteError('');
                }}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'delete account' || deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSettings;