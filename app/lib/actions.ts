'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
    createMeeting,
    updateMeeting, deleteMeeting,
    MeetingDateConflictError
} from './meetings-db';
import {
    MeetingFormSchema,
    MeetingIdSchema,
    formatDetailedValidationErrors,
    type MeetingDetailedErrors,
} from './schema';

export type State = {
    errors?: MeetingDetailedErrors;
    message?: string | null;
    values?: {
        date?: string;
        meetingType?: string;
        presiding?: string;
        conducting?: string;
        announcements?: string[];
        openingHymn?: string;
        openingPrayer?: string;
        wardBusiness?: string[];
        stakeBusiness?: boolean;
        sacramentHymn?: string;
        speakers?: string[];
        closingHymn?: string;
        closingPrayer?: string;
    };
};

function validateMeetingForm(formData: FormData) {
    return MeetingFormSchema.safeParse({
        date: formData.get('date'),
        meetingType: formData.get('meetingType'),
        presiding: formData.get('presiding'),
        conducting: formData.get('conducting'),
        announcements: formData.getAll('announcements'),
        openingHymn: formData.get('openingHymn'),
        openingPrayer: formData.get('openingPrayer'),
        wardBusiness: formData.getAll('wardBusiness'),
        stakeBusiness: formData.get('stakeBusiness') === 'true',
        sacramentHymn: formData.get('sacramentHymn'),
        speakers: formData.getAll('speakers'),
        closingHymn: formData.get('closingHymn'),
        closingPrayer: formData.get('closingPrayer'),
    });
}

function getRawMeetingValues(formData: FormData): State['values'] {
    return {
        date: formData.get('date')?.toString(),
        meetingType: formData.get('meetingType')?.toString(),
        presiding: formData.get('presiding')?.toString(),
        conducting: formData.get('conducting')?.toString(),
        announcements: formData.getAll('announcements').map(String),
        openingHymn: formData.get('openingHymn')?.toString(),
        openingPrayer: formData.get('openingPrayer')?.toString(),
        wardBusiness: formData.getAll('wardBusiness').map(String),
        stakeBusiness: formData.get('stakeBusiness') === 'true',
        sacramentHymn: formData.get('sacramentHymn')?.toString(),
        speakers: formData.getAll('speakers').map(String),
        closingHymn: formData.get('closingHymn')?.toString(),
        closingPrayer: formData.get('closingPrayer')?.toString(),
    };
}

async function runMutation(
    mutation: () => Promise<unknown>,
    logLabel: string
): Promise<State | undefined> {
    try {
        await mutation();
    } catch (error) {
        if (error instanceof MeetingDateConflictError) {
            return { message: error.message };
        }
        console.error(logLabel, error);
        throw new Error('We couldn\'t complete that meeting change. Please try again.');
    }

    revalidatePath('/meetings');
    redirect('/meetings');
}

export async function createMeetingAction(
    _prevState: State,
    formData: FormData
): Promise<State> {
    const validatedData = validateMeetingForm(formData);
    if (!validatedData.success) {
        return {
            errors: formatDetailedValidationErrors(validatedData.error),
            message: 'Missing or invalid fields. Failed to create Meeting.',
            values: getRawMeetingValues(formData),
        };
    }

    const result = await runMutation(
        () => createMeeting(validatedData.data),
        'createMeetingAction failed:'
    );
    return result ?? {};
}

export async function updateMeetingAction(
    id: string,
    _prevState: State,
    formData: FormData
): Promise<State> {
    const parsedId = MeetingIdSchema.safeParse(id);
    if (!parsedId.success) {
        return { message: 'Invalid meeting id.' };
    }

    const validatedData = validateMeetingForm(formData);
    if (!validatedData.success) {
        return {
            errors: formatDetailedValidationErrors(validatedData.error),
            message: 'Missing or invalid fields. Failed to update Meeting.',
            values: getRawMeetingValues(formData),
        };
    }

    const result = await runMutation(
        () => updateMeeting(parsedId.data, validatedData.data),
        'updateMeetingAction failed:'
    );
    return result ?? {};
}

export async function deleteMeetingAction(
    id: string,
    _prevState: State,
    _formData: FormData
): Promise<State> {
    const parsedId = MeetingIdSchema.safeParse(id);
    if (!parsedId.success) {
        return { message: 'Invalid meeting id.' };
    }

    const result = await runMutation(
        () => deleteMeeting(parsedId.data),
        'deleteMeetingAction failed:'
    );
    return result ?? {};
}