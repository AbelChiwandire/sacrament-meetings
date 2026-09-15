import { redirect } from "next/navigation";
import { getCurrentSunday, toLocalDateString } from "../../lib/date-utils"
import { getMeetings } from "../../lib/meetings-db";

export const dynamic = "force-dynamic";

export default function CurrentMeetingsPage() {
    const sundayString = toLocalDateString(getCurrentSunday());

  const meetings = getMeetings(sundayString);

  if (meetings.length === 0) {
    return (
      <div className="p-4 text-center">
        No current meeting found
      </div>
    );
  }

  redirect(`/meetings/${meetings[0].id}`);
}