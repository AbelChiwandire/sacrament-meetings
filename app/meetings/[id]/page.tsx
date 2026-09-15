import MeetingDetail from "../../components/MeetingDetail";
import type { SacramentMeeting } from "../../lib/types";
import { parseMeetingId } from "../../lib/validation";
import { getBaseUrl } from "../../lib/base-url";

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
    const { id } = await params;
        const meetingId = parseMeetingId(id);
        if (meetingId === null) {
            return <div className="p-4 text-center">Invalid meeting ID</div>;
        }

    const response = await fetch(`${getBaseUrl()}/api/meetings/${id}`, {
    cache: "no-store",
    });
    
    if (!response.ok) {
        return <div className="p-4 text-center">Meeting not found</div>;
    }
    const meeting = (await response.json()) as SacramentMeeting;
    return (
        <div className="p-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Meeting Details</h2>
            <MeetingDetail meeting={meeting} />
        </div>
    );
}