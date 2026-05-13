// app/dashboard/settings/page.tsx
"use client";

import { useState } from "react";
import { 
  Bell, 
  Lock, 
  Eye, 
  EyeOff, 
  Globe, 
  Moon, 
  Sun, 
  Shield, 
  Trash2,
  LogOut,
  Check,
  X,
  AlertCircle,
  Smartphone,
  Mail,
  ChevronRight,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailOrders: true,
    emailPromotions: false,
    emailNewsletter: true,
    pushOrders: true,
    pushPromotions: false,
    smsOrders: false,
  });

  // Password Change
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordError, setPasswordError] = useState("");

  // Delete Account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Theme
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');

  // Language
  const [language, setLanguage] = useState('en');

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    // Save password logic here
    setShowPasswordForm(false);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordError("");
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText === "DELETE") {
      // Delete account logic here
      console.log("Account deleted");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account preferences and security</p>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <Bell className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Notifications</h2>
            <p className="text-xs text-gray-500">Choose what notifications you want to receive</p>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {/* Email Notifications */}
          <div className="px-6 py-4">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Email Notifications</h3>
            </div>
            <div className="space-y-3">
              {[
                { key: 'emailOrders' as const, label: 'Order Updates', desc: 'Get notified about your order status' },
                { key: 'emailPromotions' as const, label: 'Promotions & Deals', desc: 'Receive promotional offers and discounts' },
                { key: 'emailNewsletter' as const, label: 'Newsletter', desc: 'Weekly newsletter with tips and updates' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle(item.key)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      notifications[item.key] ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications[item.key] ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Push Notifications */}
          <div className="px-6 py-4">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone className="w-4 h-4 text-gray-400" />
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Push Notifications</h3>
            </div>
            <div className="space-y-3">
              {[
                { key: 'pushOrders' as const, label: 'Order Updates', desc: 'Push notifications for order status' },
                { key: 'pushPromotions' as const, label: 'Promotions', desc: 'Push notifications for deals and offers' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle(item.key)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      notifications[item.key] ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications[item.key] ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SMS Notifications */}
          <div className="px-6 py-4">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone className="w-4 h-4 text-gray-400" />
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">SMS Notifications</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-900">Order Updates via SMS</p>
                  <p className="text-xs text-gray-500">Get SMS alerts for important order updates</p>
                </div>
                <button
                  onClick={() => handleNotificationToggle('smsOrders')}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    notifications.smsOrders ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.smsOrders ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
            <Sun className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Appearance</h2>
            <p className="text-xs text-gray-500">Customize your visual preferences</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Theme */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 block">Theme</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'dark', label: 'Dark', icon: Moon },
                { value: 'system', label: 'System', icon: Globe },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.value}
                    onClick={() => setTheme(item.value as any)}
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                      theme === item.value
                        ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 block">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full sm:w-64 px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option value="en">English</option>
              <option value="bn">বাংলা (Bengali)</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="ar">العربية (Arabic)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
            <Lock className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Security</h2>
            <p className="text-xs text-gray-500">Manage your password and account security</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Change Password Button */}
          {!showPasswordForm && (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Lock className="w-4 h-4 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Change Password</p>
                  <p className="text-xs text-gray-500">Update your password regularly to keep your account secure</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          )}

          {/* Password Form */}
          {showPasswordForm && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">Change Password</h3>
                <button
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordError("");
                    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                  }}
                  className="p-1 rounded hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-3 py-2 pr-9 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Enter current password"
                  />
                  <button
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 pr-9 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Enter new password"
                  />
                  <button
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 pr-9 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Confirm new password"
                  />
                  <button
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {passwordError && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  <AlertCircle className="w-3 h-3" />
                  {passwordError}
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handlePasswordChange}
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-all"
                >
                  Update Password
                </button>
                <button
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordError("");
                  }}
                  className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Shield className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-xs text-gray-500">Add an extra layer of security</p>
              </div>
            </div>
            <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-gray-200 transition-colors">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border border-red-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-red-100 bg-red-50/30 flex items-center gap-3">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-red-700">Danger Zone</h2>
            <p className="text-xs text-red-500">Irreversible actions for your account</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Logout All Devices */}
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <LogOut className="w-4 h-4 text-gray-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">Sign Out All Devices</p>
                <p className="text-xs text-gray-500">Log out from all other devices</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          {/* Delete Account */}
          <div className="p-4 bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-700">Delete Account</p>
                <p className="text-xs text-red-500 mt-0.5">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
              </div>
            </div>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-all"
              >
                Delete My Account
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-red-600 font-medium">
                  Type <span className="font-bold">DELETE</span> to confirm:
                </p>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="Type DELETE"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmText !== "DELETE"}
                    className="px-4 py-2 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText("");
                    }}
                    className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}