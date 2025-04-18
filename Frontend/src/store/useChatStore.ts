import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import { useAuthStore } from "./authStore";



interface ChatStoreState {
  messages: any[];
  users: any[];
  selectedUser: any | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: (userId: any) => Promise<void>;
  sendMessage: (messageData: any) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  setSelectedUser: (selectedUser: any) => void;
}

export const useChatStore = create<ChatStoreState>((set, get) => ({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,


    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
          const res = await axiosInstance.get("/message/users");
          set({ users: res.data });
        } catch (error:any) {
          toast.error(error.response.data.message);
        } finally {
          set({ isUsersLoading: false });
        }
      },
    
      getMessages: async (userId:any) => {
        set({ isMessagesLoading: true });
        try {
          const res = await axiosInstance.get(`/message/${userId}`);
          set({ messages: res.data });
        } catch (error:any) {
          toast.error(error.response.data.message);
        } finally {
          set({ isMessagesLoading: false });
        }
      },
      sendMessage: async (messageData:any) => {
        console.log("Sending message",messageData);
        
        const { selectedUser, messages } = get();
        if (!selectedUser) {
          toast.error("No user selected for the chat.");
          return;
        }
        try {
          debugger
          const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
          set({ messages: [...messages, res.data] });
        } catch (error:any) {
          toast.error(error?.response?.data.message);
        }
      },
    
      subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
    
        const socket = useAuthStore.getState().socket;
    
        socket.on("newMessage", (newMessage:any) => {
          const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
          if (!isMessageSentFromSelectedUser) return;
    
          set({
            messages: [...get().messages, newMessage],
          });
        });
      },
    
      unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
      },
    
      setSelectedUser: (selectedUser) => set({ selectedUser }),
    
}))