import { getMeetings } from "../../lib/meetings-db";
import { validateInt } from "../../lib/validation";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  const query = params.get('query') ?? '';
  const currentPage = validateInt(params.get('page') ?? '1') ?? 1;

  const meetings = await getMeetings(query, currentPage);
  return Response.json(meetings);
}