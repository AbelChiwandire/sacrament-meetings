import { notFound } from 'next/navigation';
import { getMeetingById } from '@/app/lib/meetings-db';
import { MeetingIdSchema } from '@/app/lib/schema';
import UpdateMeetingForm from './update-meeting-form';

export default async function EditMeetingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: meetingId } = await params;
    const parsedId = MeetingIdSchema.safeParse(meetingId);
    if (!parsedId.success) notFound();

    const meeting = await getMeetingById(parsedId.data);
    if (!meeting) notFound();

    const { id, ...initialValues } = meeting;

    return (
        <main className="min-h-screen px-4 py-10 sm:px-6 sm:py-14">
            <div className="mx-auto mb-7 max-w-4xl">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-950">Meeting administration</p>
                <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Edit meeting</h1>
                <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
                    Update the meeting details and program below.
                </p>
            </div>
            <UpdateMeetingForm meetingId={String(id)} initialValues={initialValues} />
        </main>
    );
}