import Link from "next/link";
import MeetingDetail from "../../../components/MeetingDetail";
import { getMeetingById } from "../../../lib/meetings-db";
import { validateInt } from "../../../lib/validation";
import { cache } from "react";
import type { Metadata } from "next";

type Props = {
    params: Promise<{ id: string }>;
}

const getMeeting = cache(async (id: string) => {
    const meetingId = validateInt(id);
    if (meetingId === null) return null;
    return getMeetingById(meetingId);
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const meeting = await getMeeting(id);

    if (!meeting) {
        return {
            title: 'Meeting Not Found',
            description: 'The requested meeting could not be found.',
        };
    }

    return {
        title: meeting.meetingType,
        description: `Details for the ${meeting.meetingType} meeting.`,
        openGraph: {
            title: meeting.meetingType,
            description: `Details for the ${meeting.meetingType} meeting.`,
        }
    };
}

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const meeting = await getMeeting(id);

  if (!meeting) {
    return <div className="p-4 text-center">Invalid meeting ID or Meeting not found</div>;
  }

  return (
    <div className="p-4 text-center">
      <div className="mb-4 flex items-center justify-between gap-2">
        <Link href="/meetings" className="text-black hover:underline">
          &larr; Back to Meetings
        </Link>
        <Link
          href={`/meetings/${meeting.id}/edit`}
          className="rounded border border-slate-800 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-slate-800 hover:text-white"
        >
          Edit Meeting
        </Link>
      </div>
      <h2 className="text-2xl font-bold mb-4">Meeting Details</h2>
      <MeetingDetail meeting={meeting} />
    </div>
  );
}