import { z } from 'zod';

const HymnSchema = z.object({
    number: z.coerce.number().int().positive(),
    title: z.string().min(1),
});

const SpeakerItemSchema = z.object({
    name: z.string().min(1),
    topic: z.string().min(1),
    type: z.enum(['speaker', 'musical-number']),
});

const WardBusinessItemSchema = z.object({
    description: z.string().min(1),
});

function jsonField<T extends z.ZodType>(schema: T) {
    return z.string().transform((val, ctx) => {
        try {
            return schema.parse(JSON.parse(val));
        } catch {
            ctx.addIssue({ code: 'custom', message: 'Invalid data format' });
            return z.NEVER;
        }
    });
}

export const MeetingFormSchema = z.object({
    date: z.string().min(2),
    meetingType: z.enum(['testimony', 'regular', 'stake', 'general', 'special']),
    presiding: z.string().min(2),
    conducting: z.string().min(2),
    announcements: z.array(z.string()).optional(),
    openingHymn: jsonField(HymnSchema),
    openingPrayer: z.string().min(2),
    wardBusiness: z.array(jsonField(WardBusinessItemSchema)).optional().default([]),
    stakeBusiness: z.boolean(),
    sacramentHymn: jsonField(HymnSchema),
    speakers: z.array(jsonField(SpeakerItemSchema)).optional().default([]),
    closingHymn: jsonField(HymnSchema),
    closingPrayer: z.string().min(2),
});

export const MeetingIdSchema = z.coerce.number().int().positive();

export type MeetingFormErrors = {
    date?: string[];
    meetingType?: string[];
    presiding?: string[];
    conducting?: string[];
    announcements?: string[];
    openingHymn?: string[];
    openingPrayer?: string[];
    wardBusiness?: string[];
    stakeBusiness?: string[];
    sacramentHymn?: string[];
    speakers?: string[];
    closingHymn?: string[];
    closingPrayer?: string[];
};

export function formatValidationErrors(
    error: z.ZodError<Partial<z.infer<typeof MeetingFormSchema>>>
): MeetingFormErrors {
    const tree = z.treeifyError(error);
    return {
        date: tree.properties?.date?.errors,
        meetingType: tree.properties?.meetingType?.errors,
        presiding: tree.properties?.presiding?.errors,
        conducting: tree.properties?.conducting?.errors,
        announcements: tree.properties?.announcements?.errors,
        openingHymn: tree.properties?.openingHymn?.errors,
        openingPrayer: tree.properties?.openingPrayer?.errors,
        wardBusiness: tree.properties?.wardBusiness?.errors,
        stakeBusiness: tree.properties?.stakeBusiness?.errors,
        sacramentHymn: tree.properties?.sacramentHymn?.errors,
        speakers: tree.properties?.speakers?.errors,
        closingHymn: tree.properties?.closingHymn?.errors,
        closingPrayer: tree.properties?.closingPrayer?.errors,
    };
}