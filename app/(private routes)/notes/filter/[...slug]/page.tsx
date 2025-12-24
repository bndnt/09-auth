import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api/clientApi";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import type { Metadata } from "next";

interface FilteredNotesPageProps {
  params: Promise<{ slug?: string[] }>;
}

export const generateMetadata = async ({
  params,
}: FilteredNotesPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const tag = Array.isArray(slug) ? slug[0] : slug || "all";

  return {
    title: `${tag} notes`,
    description: `On this page you can find all notes by tag ${tag}`,
    openGraph: {
      title: tag,
      description: `Description for notes by tag ${tag}`,
      url: `https://08-zustand-valeriia-makushchenko.vercel.app/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/og-meta.jpg",
          width: 1200,
          height: 630,
          alt: tag,
        },
      ],
    },
  };
};

export default async function FilteredNotesPage({
  params,
}: FilteredNotesPageProps) {
  const { slug } = await params;
  const tag = Array.isArray(slug) ? slug[0] : slug || "all";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", "", 1, tag],
    queryFn: () => fetchNotes(1, "", tag === "all" ? undefined : tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient filterTag={tag} />
    </HydrationBoundary>
  );
}
