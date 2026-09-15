import MeetingCard from "../components/MeetingCard";
import type { SacramentMeeting } from "../lib/types";

export default async function MeetingsPage() {
  const response = await fetch("http://localhost:3000/api/meetings", {
    cache: "no-store",
  });
  
  if (!response.ok) {
    return <div className="p-4 text-center">Error loading meetings</div>;
  }

  const meetings: SacramentMeeting[] = await response.json();

  if (meetings.length === 0) {
    return <div className="p-4 text-center">No meetings found</div>;
  }

  return (
    <div className="p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Sacrament Meetings</h2>
      <ul className="mb-4">
        {meetings.map((meeting) => (
          <li key={meeting.id}>
            <MeetingCard meeting={meeting} />
          </li>
        ))}
      </ul>
    </div>
  );
}