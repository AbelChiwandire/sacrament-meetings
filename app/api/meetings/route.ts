import { NextRequest, NextResponse } from 'next/server';
import { getMeetings, getMeetingsTotalPages, createMeeting, MeetingDateConflictError } from '@/app/lib/meetings-db';
import { MeetingApiSchema, formatValidationErrors } from '@/app/lib/schema';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') ?? '';
    const page = Number(searchParams.get('page') ?? '1');
    const date = searchParams.get('date') ?? undefined;

    const [meetings, totalPages] = await Promise.all([
        getMeetings(query, page, date),
        getMeetingsTotalPages(query),
    ]);

    return NextResponse.json({ meetings, totalPages });
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const parsed = MeetingApiSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { message: 'Invalid meeting data', errors: formatValidationErrors(parsed.error) },
            { status: 400 }
        );
    }

    try {
        const meetingData = {
            ...parsed.data,
            wardBusiness: parsed.data.wardBusiness ?? [],
            speakers: parsed.data.speakers ?? [],
        };

        const meeting = await createMeeting(meetingData);
        return NextResponse.json(meeting, { status: 201 });
    } catch (error) {
        if (error instanceof MeetingDateConflictError) {
            return NextResponse.json({ message: error.message }, { status: 409 });
        }
        console.error('POST /api/meetings failed:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}