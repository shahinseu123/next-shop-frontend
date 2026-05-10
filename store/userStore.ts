// store/userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

// User structure
export interface User {
  id: number;
  role: {
    name: string;
    id: number;
  };
  name: string;
  email: string;
  phoneNumber: string | null;
}

// API response structure with nested 'data'
export interface ApiUserResponse {
  data: User;
}

interface UserStore {
  // State
  user: ApiUserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  _hasHydrated: boolean;

  // Actions (Setters)
  setUser: (user: ApiUserResponse | null) => void;
  setAuthenticated: (status: boolean) => void;
  setLoading: (status: boolean) => void;
  setHasHydrated: (state: boolean) => void;
  
  // Auth Actions
  login: (userData: ApiUserResponse) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  
  // Getters
  getUser: () => ApiUserResponse | null;
  getUserData: () => User | null;
  getUserName: () => string | null;
  getUserId: () => number | null;
  getUserEmail: () => string | null;
  getUserRole: () => { name: string; id: number } | null;
  getRoleName: () => string | null;
  getRoleId: () => number | null;
  getPhoneNumber: () => string | null;
  isAdmin: () => boolean;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      _hasHydrated: false,

      // Setters
      setUser: (user) => {
        // Set cookies for proxy/route protection
        if (user?.data) {
          Cookies.set('auth-token', 'authenticated', { expires: 7, path: '/' });
          Cookies.set('user-id', String(user.data.id), { expires: 7, path: '/' });
          Cookies.set('user-role', user.data.role.name, { expires: 7, path: '/' });
        } else {
          Cookies.remove('auth-token');
          Cookies.remove('user-id');
          Cookies.remove('user-role');
        }
        set({ user, isAuthenticated: !!user });
      },

      setAuthenticated: (status) => set({ isAuthenticated: status }),

      setLoading: (status) => set({ isLoading: status }),

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      // Auth Actions
      login: (userData) => {
        if (userData?.data) {
          Cookies.set('auth-token', 'authenticated', { expires: 7, path: '/' });
          Cookies.set('user-id', String(userData.data.id), { expires: 7, path: '/' });
          Cookies.set('user-role', userData.data.role.name, { expires: 7, path: '/' });
        }
        set({ user: userData, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        // Clear cookies
        Cookies.remove('auth-token');
        Cookies.remove('user-id');
        Cookies.remove('user-role');
        // Clear store
        set({ user: null, isAuthenticated: false, isLoading: false });
        // Optional: Clear any stored session data
        sessionStorage.clear();
      },

      updateUser: (userData) =>
        set((state) => ({
          user: state.user 
            ? { data: { ...state.user.data, ...userData } }
            : null,
        })),

      // Getters
      getUser: () => {
        const state = get();
        return state.user;
      },

      getUserData: () => {
        const state = get();
        return state.user?.data || null;
      },

      getUserName: () => {
        const state = get();
        return state.user?.data?.name || null;
      },

      getUserId: () => {
        const state = get();
        return state.user?.data?.id || null;
      },

      getUserEmail: () => {
        const state = get();
        return state.user?.data?.email || null;
      },

      getUserRole: () => {
        const state = get();
        return state.user?.data?.role || null;
      },

      getRoleName: () => {
        const state = get();
        return state.user?.data?.role?.name || null;
      },

      getRoleId: () => {
        const state = get();
        return state.user?.data?.role?.id || null;
      },

      getPhoneNumber: () => {
        const state = get();
        return state.user?.data?.phoneNumber || null;
      },

      isAdmin: () => {
        const state = get();
        return state.user?.data?.role?.name === 'ADMIN';
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// Selectors for React components (for better performance)
export const useUser = () => useUserStore((state) => state.user);
export const useUserData = () => useUserStore((state) => state.user?.data || null);
export const useUserName = () => useUserStore((state) => state.user?.data?.name || null);
export const useUserId = () => useUserStore((state) => state.user?.data?.id || null);
export const useUserEmail = () => useUserStore((state) => state.user?.data?.email || null);
export const useUserRole = () => useUserStore((state) => state.user?.data?.role || null);
export const useRoleName = () => useUserStore((state) => state.user?.data?.role?.name || null);
export const useRoleId = () => useUserStore((state) => state.user?.data?.role?.id || null);
export const usePhoneNumber = () => useUserStore((state) => state.user?.data?.phoneNumber || null);
export const useIsAdmin = () => useUserStore((state) => state.user?.data?.role?.name === 'ADMIN');
export const useIsAuthenticated = () => useUserStore((state) => state.isAuthenticated);
export const useIsLoading = () => useUserStore((state) => state.isLoading);
export const useHasHydrated = () => useUserStore((state) => state._hasHydrated);

// Helper functions for non-React contexts
export const getUserStore = () => useUserStore.getState();
export const getAuthToken = () => Cookies.get('auth-token');
export const isAuthenticated = () => !!getUserStore().user;