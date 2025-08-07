import { create } from "zustand";
import { devtools } from "zustand/middleware"; // Optional: Zustand devtools for debugging

export type InfoViewData = {
  error: string;
  displayMessage: string;
  loading: boolean;
};

export type InfoViewActions = {
  fetchStart: () => void;
  fetchSuccess: () => void;
  fetchError: (error: string) => void;
  showMessage: (displayMessage: string) => void;
  clearInfoView: () => void;
};

type InfoViewStore = InfoViewData & InfoViewActions;

const initialState: InfoViewData = {
  error: "",
  displayMessage: "",
  loading: false,
};

export const useInfoViewStore = create<InfoViewStore>()(
  devtools((set) => ({
    // Initial state
    ...initialState,

    // Actions
    fetchStart: () =>
      set(() => ({
        loading: true,
        error: "",
        displayMessage: "",
      })),

    fetchSuccess: () =>
      set(() => ({
        loading: false,
      })),

    fetchError: (error: string) => {
      set(() => ({
        loading: false,
        error,
      }));
    },

    showMessage: (displayMessage: string) => {
      set(() => ({
        displayMessage,
      }));
    },

    clearInfoView: () =>
      set(() => ({
        error: "",
        displayMessage: "",
        loading: false,
      })),
  })),
);
