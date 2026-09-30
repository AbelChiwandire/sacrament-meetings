'use client';

import { useState } from 'react';
import type { State } from '@/app/lib/actions';
import type { SacramentMeeting, Hymn, SpeakerItem, WardBusinessItem, MeetingType } from '@/app/lib/types';

const MEETING_TYPES: MeetingType[] = ['testimony', 'regular', 'stake', 'general', 'special'];

function emptyHymn(): Hymn {
    return { number: 0, title: '' };
}

function safeParseJSON<T>(raw: string | undefined, fallback: T): T {
    if (!raw) return fallback;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}

type MeetingFormProps = {
    formAction: (formData: FormData) => void;
    state: State;
    isPending: boolean;
    initialValues?: Partial<Omit<SacramentMeeting, 'id'>>;
};

const inputClass =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20';
const labelClass = 'mb-1.5 block text-sm font-semibold text-slate-700';
const sectionClass = 'border-b border-slate-200 pb-6 last:border-b-0 last:pb-0';
const sectionHeadingClass = 'mb-4 text-base font-semibold text-slate-900';
const secondaryButtonClass =
    'inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-950 transition hover:border-blue-300 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-900/30';
const removeButtonClass =
    'shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-700/30';

function FieldErrors({ id, errors }: { id: string; errors?: string[] }) {
    return (
        <div id={id} aria-live="polite" aria-atomic="true">
            {errors?.map((error) => (
                <p key={error} className="mt-1 text-sm text-red-600">{error}</p>
            ))}
        </div>
    );
}

export function MeetingForm({ formAction, state, isPending, initialValues }: MeetingFormProps) {
    const date = state.values?.date ?? initialValues?.date;
    const meetingType = (state.values?.meetingType ?? initialValues?.meetingType) as MeetingType | undefined;
    const presiding = state.values?.presiding ?? initialValues?.presiding;
    const conducting = state.values?.conducting ?? initialValues?.conducting;
    const openingPrayer = state.values?.openingPrayer ?? initialValues?.openingPrayer;
    const closingPrayer = state.values?.closingPrayer ?? initialValues?.closingPrayer;

    const failedSubmit = state.values !== undefined;

    const [announcements, setAnnouncements] = useState<string[]>(
        state.values?.announcements ?? initialValues?.announcements ?? []
    );
    const [openingHymn, setOpeningHymn] = useState<Hymn>(
        failedSubmit ? safeParseJSON(state.values?.openingHymn, emptyHymn()) : initialValues?.openingHymn ?? emptyHymn()
    );
    const [sacramentHymn, setSacramentHymn] = useState<Hymn>(
        failedSubmit ? safeParseJSON(state.values?.sacramentHymn, emptyHymn()) : initialValues?.sacramentHymn ?? emptyHymn()
    );
    const [closingHymn, setClosingHymn] = useState<Hymn>(
        failedSubmit ? safeParseJSON(state.values?.closingHymn, emptyHymn()) : initialValues?.closingHymn ?? emptyHymn()
    );
    const [wardBusiness, setWardBusiness] = useState<WardBusinessItem[]>(
        failedSubmit
            ? (state.values?.wardBusiness ?? []).map((raw) => safeParseJSON<WardBusinessItem>(raw, { description: '' }))
            : initialValues?.wardBusiness ?? []
    );
    const [speakers, setSpeakers] = useState<SpeakerItem[]>(
        failedSubmit
            ? (state.values?.speakers ?? []).map((raw) => safeParseJSON<SpeakerItem>(raw, { name: '', topic: '', type: 'speaker' }))
            : initialValues?.speakers ?? []
    );
    const [stakeBusiness, setStakeBusiness] = useState<boolean>(
        state.values?.stakeBusiness ?? initialValues?.stakeBusiness ?? false
    );

    return (
        <form action={formAction} className="mx-auto w-full max-w-4xl space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <section className={sectionClass} aria-labelledby="meeting-details-heading">
                <h2 id="meeting-details-heading" className={sectionHeadingClass}>Meeting details</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label htmlFor="date" className={labelClass}>Date</label>
                        <input id="date" name="date" type="date" defaultValue={date} required aria-describedby="date-error" className={inputClass} />
                        <FieldErrors id="date-error" errors={state.errors?.date} />
                    </div>
                    <div>
                        <label htmlFor="meetingType" className={labelClass}>Meeting type</label>
                        <select id="meetingType" name="meetingType" defaultValue={meetingType ?? 'regular'} required aria-describedby="meetingType-error" className={inputClass}>
                            {MEETING_TYPES.map((type) => <option key={type} value={type}>{type[0].toUpperCase() + type.slice(1)}</option>)}
                        </select>
                        <FieldErrors id="meetingType-error" errors={state.errors?.meetingType} />
                    </div>
                    <div>
                        <label htmlFor="presiding" className={labelClass}>Presiding</label>
                        <input id="presiding" name="presiding" type="text" defaultValue={presiding} required aria-describedby="presiding-error" className={inputClass} />
                        <FieldErrors id="presiding-error" errors={state.errors?.presiding} />
                    </div>
                    <div>
                        <label htmlFor="conducting" className={labelClass}>Conducting</label>
                        <input id="conducting" name="conducting" type="text" defaultValue={conducting} required aria-describedby="conducting-error" className={inputClass} />
                        <FieldErrors id="conducting-error" errors={state.errors?.conducting} />
                    </div>
                </div>
            </section>

            <section className={sectionClass} aria-labelledby="announcements-heading">
                <h2 id="announcements-heading" className={sectionHeadingClass}>Announcements</h2>
                <div className="space-y-3">
                    {announcements.map((value, i) => (
                        <div key={i} className="flex items-start gap-2">
                            <input type="hidden" name="announcements" value={value} />
                            <label htmlFor={`announcement-${i}`} className="sr-only">Announcement {i + 1}</label>
                            <input
                                id={`announcement-${i}`} type="text" value={value} className={inputClass}
                                onChange={(e) => {
                                    const next = [...announcements]; next[i] = e.target.value; setAnnouncements(next);
                                }}
                            />
                            <button type="button" onClick={() => setAnnouncements(announcements.filter((_, idx) => idx !== i))} className={removeButtonClass}>
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                <FieldErrors id="announcements-error" errors={state.errors?.announcements} />
                <button type="button" onClick={() => setAnnouncements([...announcements, ''])} className={`${secondaryButtonClass} mt-3`}>
                    Add announcement
                </button>
            </section>

            <section className={sectionClass} aria-labelledby="music-prayers-heading">
                <h2 id="music-prayers-heading" className={sectionHeadingClass}>Music &amp; prayers</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                    <HymnFields label="Opening hymn" name="openingHymn" value={openingHymn} onChange={setOpeningHymn} errors={state.errors?.openingHymn} />
                    <div>
                        <label htmlFor="openingPrayer" className={labelClass}>Opening prayer</label>
                        <input id="openingPrayer" name="openingPrayer" type="text" defaultValue={openingPrayer} required aria-describedby="openingPrayer-error" className={inputClass} />
                        <FieldErrors id="openingPrayer-error" errors={state.errors?.openingPrayer} />
                    </div>
                    <HymnFields label="Sacrament hymn" name="sacramentHymn" value={sacramentHymn} onChange={setSacramentHymn} errors={state.errors?.sacramentHymn} />
                    <HymnFields label="Closing hymn" name="closingHymn" value={closingHymn} onChange={setClosingHymn} errors={state.errors?.closingHymn} />
                    <div>
                        <label htmlFor="closingPrayer" className={labelClass}>Closing prayer</label>
                        <input id="closingPrayer" name="closingPrayer" type="text" defaultValue={closingPrayer} required aria-describedby="closingPrayer-error" className={inputClass} />
                        <FieldErrors id="closingPrayer-error" errors={state.errors?.closingPrayer} />
                    </div>
                </div>
            </section>

            <section className={sectionClass} aria-labelledby="ward-business-heading">
                <h2 id="ward-business-heading" className={sectionHeadingClass}>Ward business</h2>
                <div className="space-y-3">
                    {wardBusiness.map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                            <input type="hidden" name="wardBusiness" value={JSON.stringify(item)} />
                            <label htmlFor={`wardBusiness-${i}`} className="sr-only">Ward business item {i + 1}</label>
                            <input
                                id={`wardBusiness-${i}`} type="text" value={item.description} className={inputClass}
                                onChange={(e) => {
                                    const next = [...wardBusiness]; next[i] = { description: e.target.value }; setWardBusiness(next);
                                }}
                            />
                            <button type="button" onClick={() => setWardBusiness(wardBusiness.filter((_, idx) => idx !== i))} className={removeButtonClass}>
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                <FieldErrors id="wardBusiness-error" errors={state.errors?.wardBusiness} />
                <button type="button" onClick={() => setWardBusiness([...wardBusiness, { description: '' }])} className={`${secondaryButtonClass} mt-3`}>
                    Add item
                </button>
                <label htmlFor="stakeBusiness" className="mt-5 flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <input id="stakeBusiness" type="checkbox" checked={stakeBusiness} onChange={(e) => setStakeBusiness(e.target.checked)} className="size-4 rounded border-slate-300 accent-blue-900 focus:ring-blue-900" />
                    <span className="text-sm font-semibold text-slate-800">This meeting includes stake business</span>
                </label>
                <input type="hidden" name="stakeBusiness" value={stakeBusiness ? 'true' : 'false'} />
                <FieldErrors id="stakeBusiness-error" errors={state.errors?.stakeBusiness} />
            </section>

            <section className={sectionClass} aria-labelledby="speakers-heading">
                <h2 id="speakers-heading" className={sectionHeadingClass}>Speakers &amp; musical numbers</h2>
                <div className="space-y-4">
                    {speakers.map((speaker, i) => (
                        <div key={i} className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-2">
                            <input type="hidden" name="speakers" value={JSON.stringify(speaker)} />
                            <div>
                                <label htmlFor={`speaker-${i}-name`} className={labelClass}>Name</label>
                                <input
                                    id={`speaker-${i}-name`} type="text" value={speaker.name} className={inputClass}
                                    onChange={(e) => {
                                        const next = [...speakers]; next[i] = { ...speaker, name: e.target.value }; setSpeakers(next);
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor={`speaker-${i}-topic`} className={labelClass}>Topic or selection</label>
                                <input
                                    id={`speaker-${i}-topic`} type="text" value={speaker.topic} className={inputClass}
                                    onChange={(e) => {
                                        const next = [...speakers]; next[i] = { ...speaker, topic: e.target.value }; setSpeakers(next);
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor={`speaker-${i}-type`} className={labelClass}>Program item</label>
                                <select
                                    id={`speaker-${i}-type`} value={speaker.type} className={inputClass}
                                    onChange={(e) => {
                                        const next = [...speakers]; next[i] = { ...speaker, type: e.target.value as SpeakerItem['type'] }; setSpeakers(next);
                                    }}
                                >
                                    <option value="speaker">Speaker</option>
                                    <option value="musical-number">Musical number</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button type="button" onClick={() => setSpeakers(speakers.filter((_, idx) => idx !== i))} className={removeButtonClass}>
                                    Remove item
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <FieldErrors id="speakers-error" errors={state.errors?.speakers} />
                <button type="button" onClick={() => setSpeakers([...speakers, { name: '', topic: '', type: 'speaker' }])} className={`${secondaryButtonClass} mt-3`}>
                    Add program item
                </button>
            </section>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                {state.message ? <p role="alert" className="text-sm font-medium text-red-700">{state.message}</p> : <span />}
                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isPending ? 'Saving…' : 'Save meeting'}
                </button>
            </div>
        </form>
    );
}

function HymnFields({
    label, name, value, onChange, errors,
}: { label: string; name: string; value: Hymn; onChange: (h: Hymn) => void; errors?: string[] }) {
    return (
        <div>
            <span className={labelClass}>{label}</span>
            <input type="hidden" name={name} value={JSON.stringify(value)} />
            <div className="flex gap-2">
                <div className="w-28">
                    <label htmlFor={`${name}-number`} className="sr-only">Hymn number</label>
                    <input
                        id={`${name}-number`} type="number" value={value.number || ''} className={inputClass}
                        onChange={(e) => onChange({ ...value, number: Number(e.target.value) })}
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor={`${name}-title`} className="sr-only">Hymn title</label>
                    <input
                        id={`${name}-title`} type="text" value={value.title} className={inputClass}
                        onChange={(e) => onChange({ ...value, title: e.target.value })}
                    />
                </div>
            </div>
            <FieldErrors id={`${name}-error`} errors={errors} />
        </div>
    );
}