import { redirect } from "next/navigation";
import { getMeetings, getMeetingsTotalPages } from "../../lib/meetings-db";
import { MeetingSearch } from "../../components/MeetingSearch";
import { Pagination } from "../../components/Pagination";
import MeetingCard from "../../components/MeetingCard";
import { validateInt } from "../../lib/validation";

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
      <h2 className="text-2xl font-bold mb-4">Sacrament Meetings</h2>
      <MeetingSearch />

      {meetings.length === 0 ? (
        <p>No meetings found</p>
      ) : (
        meetings.map((meeting) => (
          <MeetingCard key={meeting.id} meeting={meeting} />
        ))
      )}

      <Pagination totalPages={totalPages} />
    </div>
  );
}