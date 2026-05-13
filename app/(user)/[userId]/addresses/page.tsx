// app/dashboard/addresses/page.tsx
"use client";

import { useState } from "react";
import { 
  MapPin, 
  Plus, 
  Edit3, 
  Trash2, 
  Home, 
  Building2, 
  Briefcase,
  Check,
  X,
  Phone,
  User,
  Navigation
} from "lucide-react";

// Mock addresses data
const initialAddresses = [
  {
    id: 1,
    type: "home",
    name: "John Doe",
    phone: "+880 1234 567890",
    address: "123 Main Street, Apartment 4B",
    city: "Dhaka",
    postalCode: "1200",
    country: "Bangladesh",
    isDefault: true,
  },
  {
    id: 2,
    type: "office",
    name: "John Doe",
    phone: "+880 9876 543210",
    address: "456 Business Avenue, Floor 12, Suite 1201",
    city: "Dhaka",
    postalCode: "1212",
    country: "Bangladesh",
    isDefault: false,
  },
  {
    id: 3,
    type: "other",
    name: "Jane Doe",
    phone: "+880 1122 334455",
    address: "789 Park Road, Villa 7",
    city: "Chittagong",
    postalCode: "4000",
    country: "Bangladesh",
    isDefault: false,
  },
];

const addressTypeConfig: Record<string, { icon: any; label: string; color: string; bg: string }> = {
  home: { icon: Home, label: "Home", color: "text-blue-600", bg: "bg-blue-50" },
  office: { icon: Briefcase, label: "Office", color: "text-purple-600", bg: "bg-purple-50" },
  other: { icon: MapPin, label: "Other", color: "text-gray-600", bg: "bg-gray-50" },
};

interface AddressFormData {
  type: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

const emptyForm: AddressFormData = {
  type: "home",
  name: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  country: "Bangladesh",
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(emptyForm);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleAddNew = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const handleEdit = (address: any) => {
    setEditingId(address.id);
    setFormData({
      type: address.type,
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (editingId) {
      setAddresses(prev => prev.map(addr => 
        addr.id === editingId ? { ...addr, ...formData } : addr
      ));
    } else {
      const newAddress = {
        id: Date.now(),
        ...formData,
        isDefault: addresses.length === 0,
      };
      setAddresses(prev => [...prev, newAddress]);
    }
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setTimeout(() => {
      setAddresses(prev => prev.filter(addr => addr.id !== id));
      setDeletingId(null);
    }, 300);
  };

  const handleSetDefault = (id: number) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    })));
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Addresses</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your shipping addresses</p>
        </div>
        {!showForm && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Address
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              {editingId ? 'Edit Address' : 'Add New Address'}
            </h3>
            <button
              onClick={handleCancel}
              className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Address Type */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Address Type</label>
              <div className="flex gap-2">
                {Object.entries(addressTypeConfig).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setFormData(prev => ({ ...prev, type: key }))}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                        formData.type === key
                          ? `${config.bg} ${config.color} border-current`
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {config.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="+880 1234 567890"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Street Address *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  rows={2}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                  placeholder="House/Flat No., Street Name, Area"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {/* City */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="City"
                />
              </div>

              {/* Postal Code */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Postal Code *</label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="1200"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="India">India</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="Nepal">Nepal</option>
                  <option value="Sri Lanka">Sri Lanka</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {editingId ? 'Update Address' : 'Save Address'}
            </button>
          </div>
        </div>
      )}

      {/* Address Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {addresses.map((address) => {
          const typeConfig = addressTypeConfig[address.type] || addressTypeConfig.other;
          const TypeIcon = typeConfig.icon;

          return (
            <div
              key={address.id}
              className={`bg-white rounded-xl border transition-all duration-300 ${
                address.isDefault 
                  ? 'border-indigo-300 ring-1 ring-indigo-100 shadow-sm' 
                  : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
              } ${deletingId === address.id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${typeConfig.bg}`}>
                      <TypeIcon className={`w-4 h-4 ${typeConfig.color}`} />
                    </div>
                    <div>
                      <span className={`text-xs font-medium ${typeConfig.color}`}>
                        {typeConfig.label}
                      </span>
                      {address.isDefault && (
                        <span className="ml-2 text-[10px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(address)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {!address.isDefault && (
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Address Details */}
                <div className="space-y-1.5 text-sm">
                  <p className="font-medium text-gray-900">{address.name}</p>
                  <p className="text-gray-600">{address.address}</p>
                  <p className="text-gray-600">
                    {address.city} - {address.postalCode}, {address.country}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-2">
                    <Phone className="w-3 h-3" />
                    {address.phone}
                  </p>
                </div>

                {/* Set as Default */}
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="mt-4 w-full py-2 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Navigation className="w-3 h-3" />
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Add New Address Card */}
        {!showForm && (
          <button
            onClick={handleAddNew}
            className="min-h-[200px] rounded-xl border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all flex flex-col items-center justify-center gap-3 group"
          >
            <div className="w-12 h-12 bg-gray-100 group-hover:bg-indigo-100 rounded-full flex items-center justify-center transition-all">
              <Plus className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 transition-all" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 group-hover:text-indigo-600 transition-all">
                Add New Address
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Add a new shipping address
              </p>
            </div>
          </button>
        )}
      </div>

      {/* Empty State */}
      {addresses.length === 0 && !showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <MapPin className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No addresses saved</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            Add a shipping address to make checkout faster and easier.
          </p>
          <button
            onClick={handleAddNew}
            className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Add Your First Address
          </button>
        </div>
      )}
    </div>
  );
}