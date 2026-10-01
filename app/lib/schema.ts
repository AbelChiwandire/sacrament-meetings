import { z } from 'zod';

interface ErrorNode {
    errors: string[];
    properties?: Record<string, ErrorNode>;
    items?: (ErrorNode | undefined)[];
}

export const HymnSchema = z.object({
    number: z.coerce.number().int().positive(),
    title: z.string().min(1),
});

export const SpeakerItemSchema = z.object({
    name: z.string().min(1),
    topic: z.string().min(1),
    type: z.enum(['speaker', 'musical-number']),
});

export const WardBusinessItemSchema = z.object({
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

export const MeetingApiSchema = z.object({
    ...MeetingFormSchema.shape,

    announcements: z.array(z.string()).optional(),
    openingHymn: HymnSchema,
    wardBusiness: z.array(WardBusinessItemSchema).optional(),
    speakers: z.array(SpeakerItemSchema).optional(),
    sacramentHymn: HymnSchema,
    closingHymn: HymnSchema,
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

function collectErrors(node?: ErrorNode): string[] | undefined {
    if (!node) return undefined;

    const messages = [...(node.errors ?? [])];

    if (node.properties) {
        for (const key of Object.keys(node.properties)) {
            const childMessages = collectErrors(node.properties[key]);
            if (childMessages) messages.push(...childMessages);
        }
    }

    if (node.items) {
        for (const item of node.items) {
            if (item) {
                const itemMessages = collectErrors(item);
                if (itemMessages) messages.push(...itemMessages);
            }
        }
    }

    return messages.length > 0 ? messages : undefined;
}

export function formatValidationErrors(
    error: z.ZodError<
        Partial<z.infer<typeof MeetingFormSchema>> | Partial<z.infer<typeof MeetingApiSchema>>
    >
): MeetingFormErrors {
    const tree = z.treeifyError(error) as ErrorNode;
    return {
        date: collectErrors(tree.properties?.date),
        meetingType: collectErrors(tree.properties?.meetingType),
        presiding: collectErrors(tree.properties?.presiding),
        conducting: collectErrors(tree.properties?.conducting),
        announcements: collectErrors(tree.properties?.announcements),
        openingHymn: collectErrors(tree.properties?.openingHymn),
        openingPrayer: collectErrors(tree.properties?.openingPrayer),
        wardBusiness: collectErrors(tree.properties?.wardBusiness),
        stakeBusiness: collectErrors(tree.properties?.stakeBusiness),
        sacramentHymn: collectErrors(tree.properties?.sacramentHymn),
        speakers: collectErrors(tree.properties?.speakers),
        closingHymn: collectErrors(tree.properties?.closingHymn),
        closingPrayer: collectErrors(tree.properties?.closingPrayer),
    };
}