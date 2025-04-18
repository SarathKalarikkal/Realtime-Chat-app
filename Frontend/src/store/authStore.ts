import toast from "react-hot-toast";
import { axiosInstance } from "../libs/axios";
import { create } from "zustand";
import { io } from "socket.io-client";

const BASE_URL= import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

interface AuthStoreState {
  authUser: any | null;
  isSignInUp: boolean;
  isLogingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: any[];
  socket: any | null;
  checkAuth: () => Promise<void>;
  signUp: (formData: any) => Promise<void>;
  logout: () => Promise<void>;
  login: (formData: any) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  connectSocket: () => void;
  disConnectSocket: () => void;
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  authUser: null,
  isSignInUp: false,
  isLogingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,
  onlineUsers: [],

  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log(error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (formData:any) => {
    set({ isSignInUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", formData);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error: any) {
      console.log(error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      set({ isSignInUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disConnectSocket();
    } catch (error:any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },

  login: async (formData:any) => {
    set({ isLogingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error:any) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isLogingIn: false });
    }
  },

  updateProfile: async (data:any) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error:any) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket=io(BASE_URL,{
      query: {
        userId: authUser._id,
        withCredentials: true,
      },
    })
    socket.connect()

    set({ socket:socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers:userIds });
    });
  },
  disConnectSocket: () => {
    if(get().socket?.connected) get().socket.disconnect()
  },
}));
