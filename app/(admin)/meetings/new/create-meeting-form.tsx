'use client';

import { useActionState } from 'react';
import { createMeetingAction, type State } from '@/app/lib/actions';
import { MeetingForm } from '@/app/components/MeetingForm';

const initialState: State = { message: null, errors: {} };

export default function CreateMeetingForm() {
    const [state, formAction, isPending] = useActionState(createMeetingAction, initialState);

    return <MeetingForm formAction={formAction} state={state} isPending={isPending} />;
}