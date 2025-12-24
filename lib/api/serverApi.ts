import { cookies } from "next/headers";
import { serverApi } from "./api";
import {
  CheckSessionResponse,
  NotesResponseOptions,
  FetchNotesResponse,
} from "./clientApi";
import { Note } from "../../types/note";
import { User } from "../../types/user";

export async function fetchNoteServer(
  search: string,
  page: number,
  tag?: string
) {
  const cookieStore = await cookies();
  if (tag === "All") {
    tag = undefined;
  }
  const options: NotesResponseOptions = {
    params: {
      search,
      tag,
      page,
      perPage: 12,
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
  const { data } = await serverApi.get<FetchNotesResponse>("/notes", options);
  return data;
}

export async function fetchNoteByIdServer(noteId: Note["id"]) {
  const cookieStore = await cookies();
  const { data } = await serverApi.get<Note>(`/notes/${noteId}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
}

export async function getMeServer() {
  const cookieStore = await cookies();

  const { data } = await serverApi.get<User>("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
}
export async function checkSessionServer() {
  const cookieStore = await cookies();

  const { data } = await serverApi.get<CheckSessionResponse>("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
}
