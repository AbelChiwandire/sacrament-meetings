import { getMeetings } from "../../lib/meetings-db";
import { validateInt, validateDate } from "../../lib/validation";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  const query = params.get('query') ?? '';
  const currentPage = validateInt(params.get('page') ?? '1') ?? 1;
  const rawDate = params.get('date');
  const date = rawDate ? validateDate(rawDate) : undefined;
  if (rawDate && !date) {
    return Response.json({ error: 'Invalid date' }, { status: 400 });
  }

  const meetings = await getMeetings(query, currentPage, date ?? undefined);
  return Response.json(meetings);
}