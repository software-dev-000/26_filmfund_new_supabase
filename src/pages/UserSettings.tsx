import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone,
  Lock, 
  Bell, 
  Shield,
  Trash2,
  Save,
  AlertCircle,
  Globe,
  Monitor,
  DollarSign,
  FileText,
  ChevronRight,
  LogOut,
  Clock,
  Smartphone,
  Upload
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UserSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    language: 'en',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
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
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileData = await getCurrentProfile();
      if (profileData) {
        setProfile(profileData);
        setFormData(prev => ({
          ...prev,
          fullName: profileData.full_name || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          language: profileData.language || 'en'
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          phone: formData.phone,
          language: formData.language,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) throw error;

      if (formData.newPassword && formData.currentPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: formData.newPassword
        });

        if (passwordError) throw passwordError;
      }

      setMessage({ type: 'success', text: 'Settings updated successfully!' });
      loadProfile();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
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
        <div className="text-white">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 pt-20 pb-12">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
              <p className="text-gray-400">Manage your account preferences and security settings</p>
            </div>
            <button
              type="submit"
              disabled={saving}
              onClick={handleSubmit}
              className="flex items-center px-6 py-3 bg-gold-500 text-navy-900 rounded-lg hover:bg-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} className="mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-500/10 border border-green-500 text-green-500'
                : 'bg-red-500/10 border border-red-500 text-red-500'
            }`}>
              <div className="flex items-center">
                <AlertCircle size={20} className="mr-2" />
                {message.text}
              </div>
            </div>
          )}

          <div className="flex gap-6">
            {/* Tabs Navigation */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
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
            <div className="flex-grow">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Information */}
                {activeTab === 'profile' && (
                  <section className="bg-navy-800 rounded-xl p-6 border border-navy-700">
                    <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                          className="w-full bg-navy-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500"
                        />
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

                      <div>
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
                      </div>
                    </div>
                  </section>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <section className="bg-navy-800 rounded-xl p-6 border border-navy-700">
                      <h2 className="text-xl font-bold text-white mb-6">Change Password</h2>
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

                    <section className="bg-navy-800 rounded-xl p-6 border border-navy-700">
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
                    </section>
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
    </div>
  );
};

export default UserSettings;