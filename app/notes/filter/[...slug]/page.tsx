import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { fetchNotes } from '../../../../lib/api';
import { makeQueryClient } from '../../../../lib/queryClient';
import type { NoteTag } from '../../../../types/note';
import NotesClient from './Notes.client';

interface FilteredNotesPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

const allowedTags: NoteTag[] = [
  'Todo',
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
];

export default async function FilteredNotesPage({
  params,
}: FilteredNotesPageProps) {
  const { slug } = await params;
  const selectedTag = slug?.[0];

  const tag =
    selectedTag && selectedTag !== 'all' && allowedTags.includes(selectedTag as NoteTag)
      ? (selectedTag as NoteTag)
      : undefined;

  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag ?? 'all'],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        search: '',
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialTag={tag} />
    </HydrationBoundary>
  );
}