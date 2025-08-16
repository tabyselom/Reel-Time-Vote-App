import { axiosInstance } from "@/lib/axios";
import { Poll } from "@/types/poll.types";
import toast from "react-hot-toast";
import { create } from "zustand";

export const pollStore = create((set) => ({
  poll: null,
  myPolls: null,
  isCreatingPoll: false,
  isFetchingPolls: false,
  isVotingPoll: false,
  hasVoted: false,

  CreatePoll: async (data: Poll) => {
    set({ isCreatingPoll: true });
    try {
      const res = await axiosInstance.post("/poll/create", data);
      set({ poll: res.data });
      toast.success("Poll Created Successfully");
      console.log(res.data);
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
      toast.error("Error Creating Poll: " + errorMessage);
      return false;
    } finally {
      set({ isCreatingPoll: false });
      set({ Poll: null });
    }
  },
  GetPoll: async (id: string) => {
    set({ isFetchingPolls: true });
    try {
      const res = await axiosInstance.get(`/poll/${id}`);
      console.log(res);
      const data = res.data as { message?: string; poll?: Poll };
      if (data.message) {
        set({ hasVoted: true });
        set({ poll: data.poll });
      } else {
        set({ poll: data });
      }
    } catch (error: unknown) {
      let errorMessage = "An unknown error occurred";
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        errorMessage = err.response?.data?.message || errorMessage;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      toast.error(errorMessage);
    }
  },
  VotePoll: async (id: string) => {
    set({ isVotingPoll: true });
    try {
      const res = await axiosInstance.put(`/poll/vote/${id}`);
      toast.success("Voted Successfully");
      console.log(res.data);
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
      toast.error("Error Voting Poll: " + errorMessage);
    } finally {
      set({ isFetchingPolls: false });
    }
  },
  GetMyPoll: async () => {
    set({ isFetchingPolls: true });
    try {
      const res = await axiosInstance.get("/poll/my-polls");
      set({ myPolls: res.data });
      // console.log(res.data);
    } catch {
      console.log("Error fetching polls");
    }
  },
}));
