// app/register/page.tsx
"use client";

import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserService } from "@/services/userService";
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
  CheckCircle,
  AlertCircle,
  LogIn,
} from "lucide-react";
import { tokenService } from "@/lib/auth";
import { useApi } from "@/hook/useApi";
import { registerSchema, RegisterFormData } from "@/lib/validation/auth";
import { useValidation } from "@/hook/useValidation";
import { SubmitButton } from "@/components/utility/SubmitButton";
import { useUserStore } from "@/store/userStore";

interface RegisterResponse {
  accessToken?: string;
  token?: string;
  message?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
  };
}

function RegisterForm() {
  const { setUser, setAuthenticated } = useUserStore();
  const { fetchUser } = useUserService();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  // Refs for cleanup
  const timeoutRef = useRef<NodeJS.Timeout>();
  const mountedRef = useRef(true);

  // Form state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [generalError, setGeneralError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Auto login after registration
  const { execute: executeLogin, loading: loginLoading } = useApi(
    "/authenticate",
    "POST",
    {
      requiresAuth: false,
      onSuccess: async (data) => {
        const token = data.accessToken || data.token;

        if (!token) {
          console.error("No token received after login");
          if (mountedRef.current) {
            router.push("/login?registered=true");
          }
          return;
        }

        // Save token to localStorage
        tokenService.setToken(token);
        
        // Also set cookie for middleware
        document.cookie = `access_token=${token}; path=/; SameSite=Lax`;

        try {
          const userData = await fetchUser();

          if (mountedRef.current) {
            if (userData) {
              setUser(userData);
              setAuthenticated(true);
              setSuccessMessage("Account created successfully! Redirecting...");
              
              // Redirect to the intended page or home
              timeoutRef.current = setTimeout(() => {
                router.push(redirectTo);
                router.refresh();
              }, 1000);
            } else {
              console.warn("User data is null after successful login");
              timeoutRef.current = setTimeout(() => {
                router.push("/login?registered=true&message=Account created! Please sign in.");
              }, 1000);
            }
          }
        } catch (error) {
          console.error("Failed to fetch user info:", error);

          if (mountedRef.current) {
            timeoutRef.current = setTimeout(() => {
              router.push(redirectTo);
              router.refresh();
            }, 500);
          }
        }
      },
      onError: (error) => {
        console.error("Auto login failed:", error);
        if (mountedRef.current) {
          timeoutRef.current = setTimeout(() => {
            router.push(
              "/login?registered=true&message=Account created successfully! Please sign in."
            );
          }, 1000);
        }
      },
    }
  );

  // Registration
  const { execute: executeRegister, loading: registerLoading } =
    useApi<RegisterResponse>("/v2/users", "POST", {
      requiresAuth: false,
      onSuccess: async (data) => {
        console.log("Registration successful:", data);

        const credentials = {
          username: formData.email,
          password: formData.password,
        };

        setFormData((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));

        await executeLogin({
          data: credentials,
        });
      },
      onError: (error) => {
        setGeneralError(
          error.message || "Registration failed. Please try again."
        );
      },
    });

  // Form validation
  const {
    errors,
    touched,
    validateForm,
    handleBlur,
    hasError,
    clearFieldError,
  } = useValidation({
    schema: registerSchema,
    onSuccess: async (data) => {
      await executeRegister({
        data: {
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber || undefined,
          password: data.password,
        },
      });
    },
  });

  // Event handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    clearFieldError(name as keyof RegisterFormData);
    if (generalError) setGeneralError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    validateForm(formData);
  };

  // Password strength calculation
  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasMinLength = password.length >= 8;
    return { hasUpperCase, hasLowerCase, hasNumber, hasMinLength };
  };

  const passwordStrength = useMemo(
    () => validatePassword(formData.password),
    [formData.password]
  );

  const strengthCount = Object.values(passwordStrength).filter(Boolean).length;

  const getStrengthText = useMemo(() => {
    if (strengthCount === 4)
      return {
        text: "Strong",
        color: "text-green-600",
        bgColor: "bg-green-500",
      };
    if (strengthCount === 3)
      return { text: "Good", color: "text-blue-600", bgColor: "bg-blue-500" };
    if (strengthCount === 2)
      return {
        text: "Fair",
        color: "text-yellow-600",
        bgColor: "bg-yellow-500",
      };
    return { text: "Weak", color: "text-red-600", bgColor: "bg-red-500" };
  }, [strengthCount]);

  const isLoading = registerLoading || loginLoading;

  const passwordRequirements = useMemo(
    () => [
      {
        met: passwordStrength.hasMinLength,
        text: "At least 8 characters",
      },
      {
        met: passwordStrength.hasUpperCase,
        text: "One uppercase letter",
      },
      {
        met: passwordStrength.hasLowerCase,
        text: "One lowercase letter",
      },
      {
        met: passwordStrength.hasNumber,
        text: "One number",
      },
    ],
    [passwordStrength]
  );

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center py-6 px-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-60 h-60 bg-indigo-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-32 -left-32 w-60 h-60 bg-purple-100 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Register Card */}
      <div className="relative w-full max-w-sm">
        {/* Redirect Info */}
        {redirectTo !== '/' && (
          <div className="mb-3 bg-blue-50 border border-blue-200 rounded-lg p-2.5">
            <p className="text-xs text-blue-700 flex items-center gap-1.5">
              <AlertCircle size={12} />
              Create an account to access {redirectTo}
            </p>
          </div>
        )}

        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-indigo-100 overflow-hidden">
          {/* Header */}
          <div className="px-5 pt-5 pb-3 text-center border-b border-indigo-100">
            <div className="flex justify-center mb-2">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-2 rounded-xl shadow-md">
                <UserPlus size={22} className="text-white" />
              </div>
            </div>
            <h2 className="text-lg font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-500 text-xs mt-0.5">
              Join us and start shopping
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mx-5 mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-emerald-600 text-xs text-center flex items-center justify-center gap-1.5">
                <CheckCircle size={12} />
                {successMessage}
              </p>
            </div>
          )}

          {/* Error Alert */}
          {generalError && (
            <div className="mx-5 mt-3 p-2.5 bg-red-50 border border-red-200 rounded-lg" role="alert">
              <p className="text-red-600 text-xs text-center flex items-center justify-center gap-1.5">
                <AlertCircle size={12} />
                {generalError}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-5 py-3 space-y-3" noValidate>
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-gray-700 text-xs font-medium mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur("name")}
                  className={`w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    hasError("name")
                      ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                      : touched.name && !errors.name && formData.name
                      ? "border-green-400 focus:border-green-400 focus:ring-green-200"
                      : "border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                  }`}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
                {touched.name && !errors.name && formData.name && (
                  <CheckCircle size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                )}
              </div>
              {hasError("name") && (
                <p className="text-red-500 text-[10px] mt-0.5 flex items-center gap-1" role="alert">
                  <AlertCircle size={10} />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-700 text-xs font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur("email")}
                  className={`w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    hasError("email")
                      ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                      : "border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                  }`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
              {hasError("email") && (
                <p className="text-red-500 text-[10px] mt-0.5" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-gray-700 text-xs font-medium mb-1">
                Phone <span className="text-gray-400">(Optional)</span>
              </label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="phoneNumber"
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 transition-all"
                  placeholder="Enter your phone number (optional)"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-gray-700 text-xs font-medium mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
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
                  placeholder="Create a password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {formData.password && (
                <div className="mt-1.5 space-y-1">
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${getStrengthText.bgColor}`}
                      style={{ width: `${(strengthCount / 4) * 100}%` }}
                    />
                  </div>
                  <p className={`text-[10px] font-medium ${getStrengthText.color}`}>
                    {getStrengthText.text} password
                  </p>
                  <div className="space-y-0.5 mt-1">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-1">
                        {req.met ? (
                          <CheckCircle size={10} className="text-green-500" />
                        ) : (
                          <AlertCircle size={10} className="text-gray-300" />
                        )}
                        <span className={`text-[10px] ${req.met ? "text-green-600" : "text-gray-400"}`}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasError("password") && (
                <p className="text-red-500 text-[10px] mt-0.5" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 text-xs font-medium mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur("confirmPassword")}
                  className={`w-full pl-9 pr-9 py-2 text-sm bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    hasError("confirmPassword")
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
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {hasError("confirmPassword") && (
                <p className="text-red-500 text-[10px] mt-0.5" role="alert">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                id="agreeTerms"
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                onBlur={() => handleBlur("agreeTerms")}
                className="mt-0.5 w-3.5 h-3.5 text-indigo-500 bg-gray-50 border-gray-300 rounded focus:ring-indigo-400 focus:ring-2"
                disabled={isLoading}
              />
              <label htmlFor="agreeTerms" className="text-[10px] text-gray-500 leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-indigo-600 hover:text-indigo-800 font-medium">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-indigo-600 hover:text-indigo-800 font-medium">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {hasError("agreeTerms") && (
              <p className="text-red-500 text-[10px] flex items-center gap-1" role="alert">
                <AlertCircle size={10} />
                {errors.agreeTerms}
              </p>
            )}

            {/* Submit Button */}
            <SubmitButton
              loading={isLoading}
              type="submit"
              icon={<LogIn color="#ffffff" size={16} />}
              fullWidth
              size="md"
              variant="primary"
              disabled={isLoading}
            >
              Create Account
            </SubmitButton>
          </form>

          {/* Footer */}
          <div className="px-5 py-3 bg-indigo-50/30 border-t border-indigo-100 text-center">
            <p className="text-gray-500 text-xs">
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
        <div className="text-center mt-3">
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
            <Shield size={10} />
            <span>Secure Registration</span>
            <Sparkles size={10} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap in Suspense for useSearchParams
export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}