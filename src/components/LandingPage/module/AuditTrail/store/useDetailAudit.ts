import { create } from "zustand";

interface DetailAuditStore {
  selectedData: any;
  setSelectedData: (data: any) => void;
}

export const useDetailAudit = create<DetailAuditStore>((set) => ({
  selectedData: null,
  setSelectedData: (data) => set({ selectedData: data }),
}));
