// app/dashboard/profile/page.tsx
"use client";

import { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Edit3, 
  X, 
  Check, 
  Camera,
  Shield,
  MapPin
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+880 1234 567890",
  });

  const [savedData, setSavedData] = useState(formData);

  const handleSave = () => {
    setSavedData(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(savedData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your personal information and preferences</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
          >
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </button>
        )}
        {isEditing && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
            >
              <Check className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden sticky top-20">
            {/* Avatar Section */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center ring-4 ring-white/30">
                  <span className="text-3xl font-bold text-white">
                    {savedData.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-all">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>
              <h2 className="text-lg font-bold text-white mt-3">{savedData.name}</h2>
              <p className="text-sm text-white/80">{savedData.email}</p>
            </div>

            {/* Profile Info */}
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-gray-900 truncate">{savedData.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm text-gray-900">{savedData.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Member Since</p>
                  <p className="text-sm text-gray-900">January 15, 2024</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Account Status</p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {/* Form Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-sm font-semibold text-gray-900">
                {isEditing ? "Edit Profile Information" : "Profile Information"}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {isEditing ? "Update your personal details below" : "Your personal information"}
              </p>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-6">
              {/* Name Field */}
              <div className="group">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                    <User className="w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-transparent">
                      {savedData.name}
                    </div>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="group">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                    <Mail className="w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <div className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-transparent">
                      {savedData.email}
                    </div>
                  )}
                </div>
              </div>

              {/* Phone Field */}
              <div className="group">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                    <Phone className="w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-transparent">
                      {savedData.phone}
                    </div>
                  )}
                </div>
              </div>

              {/* Address Section (Read Only) */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Addresses</h4>
                  <Link href="/dashboard/addresses" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                    Manage Addresses
                  </Link>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900">Home</p>
                    <p>123 Main Street, Apartment 4B</p>
                    <p>Dhaka - 1200, Bangladesh</p>
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Security</h4>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <Shield className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">Change Password</p>
                        <p className="text-xs text-gray-500">Update your password regularly</p>
                      </div>
                    </div>
                    <span className="text-xs text-indigo-600 font-medium">Update</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Form Actions (Only visible when editing) */}
            {isEditing && (
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Discard Changes
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}