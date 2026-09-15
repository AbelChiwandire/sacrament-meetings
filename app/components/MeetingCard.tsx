import { SacramentMeeting } from "../lib/types.js";
import Link from "next/link";

export default function MeetingCard({meeting}: {meeting: SacramentMeeting}) {
    return (
        <div className="border p-4 rounded mb-4">
            <h3 className="text-xl font-bold">{meeting.meetingType} Meeting</h3>
            <div className="mb-4 flex flex-col space-y-2">
                <p><strong>Date:</strong> {meeting.date}</p>
                <p><strong>Meeting Type:</strong> {meeting.meetingType}</p>
                <p><strong>Presiding:</strong> {meeting.presiding}</p>
            </div>
            <Link href={`/meetings/${meeting.id}`} className="text-blue-800 hover:underline">
                View Details
            </Link>
        </div>
    );
}