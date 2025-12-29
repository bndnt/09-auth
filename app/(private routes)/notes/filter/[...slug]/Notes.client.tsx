"use client";

import css from "@/app/(private routes)/notes/Notes.module.css";
import { useState } from "react";
import { fetchNotes } from "@/lib/api/clientApi";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import Loader from "@/components/Loader/Loader";
import ErrorHandler from "../../error";
import type { Note } from "@/types/note";
import Link from "next/link";

interface NotesClientProps {
  filterTag?: string;
}

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

const NotesClient = ({ filterTag }: NotesClientProps) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isFetching, isLoading, error, refetch } = useQuery<
    NotesResponse,
    Error
  >({
    queryKey: ["notes", search, page, filterTag],
    queryFn: () => fetchNotes(page, search, filterTag ?? "all"),
    staleTime: 10000,
  });

  const debounceSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  if (error) {
    return <ErrorHandler error={error} reset={() => refetch()} />;
  }

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox
          search={search}
          onChange={(e) => debounceSearch(e.target.value)}
        />

        {totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </div>

      {isFetching && <Loader />}

      {!isLoading && notes.length === 0 ? (
        <p>No notes found for your search ☹️</p>
      ) : (
        <NoteList notes={notes} />
      )}
    </div>
  );
};

export default NotesClient;
