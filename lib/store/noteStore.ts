import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CreateNoteData } from "@/types/note";

const initialDraft: CreateNoteData = {
  title: "",
  content: "",
  tag: "Todo",
};
interface NoteStore {
  draft: CreateNoteData;
  setDraft: (note: Partial<CreateNoteData>) => void;
  clearDraft: () => void;
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) =>
        set((prev) => ({ draft: { ...prev.draft, ...note } })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    { name: "note-draft" }
  )
);
