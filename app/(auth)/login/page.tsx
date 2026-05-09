// app/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Shield,
  Sparkles,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { ButtonPrimary } from "@/components/utility/ButtonPrimary";
import { tokenService } from "@/lib/auth";
import { useApi } from "@/hook/useApi";
import { loginSchema, LoginFormData } from "@/lib/validation/auth";
import { useValidation } from "@/hook/useValidation";
import { useUserStore } from "@/store/userStore";
import { useUserService } from "@/services/userService";
import { SubmitButton } from "@/components/utility/SubmitButton";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const { setUser, setAuthenticated } = useUserStore();
  const { fetchUser } = useUserService();

  const { execute: executeLogin, loading } = useApi("/authenticate", "POST", {
    requiresAuth: false,
    onSuccess: async (data) => {
      const token = data.accessToken || data.token;
      if (token) {
        tokenService.setToken(token);

        // Fetch user info after successful login
        try {
          const userData = await fetchUser();
          if (userData) {
            setUser(userData);
            setAuthenticated(true);

            // Redirect to home or previous page
            setTimeout(() => {
              router.push("/");
              router.refresh();
            }, 500);
          }
        } catch (error) {
          console.error("Failed to fetch user info:", error);
          // Still redirect even if user fetch fails
          setTimeout(() => {
            router.push("/");
            router.refresh();
          }, 500);
        }
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  const {
    errors,
    touched,
    validateForm,
    handleBlur,
    hasError,
    clearFieldError,
  } = useValidation({
    schema: loginSchema,
    onSuccess: async (data) => {
      await executeLogin({
        data: {
          username: data.email,
          password: data.password,
        },
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    clearFieldError(name as keyof LoginFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    validateForm(formData);
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center py-8 px-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-60 h-60 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-32 -left-32 w-60 h-60 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-sm">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-indigo-100 overflow-hidden">
          {/* Header */}
          <div className="px-5 pt-5 pb-3 text-center border-b border-indigo-100">
            <div className="flex justify-center mb-2">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-2 rounded-xl shadow-md">
                <LogIn size={22} className="text-white" />
              </div>
            </div>
            <h2 className="text-lg font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 text-xs mt-0.5">
              Sign in to your account
            </p>
          </div>

          {/* Form - Only one handleSubmit here */}
          <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-gray-700 text-xs font-medium mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur("email")}
                  className={`w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    hasError("email")
                      ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                      : touched.email && !errors.email && formData.email
                        ? "border-green-400 focus:border-green-400 focus:ring-green-200"
                        : "border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                  }`}
                  placeholder="Enter your email"
                  disabled={loading}
                />
                {touched.email && !errors.email && formData.email && (
                  <CheckCircle
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                  />
                )}
              </div>
              {hasError("email") && (
                <p className="text-red-500 text-[10px] mt-0.5 flex items-center gap-1">
                  <AlertCircle size={10} />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-700 text-xs font-medium mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur("password")}
                  className={`w-full pl-9 pr-9 py-2 text-sm bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    hasError("password")
                      ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                      : "border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                  }`}
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {hasError("password") && (
                <p className="text-red-500 text-[10px] mt-0.5">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-3.5 h-3.5 text-indigo-500 bg-gray-50 border-gray-300 rounded focus:ring-indigo-400 focus:ring-2"
                />
                <span className="text-xs text-gray-600">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-indigo-500 hover:text-indigo-700 transition-colors font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button - Removed onClick handler since form onSubmit handles it */}
            <SubmitButton
              loading={loading}
              type="submit"
              icon={<LogIn color="#ffffff" size={16} />}
              fullWidth
              size="md"
              variant="primary"
            >
              Sign In
            </SubmitButton>
          </form>

          {/* Footer */}
          <div className="px-5 py-3 bg-indigo-50/30 border-t border-indigo-100 text-center">
            <p className="text-gray-500 text-xs">
              Don't have an account?
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
        <div className="text-center mt-3">
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
            <Shield size={10} />
            <span>Secure Login • 256-bit Encryption</span>
            <Sparkles size={10} />
          </div>
        </div>
      </div>
    </div>
  );
}
