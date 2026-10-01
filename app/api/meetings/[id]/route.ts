import { NextRequest, NextResponse } from 'next/server';
import { getMeetingById, updateMeeting, deleteMeeting, MeetingDateConflictError } from '@/app/lib/meetings-db';
import { MeetingApiSchema, MeetingIdSchema, formatValidationErrors } from '@/app/lib/schema';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const parsedId = MeetingIdSchema.safeParse(id);
    if (!parsedId.success) {
        return NextResponse.json({ message: 'Invalid meeting id' }, { status: 400 });
    }

    const meeting = await getMeetingById(parsedId.data);
    if (!meeting) {
        return NextResponse.json({ message: 'Meeting not found' }, { status: 404 });
    }

    return NextResponse.json(meeting);
}

export async function PATCH(
    request: NextRequest,
    { params }: RouteParams
) {
    const { id } = await params;

    const parsedId = MeetingIdSchema.safeParse(id);
    if (!parsedId.success) {
        return NextResponse.json(
            { message: 'Invalid meeting id' },
            { status: 400 }
        );
    }

    const body = await request.json();

    const parsed = MeetingApiSchema.partial().safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            {
                message: 'Invalid meeting data',
                errors: formatValidationErrors(parsed.error),
            },
            { status: 400 }
        );
    }

    try {
        const meeting = await updateMeeting(parsedId.data, parsed.data);

        if (!meeting) {
            return NextResponse.json(
                { message: 'Meeting not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(meeting);
    } catch (error) {
        if (error instanceof MeetingDateConflictError) {
            return NextResponse.json(
                { message: error.message },
                { status: 409 }
            );
        }

        console.error('PATCH /api/meetings/[id] failed:', error);

        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const parsedId = MeetingIdSchema.safeParse(id);
    if (!parsedId.success) {
        return NextResponse.json({ message: 'Invalid meeting id' }, { status: 400 });
    }

    const deleted = await deleteMeeting(parsedId.data);
    if (!deleted) {
        return NextResponse.json({ message: 'Meeting not found' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
}