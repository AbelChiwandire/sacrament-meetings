import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMeetings, getMeetingsTotalPages } from "../../lib/meetings-db";
import { MeetingSearch } from "../../components/MeetingSearch";
import { Pagination } from "../../components/Pagination";
import MeetingCard from "../../components/MeetingCard";
import { validateInt } from "../../lib/validation";

export const metadata: Metadata = {
  title: 'Meetings | Sacrament Meetings',
  description: 'List of sacrament meetings.'
};

export default async function MeetingsPage(props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query ?? "";
  const requestedPage = validateInt(searchParams?.page ?? "1") ?? 1;
  const totalPages = await getMeetingsTotalPages(query);

  if (totalPages > 0 && requestedPage > totalPages) {
    const queryString = query
      ? `?query=${encodeURIComponent(query)}&page=${totalPages}`
      : `?page=${totalPages}`;

    redirect(`/meetings${queryString}`);
  }

  const currentPage = requestedPage;
  const meetings = await getMeetings(query, currentPage);

  return (
    <div className="p-4 text-center">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-2xl font-bold">Sacrament Meetings</h2>
        <Link
          href="/meetings/new"
          className="rounded border border-slate-800 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-slate-800 hover:text-white"
        >
          Add Meeting
        </Link>
      </div>
      <MeetingSearch />

      {meetings.length === 0 ? (
        <p className="mb-4">No meetings found</p>
      ) : (
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      )}

      <Pagination totalPages={totalPages} />
    </div>
  );
}