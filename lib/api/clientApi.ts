import type { CreateNoteData, Note } from "@/types/note";
import { serverApi } from "./api";
import { User } from "@/types/user";

export interface FetchNotesResponse {
  page: number;
  notes: Note[];
  totalPages: number;
}

export interface NotesResponseOptions {
  params: {
    search: string;
    tag?: string;
    page: number;
    perPage: number;
  };
  headers?: { Cookie: string };
}

export interface RegiterPayload {
  email: string;
  password: string;
}
export interface CheckSessionResponse {
  success: boolean;
}
export interface UpdateMe {
  username: string;
}

export async function fetchNotes(
  page: number,
  search: string = "",

  tag?: string
) {
  if (tag === "All") {
    tag = undefined;
  }
  //   tag: string = "all" // default "all"
  // ): Promise<FetchNotesResponse> {

  //   const params: Record<string, any> = { page, search };
  //   if (tag.toLowerCase() !== "all") {
  //     params.tag = tag; //  tag if not "all"
  //   }
  const options: NotesResponseOptions = {
    params: {
      search,
      tag,
      page,
      perPage: 12,
    },
  };

  const response = await serverApi.get<FetchNotesResponse>("/notes", options);

  return response.data;
}
export async function fetchNoteById(noteId: Note["id"]) {
  const { data } = await serverApi.get<Note>(`/notes/${noteId}`);
  return data;
}
// export const createNote = async (data: CreateNoteData) => {

//   const response = await axios.post<Note>("/notes", data, {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   return response.data;
// };
export async function createNote(payload: CreateNoteData) {
  const { data } = await serverApi.post<Note>("/notes", payload);
  return data;
}

export async function deleteNote(id: Note["id"]) {
  const { data } = await serverApi.delete<Note>(`/notes/${id}`);
  return data;
}

export async function register(payload: RegiterPayload): Promise<User> {
  const { data } = await serverApi.post<User>("/auth/register", payload);
  return data;
}

export async function login(payload: RegiterPayload): Promise<User> {
  const { data } = await serverApi.post("/auth/login", payload);
  return data;
}

export async function logout(): Promise<void> {
  await serverApi.post("/auth/logout");
}

export async function checkSession(): Promise<boolean> {
  const { data } = await serverApi.get<CheckSessionResponse>("/auth/session");
  return data.success;
}

export async function getMe(): Promise<User> {
  const { data } = await serverApi.get<User>("/users/me");
  return data;
}

export async function updateMe(payload: UpdateMe): Promise<User> {
  const { data } = await serverApi.patch<User>("users/me", payload);
  return data;
}
