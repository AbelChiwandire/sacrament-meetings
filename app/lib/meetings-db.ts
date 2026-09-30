import { neon } from '@neondatabase/serverless';
import type { SacramentMeeting } from './types';

const sql = neon(process.env.DATABASE_URL!);

const ITEMS_PER_PAGE = 5;

const SELECT_COLUMNS = `
    id,
    to_char(date, 'YYYY-MM-DD') AS "date",
    meeting_type                AS "meetingType",
    presiding, conducting, announcements,
    opening_hymn                AS "openingHymn",
    opening_prayer              AS "openingPrayer",
    ward_business               AS "wardBusiness",
    stake_business              AS "stakeBusiness",
    sacrament_hymn              AS "sacramentHymn",
    speakers,
    closing_hymn                AS "closingHymn",
    closing_prayer              AS "closingPrayer"
`;

export async function getMeetings(
    query: string = '',
    currentPage: number = 1,
    date?: string
): Promise<SacramentMeeting[]> {
    const searchTerm = `%${query}%`;
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    const rows = await sql`
        SELECT ${sql.unsafe(SELECT_COLUMNS)}
        FROM meetings
        WHERE
            (
                presiding       ILIKE ${searchTerm}
                OR conducting   ILIKE ${searchTerm}
                OR meeting_type ILIKE ${searchTerm}
                OR speakers::text ILIKE ${searchTerm}
            )
            ${date ? sql`AND DATE(date) = ${date}` : sql``}
        ORDER BY date DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return rows as unknown as SacramentMeeting[];
}

export async function getMeetingsTotalPages(query: string = ''): Promise<number> {
    const searchTerm = `%${query}%`;
    const rows = await sql`
        SELECT COUNT(*) FROM meetings
        WHERE
            presiding       ILIKE ${searchTerm}
            OR conducting   ILIKE ${searchTerm}
            OR meeting_type ILIKE ${searchTerm}
            OR speakers::text ILIKE ${searchTerm}
    `;
    return Math.ceil(Number(rows[0].count) / ITEMS_PER_PAGE);
}

export async function getMeetingById(id: number): Promise<SacramentMeeting | null> {
    const rows = await sql`
        SELECT ${sql.unsafe(SELECT_COLUMNS)}
        FROM meetings WHERE id = ${id}
    `;
    return (rows[0] as unknown as SacramentMeeting) ?? null;
}

export async function createMeeting(
    data: Omit<SacramentMeeting, 'id'>
): Promise<SacramentMeeting> {
    const rows = await sql`
        INSERT INTO meetings (
            date, meeting_type, presiding, conducting, announcements,
            opening_hymn, opening_prayer, ward_business, stake_business,
            sacrament_hymn, speakers, closing_hymn, closing_prayer
        ) VALUES (
            ${data.date}, ${data.meetingType}, ${data.presiding}, ${data.conducting},
            ${data.announcements ?? []},
            ${JSON.stringify(data.openingHymn)}::jsonb,
            ${data.openingPrayer},
            ${JSON.stringify(data.wardBusiness)}::jsonb,
            ${data.stakeBusiness},
            ${JSON.stringify(data.sacramentHymn)}::jsonb,
            ${JSON.stringify(data.speakers)}::jsonb,
            ${JSON.stringify(data.closingHymn)}::jsonb,
            ${data.closingPrayer}
        )
        RETURNING ${sql.unsafe(SELECT_COLUMNS)}
    `;
    return rows[0] as unknown as SacramentMeeting;
}

export async function updateMeeting(
    id: number,
    updates: Omit<SacramentMeeting, 'id'>
): Promise<SacramentMeeting | null> {
    const rows = await sql`
        UPDATE meetings SET
            date            = ${updates.date},
            meeting_type    = ${updates.meetingType},
            presiding       = ${updates.presiding},
            conducting      = ${updates.conducting},
            announcements   = ${updates.announcements ?? []},
            opening_hymn    = ${JSON.stringify(updates.openingHymn)}::jsonb,
            opening_prayer  = ${updates.openingPrayer},
            ward_business   = ${JSON.stringify(updates.wardBusiness)}::jsonb,
            stake_business  = ${updates.stakeBusiness},
            sacrament_hymn  = ${JSON.stringify(updates.sacramentHymn)}::jsonb,
            speakers        = ${JSON.stringify(updates.speakers)}::jsonb,
            closing_hymn    = ${JSON.stringify(updates.closingHymn)}::jsonb,
            closing_prayer  = ${updates.closingPrayer}
        WHERE id = ${id}
        RETURNING ${sql.unsafe(SELECT_COLUMNS)}
    `;
    return (rows[0] as unknown as SacramentMeeting) ?? null;
}

export async function deleteMeeting(id: number): Promise<boolean> {
    const rows = await sql`
        DELETE FROM meetings WHERE id = ${id} RETURNING id
    `;
    return rows.length > 0;
}