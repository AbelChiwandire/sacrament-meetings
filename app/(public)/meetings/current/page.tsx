import { redirect } from "next/navigation";
import { getCurrentSunday, toLocalDateString } from "../../../lib/date-utils";
import { getMeetings } from "../../../lib/meetings-db";

export const dynamic = "force-dynamic";

export default async function CurrentMeetingsPage() {
  const sundayString = toLocalDateString(getCurrentSunday());

  const meetings = await getMeetings('', 1, sundayString);

  if (meetings.length === 0) {
    return (
      <div className="p-4 text-center">
        No current meeting found
      </div>
    );
  }

  redirect(`/meetings/${meetings[0].id}`);
}