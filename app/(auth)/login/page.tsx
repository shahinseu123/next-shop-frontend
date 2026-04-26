// app/login/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, LogIn, Shield, Sparkles } from "lucide-react";
import { ButtonPrimary } from "@/components/utility/ButtonPrimary";
import { authService } from "@/services/authService";
import { AuthTokens } from "@/type/api";
import { tokenService } from "@/lib/auth";
import { useApi } from "@/hook/useApi";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const {execute: executeLogin, loading: loginLoading, data: loginData} = useApi("/authenticate", "POST", {
    onSuccess(data) {
      tokenService.setToken(data.token);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
 
    try {
      await executeLogin({data:{username: formData.email, password: formData.password}})
    } catch (error) {
      console.log(error)
    } 
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white rounded-full blur-3xl opacity-40"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-indigo-100">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-3 rounded-2xl shadow-lg">
                <LogIn size={28} className="text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 text-sm mt-1">
              Sign in to your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 text-gray-800 placeholder-gray-400 transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 text-gray-800 placeholder-gray-400 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-500 bg-gray-50 border-gray-300 rounded focus:ring-indigo-400 focus:ring-2"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-indigo-500 hover:text-indigo-700 transition-colors font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <ButtonPrimary
              title={loginLoading ? "Signing in..." : "Sign In"}
              onClick={handleSubmit}
              bgColor="#6366F1"
              hoverBgColor="#4F46E5"
              icon={!loginLoading && <LogIn size={16} />}
              disabled={loginLoading}
              fullWidth
              size="lg"
            />
          </form>

          {/* Footer */}
          <div className="px-8 py-6 bg-indigo-50/30 border-t border-indigo-100 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-6">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <Shield size={12} />
            <span>Secure Login • 256-bit Encryption</span>
            <Sparkles size={12} />
          </div>
        </div>
      </div>
    </div>
  );
}
