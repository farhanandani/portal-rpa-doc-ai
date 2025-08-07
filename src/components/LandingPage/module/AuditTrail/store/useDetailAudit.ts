import { create } from "zustand";

interface DetailAuditStore {
  selectedData: any;
  isVerification: boolean;
  setSelectedData: (data: any) => void;
  setIsVerification: (isVerification: boolean) => void;
}

export const useDetailAudit = create<DetailAuditStore>((set) => ({
  selectedData: null,
  isVerification: false,
  setSelectedData: (data) => set({ selectedData: data }),
  setIsVerification: (isVerification) => set({ isVerification }),
}));
