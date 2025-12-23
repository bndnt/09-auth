"use client";
import css from "./NoteForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useNoteStore } from "@/lib/store/noteStore";
import { NoteTag } from "@/types/note";
// interface NoteFormProps {
//   onClose: () => void;
//   onSuccess?: () => void;
// }
// interface NoteFormValues {
//   title: string;
//   content: string;
//   tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
// }

const NoteForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { draft, clearDraft, setDraft } = useNoteStore();
  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      // інвалідую кеш запиту ["notes"], щоб список нотаток автоматично оновився при переході на сторінку зі списком.
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.push("/notes/filter/all");
    },
  });

  const handleSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const tag = formData.get("tag") as NoteTag;
    mutate({ title, content, tag });
  };

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setDraft({ ...draft, [name]: value });
  };

  const handleCancel = () => {
    router.push("/notes/filter/all");
  };
  return (
    <div>
      <form className={css.form} action={handleSubmit}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            name="title"
            className={css.input}
            value={draft.title}
            onChange={handleChange}
          />
          <span className={css.error}></span>
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <textarea
            value={draft.content}
            id="content"
            name="content"
            rows={8}
            className={css.textarea}
            onChange={handleChange}
          />
          <span className={css.error}></span>
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <select
            value={draft.tag}
            id="tag"
            name="tag"
            className={css.select}
            onChange={handleChange}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </select>
          <span className={css.error}></span>
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Create note"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;
