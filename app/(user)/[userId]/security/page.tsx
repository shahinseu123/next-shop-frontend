// app/dashboard/security/page.tsx
"use client";

import { useState } from "react";
import { 
  Shield, 
  Lock, 
  Smartphone, 
  Key, 
  Eye, 
  EyeOff, 
  Check, 
  X,
  AlertCircle,
  Clock,
  Monitor,
  Tablet,
  ChevronRight,
  LogOut,
  RefreshCw,
  History,
  Fingerprint,
  Mail,
  Wifi
} from "lucide-react";

export default function SecurityPage() {
  // Password State
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
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // 2FA State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [qrCode, setQrCode] = useState(false);

  // Session State
  const [sessions, setSessions] = useState([
    { id: 1, device: "Chrome on Windows", location: "Dhaka, Bangladesh", ip: "192.168.1.1", lastActive: "Now", current: true },
    { id: 2, device: "Safari on iPhone", location: "Dhaka, Bangladesh", ip: "192.168.1.2", lastActive: "2 hours ago", current: false },
    { id: 3, device: "Firefox on MacBook", location: "Chittagong, Bangladesh", ip: "192.168.1.3", lastActive: "3 days ago", current: false },
  ]);

  // Login History
  const [loginHistory] = useState([
    { id: 1, date: "2026-05-13 14:30", device: "Chrome on Windows", location: "Dhaka, Bangladesh", status: "success" },
    { id: 2, date: "2026-05-12 09:15", device: "Safari on iPhone", location: "Dhaka, Bangladesh", status: "success" },
    { id: 3, date: "2026-05-10 18:45", device: "Chrome on Windows", location: "Chittagong, Bangladesh", status: "success" },
    { id: 4, date: "2026-05-09 22:00", device: "Unknown Browser", location: "Unknown Location", status: "failed" },
  ]);

  const handlePasswordChange = () => {
    setPasswordError("");
    setPasswordSuccess("");
    
    if (!passwordForm.currentPassword) {
      setPasswordError("Current password is required");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    // Success
    setPasswordSuccess("Password updated successfully!");
    setShowPasswordForm(false);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setPasswordSuccess(""), 3000);
  };

  const handleRevokeSession = (id: number) => {
    setSessions(prev => prev.filter(session => session.id !== id));
  };

  const getDeviceIcon = (device: string) => {
    if (device.includes("iPhone") || device.includes("Android")) return Smartphone;
    if (device.includes("iPad") || device.includes("Tablet")) return Tablet;
    return Monitor;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Security</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account security and privacy</p>
      </div>

      {/* Security Score */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Security Score: Strong</h2>
              <p className="text-sm text-white/80 mt-0.5">Your account is well protected</p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-3xl font-bold">85%</div>
            <p className="text-xs text-white/60">Security Score</p>
          </div>
        </div>

        {/* Security Checklist */}
        <div className="grid sm:grid-cols-3 gap-3 mt-5">
          {[
            { label: "Strong Password", done: true },
            { label: "2FA Enabled", done: twoFactorEnabled },
            { label: "Recovery Email", done: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
              {item.done ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <X className="w-4 h-4 text-red-400" />
              )}
              <span className="text-xs text-white/90">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Change Password */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Lock className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Password</h2>
                <p className="text-xs text-gray-500">Change your account password</p>
              </div>
            </div>

            <div className="p-6">
              {passwordSuccess && (
                <div className="mb-4 flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-4 py-3 rounded-lg">
                  <Check className="w-4 h-4" />
                  {passwordSuccess}
                </div>
              )}

              {!showPasswordForm ? (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Key className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">Change Password</p>
                      <p className="text-xs text-gray-500">Last changed 3 months ago</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
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
                    <label className="block text-xs font-medium text-gray-700 mb-1">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
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
                    <label className="block text-xs font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
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

                  {/* Password Requirements */}
                  <div className="p-3 bg-gray-50 rounded-lg space-y-1.5">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Requirements</p>
                    {[
                      { label: "At least 8 characters", met: passwordForm.newPassword.length >= 8 },
                      { label: "One uppercase letter", met: /[A-Z]/.test(passwordForm.newPassword) },
                      { label: "One lowercase letter", met: /[a-z]/.test(passwordForm.newPassword) },
                      { label: "One number", met: /[0-9]/.test(passwordForm.newPassword) },
                      { label: "Passwords match", met: passwordForm.newPassword === passwordForm.confirmPassword && passwordForm.confirmPassword.length > 0 },
                    ].map((req) => (
                      <div key={req.label} className="flex items-center gap-1.5">
                        {req.met ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border border-gray-300" />
                        )}
                        <span className={`text-[10px] ${req.met ? 'text-emerald-600' : 'text-gray-400'}`}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {passwordError && (
                    <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {passwordError}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={handlePasswordChange}
                      className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all"
                    >
                      Update Password
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordError("");
                        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                      }}
                      className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <Fingerprint className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Two-Factor Authentication</h2>
                <p className="text-xs text-gray-500">Add an extra layer of security</p>
              </div>
            </div>

            <div className="p-6">
              {!twoFactorEnabled ? (
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Two-Factor Authentication is Off</p>
                        <p className="text-xs text-gray-500">Protect your account with an extra security layer</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShow2FASetup(true)}
                      className="px-4 py-2 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-all"
                    >
                      Enable 2FA
                    </button>
                  </div>

                  {show2FASetup && (
                    <div className="mt-4 p-5 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900">Setup 2FA</h3>
                        <button onClick={() => setShow2FASetup(false)} className="text-gray-400 hover:text-gray-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-center">
                        <div className="w-40 h-40 bg-white rounded-lg mx-auto flex items-center justify-center border border-gray-200">
                          <div className="text-center">
                            <svg className="w-32 h-32 mx-auto" viewBox="0 0 100 100">
                              <rect x="10" y="10" width="7" height="7" fill="black" />
                              <rect x="20" y="10" width="7" height="7" fill="black" />
                              <rect x="30" y="10" width="7" height="7" fill="black" />
                              <rect x="50" y="10" width="7" height="7" fill="black" />
                              <rect x="60" y="10" width="7" height="7" fill="black" />
                              <rect x="70" y="10" width="7" height="7" fill="black" />
                              <rect x="80" y="10" width="7" height="7" fill="black" />
                              <rect x="10" y="20" width="7" height="7" fill="black" />
                              <rect x="40" y="20" width="7" height="7" fill="black" />
                              <rect x="80" y="20" width="7" height="7" fill="black" />
                            </svg>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                          Scan this QR code with your authenticator app
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Verification Code</label>
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-center tracking-widest"
                          placeholder="000000"
                          maxLength={6}
                        />
                      </div>

                      <button
                        onClick={() => {
                          setTwoFactorEnabled(true);
                          setShow2FASetup(false);
                        }}
                        className="w-full py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all"
                      >
                        Verify & Enable
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Two-Factor Authentication is On</p>
                        <p className="text-xs text-gray-500">Your account is extra secure</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setTwoFactorEnabled(false)}
                      className="px-4 py-2 border border-red-200 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50 transition-all"
                    >
                      Disable
                    </button>
                  </div>

                  {/* Recovery Codes */}
                  <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
                    <p className="text-xs font-medium text-amber-800 mb-2">Recovery Codes</p>
                    <p className="text-[10px] text-amber-600 mb-3">
                      Save these codes in a safe place. You can use them to access your account if you lose your phone.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {["ABCD-EFGH-IJKL", "MNOP-QRST-UVWX", "YZAB-CDEF-GHIJ", "KLMN-OPQR-STUV"].map((code) => (
                        <div key={code} className="bg-white px-3 py-2 rounded border border-amber-200 text-xs font-mono text-gray-700 text-center">
                          {code}
                        </div>
                      ))}
                    </div>
                    <button className="mt-3 text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" />
                      Generate New Codes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active Sessions */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <Monitor className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Active Sessions</h2>
                <p className="text-xs text-gray-500">Devices currently logged into your account</p>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {sessions.map((session) => {
                const DeviceIcon = getDeviceIcon(session.device);
                return (
                  <div key={session.id} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        session.current ? 'bg-indigo-50' : 'bg-gray-100'
                      }`}>
                        <DeviceIcon className={`w-5 h-5 ${
                          session.current ? 'text-indigo-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">{session.device}</p>
                          {session.current && (
                            <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {session.location} • {session.ip} • {session.lastActive}
                        </p>
                      </div>
                    </div>
                    {!session.current && (
                      <button
                        onClick={() => handleRevokeSession(session.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
              <button className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                <LogOut className="w-3 h-3" />
                Sign Out All Other Devices
              </button>
            </div>
          </div>

          {/* Login History */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                <History className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Login History</h2>
                <p className="text-xs text-gray-500">Recent login activity on your account</p>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {loginHistory.map((login) => (
                <div key={login.id} className="px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      login.status === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="text-xs font-medium text-gray-900">{login.device}</p>
                      <p className="text-[10px] text-gray-500">
                        {login.location} • {login.date}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    login.status === 'success'
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-red-600 bg-red-50'
                  }`}>
                    {login.status === 'success' ? 'Success' : 'Failed'}
                  </span>
                </div>
              ))}
            </div>

            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
              <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                View Full History
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Quick Tips */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-20">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              Security Tips
            </h3>
            <div className="space-y-3">
              {[
                { icon: Key, text: "Use a strong, unique password" },
                { icon: Fingerprint, text: "Enable two-factor authentication" },
                { icon: Mail, text: "Keep your recovery email updated" },
                { icon: Monitor, text: "Sign out from unused devices" },
                { icon: Wifi, text: "Avoid using public Wi-Fi for sensitive actions" },
              ].map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <div key={index} className="flex items-start gap-2">
                    <Icon className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600">{tip.text}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Password Strength</span>
                <span className="font-medium text-emerald-600">Strong</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-gray-500">Last Password Change</span>
              <span className="text-gray-700">3 months ago</span>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-gray-500">2FA Status</span>
              <span className={twoFactorEnabled ? "text-emerald-600 font-medium" : "text-red-500 font-medium"}>
                {twoFactorEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}