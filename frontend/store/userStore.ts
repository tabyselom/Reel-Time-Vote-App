import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { loginUser, user } from "@/types/user.types";

export const userStore = create((set) => ({
  user: null,
  isSigningUp: false,
  isLoggingIn: false,
  isChecking: false,

  CheckUser: async () => {
    set({ isChecking: true });
    try {
      const res = await axiosInstance.get("/auth");
      if (res.status !== 200) {
        set({ user: null });
        set({ isChecking: false });
        return;
      }
      set({ user: res.data });
      set({ isChecking: false });
    } catch {
      set({ user: null });
    }
  },

  Signup: async (data: user) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ user: res.data });
      toast.success("Signed Up Successfully");
    } catch (error: unknown) {
      console.log(error);
      let errorMessage = "An unknown error occurred";
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as {
          response?: { data?: { error?: string } };
          message?: string;
        };
        errorMessage = err.response?.data?.error || err.message || errorMessage;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      toast.error("Error Signing Up: " + errorMessage);
    } finally {
      set({ isSigningUp: false });
    }
  },
  Logout: async () => {
    try {
      const res = await axiosInstance.get("/auth/logout");
      if (res.status === 200) {
        set({ user: null });
        toast.success("Logged out successfully");
      } else {
        const errorMsg =
          typeof res.data === "object" &&
          res.data !== null &&
          "error" in res.data
            ? (res.data as { error?: string }).error
            : "Unknown error";
        toast.error("Error logging out: " + errorMsg);
      }
    } catch (error: unknown) {
      console.log(error);
      let errorMessage = "An unknown error occurred";
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as {
          response?: { data?: { error?: string } };
          message?: string;
        };
        errorMessage = err.response?.data?.error || err.message || errorMessage;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      toast.error("Error logging out: " + errorMessage);
    }
  },
  Login: async (data: loginUser) => {
    try {
      set({ isLoggingIn: true });
      const res = await axiosInstance.post("/auth/login", data);

      set({ user: res.data });
      toast.success("Logged in successfully");
    } catch (error: unknown) {
      console.log(error);
      let errorMessage = "An unknown error occurred";
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as {
          response?: { data?: { error?: string } };
          message?: string;
        };
        errorMessage = err.response?.data?.error || err.message || errorMessage;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else {
        errorMessage = "An unexpected error occurred";
      }
      toast.error("Error logging in: " + errorMessage);
    } finally {
      set({ isLoggingIn: false });
    }
  },
}));
