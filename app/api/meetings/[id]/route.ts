import { getMeetingById } from "../../../lib/meetings-db";
import { parseMeetingId } from "../../../lib/validation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const meetingId = parseMeetingId(id);

  if (meetingId === null) {
    return new Response(JSON.stringify({ error: "Invalid ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const meeting = getMeetingById(meetingId);

  if (!meeting) {
    return new Response(JSON.stringify({ error: "Meeting not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return Response.json(meeting, { status: 200 });
}