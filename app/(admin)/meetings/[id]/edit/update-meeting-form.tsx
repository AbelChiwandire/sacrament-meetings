'use client';

import { useActionState } from 'react';
import { updateMeetingAction, type State } from '@/app/lib/actions';
import { MeetingForm } from '@/app/components/MeetingForm';
import type { SacramentMeeting } from '@/app/lib/types';

const initialState: State = { message: null, errors: {} };

type UpdateMeetingFormProps = {
    meetingId: string;
    initialValues: Omit<SacramentMeeting, 'id'>;
};

export default function UpdateMeetingForm({ meetingId, initialValues }: UpdateMeetingFormProps) {
    const boundUpdateMeetingAction = updateMeetingAction.bind(null, meetingId);
    const [state, formAction, isPending] = useActionState(boundUpdateMeetingAction, initialState);

    return (
        <MeetingForm
            formAction={formAction}
            state={state}
            isPending={isPending}
            initialValues={initialValues}
        />
    );
}