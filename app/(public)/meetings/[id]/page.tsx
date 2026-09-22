import MeetingDetail from "../../../components/MeetingDetail";
import { getMeetingById } from "../../../lib/meetings-db";
import { validateInt } from "../../../lib/validation";

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meetingId = validateInt(id);

  if (meetingId === null) {
    return <div className="p-4 text-center">Invalid meeting ID</div>;
  }

  const meeting = await getMeetingById(meetingId);

  if (!meeting) {
    return <div className="p-4 text-center">Meeting not found</div>;
  }

  return (
    <div className="p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Meeting Details</h2>
      <MeetingDetail meeting={meeting} />
    </div>
  );
}