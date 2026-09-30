'use client';

import { useActionState } from 'react';
import { deleteMeetingAction, type State } from '@/app/lib/actions';

const initialState: State = { message: null, errors: {} };

export default function DeleteMeetingButton({ meetingId }: { meetingId: string }) {
    const boundDeleteMeetingAction = deleteMeetingAction.bind(null, meetingId);
    const [state, formAction, isPending] = useActionState(
        boundDeleteMeetingAction,
        initialState
    );

    return (
        <form action={formAction} className="inline">
            <button
                type="submit"
                disabled={isPending}
                className="text-sm text-red-600 hover:underline disabled:opacity-50"
            >
                {isPending ? 'Deleting...' : 'Delete'}
            </button>
            {state.message ? (
                <p className="text-sm text-red-600">{state.message}</p>
            ) : null}
        </form>
    );
}