// app/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Shield,
  Sparkles,
  Phone,
  AtSign,
} from "lucide-react";
import { ButtonPrimary } from "@/components/utility/ButtonPrimary";
import { tokenService } from "@/lib/auth";
import { useApi } from "@/hook/useApi";
import { registerSchema, RegisterFormData } from "@/lib/validation/auth";
import { ZodError } from "zod";

interface RegisterResponse {
  accessToken?: string;
  token?: string;
  message?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    username: string;
    phoneNumber?: string;
  };
}

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    username: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string>("");

  // Auto login after registration
  const { execute: executeLogin, loading: loginLoading } = useApi("/authenticate", "POST", {
    requiresAuth: false,
    onSuccess: (data) => {
      const token = data.accessToken || data.token;
      if (token) {
        tokenService.setToken(token);
        // Redirect to home page after successful login
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 1000);
      }
    },
    onError: (error) => {
      console.error("Auto login failed:", error);
      // If auto login fails, redirect to login page
      setTimeout(() => {
        router.push('/login?registered=true');
      }, 1000);
    }
  });

  const { execute: executeRegister, loading, data } = useApi<RegisterResponse>("/v2/users", "POST", {
    requiresAuth: false,
    onSuccess: async (data) => {
      console.log("Registration successful:", data);
      // Auto login after successful registration
      await executeLogin({
        data: {
          username: formData.email,
          password: formData.password
        }
      });
    },
    onError: (error) => {
      setGeneralError(error.message || "Registration failed. Please try again.");
    }
  });

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasMinLength = password.length >= 8;
    return { hasUpperCase, hasLowerCase, hasNumber, hasMinLength };
  };

  const passwordStrength = validatePassword(formData.password);
  const strengthCount = Object.values(passwordStrength).filter(Boolean).length;

  const getStrengthText = () => {
    if (strengthCount === 4) return { text: "Strong", color: "text-green-600", width: "w-full" };
    if (strengthCount === 3) return { text: "Good", color: "text-blue-600", width: "w-3/4" };
    if (strengthCount === 2) return { text: "Fair", color: "text-yellow-600", width: "w-1/2" };
    return { text: "Weak", color: "text-red-600", width: "w-1/4" };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    
    // Clear general error
    if (generalError) setGeneralError("");
  };

  const validateForm = (): boolean => {
    try {
      registerSchema.parse(formData);
      setFieldErrors({});
      setGeneralError("");
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string> = {};
        // error.errors.forEach((err) => {
        //   if (err.path) {
        //     errors[err.path[0]] = err.message;
        //   }
        // });
        setFieldErrors(errors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("submit")
    e.preventDefault();
    
    // Validate form with Zod
    if (!validateForm()) {
      console.log("validation faild")
      return;
    }
    
    try {
      // Send data exactly as your backend expects (without roleId)
      await executeRegister({
        data: {
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber || undefined,
          username: formData.username,
          password: formData.password,
          // roleId is omitted as requested
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const isLoading = loading || loginLoading;

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white rounded-full blur-3xl opacity-40"></div>
      </div>

      {/* Register Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-indigo-100">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-3 rounded-2xl shadow-lg">
                <UserPlus size={28} className="text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-500 text-sm mt-1">
              Join us and start shopping
            </p>
          </div>

          {/* Success Message */}
          {data && (
            <div className="mx-8 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm text-center">
                Registration successful! Redirecting...
              </p>
            </div>
          )}

          {/* Error Alert */}
          {generalError && (
            <div className="mx-8 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{generalError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 text-gray-800 placeholder-gray-400 transition-all ${
                    fieldErrors.name
                      ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                      : "border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                  }`}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
              </div>
              {fieldErrors.name && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <AtSign
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 text-gray-800 placeholder-gray-400 transition-all ${
                    fieldErrors.username
                      ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                      : "border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                  }`}
                  placeholder="Choose a username"
                  disabled={isLoading}
                />
              </div>
              {fieldErrors.username && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email Address <span className="text-red-500">*</span>
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
                  className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 text-gray-800 placeholder-gray-400 transition-all ${
                    fieldErrors.email
                      ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                      : "border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                  }`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Phone Number <span className="text-gray-400">(Optional)</span>
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 text-gray-800 placeholder-gray-400 transition-all ${
                    fieldErrors.phoneNumber
                      ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                      : "border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                  }`}
                  placeholder="Enter your phone number"
                  disabled={isLoading}
                />
              </div>
              {fieldErrors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.phoneNumber}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password <span className="text-red-500">*</span>
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
                  className={`w-full pl-10 pr-12 py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 text-gray-800 placeholder-gray-400 transition-all ${
                    fieldErrors.password
                      ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                      : "border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                  }`}
                  placeholder="Create a password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {formData.password && (
                <div className="mt-2 space-y-2">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 bg-indigo-500`}
                      style={{ width: `${(strengthCount / 4) * 100}%` }}
                    />
                  </div>
                  <p className={`text-xs font-medium ${getStrengthText().color}`}>
                    Password strength: {getStrengthText().text}
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li className={passwordStrength.hasMinLength ? "text-green-600" : ""}>
                      • At least 8 characters
                    </li>
                    <li className={passwordStrength.hasUpperCase ? "text-green-600" : ""}>
                      • At least one uppercase letter
                    </li>
                    <li className={passwordStrength.hasLowerCase ? "text-green-600" : ""}>
                      • At least one lowercase letter
                    </li>
                    <li className={passwordStrength.hasNumber ? "text-green-600" : ""}>
                      • At least one number
                    </li>
                  </ul>
                </div>
              )}
              {fieldErrors.password && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 text-gray-800 placeholder-gray-400 transition-all ${
                    fieldErrors.confirmPassword
                      ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                      : "border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                  }`}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="mt-1 w-4 h-4 text-indigo-500 bg-gray-50 border-gray-300 rounded focus:ring-indigo-400 focus:ring-2"
                disabled={isLoading}
              />
              <label className="text-sm text-gray-600">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
                >
                  Privacy Policy
                </Link>{" "}
                <span className="text-red-500">*</span>
              </label>
            </div>
            {fieldErrors.agreeTerms && (
              <p className="text-red-500 text-xs">{fieldErrors.agreeTerms}</p>
            )}

            {/* Submit Button */}
            <ButtonPrimary
              title={isLoading ? "Creating Account..." : "Create Account"}
              onClick={handleSubmit}
              bgColor="#6366F1"
              hoverBgColor="#4F46E5"
              icon={!isLoading && <UserPlus size={16} />}
              disabled={isLoading}
              fullWidth
              size="lg"
            />
          </form>

          {/* Footer */}
          <div className="px-8 py-6 bg-indigo-50/30 border-t border-indigo-100 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-6">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <Shield size={12} />
            <span>Secure Registration • Data Protected</span>
            <Sparkles size={12} />
          </div>
        </div>
      </div>
    </div>
  );
}