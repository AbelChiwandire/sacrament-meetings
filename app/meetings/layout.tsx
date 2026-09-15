import type { Metadata } from "next";
import NavLinks from "../components/NavLinks";
import { getMeetings } from "../lib/meetings-db";
import { getCurrentSunday, toLocalDateString } from "../lib/date-utils";

export const metadata: Metadata = {
  title: "Sacrament Meetings",
  description: "Gatherings for sacrament meetings",
};

export const dynamic = "force-dynamic";

function getCurrentMeetingId(): number | null {
  const sundayString = toLocalDateString(getCurrentSunday());
  const meetings = getMeetings(sundayString);
  return meetings[0]?.id ?? null;
}

export default async function RootLayout({ children }: LayoutProps<"/meetings">) {
  const currentMeetingId = getCurrentMeetingId();

  return (
    <>
      <NavLinks currentMeetingId={currentMeetingId} />
      {children}
    </>
  );
}