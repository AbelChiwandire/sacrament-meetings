import { SacramentMeeting } from "../lib/types.js";

export default function MeetingDetail({meeting}: {meeting: SacramentMeeting}) {
    return (
        <div className="border p-4 rounded mb-4">
            <h3 className="text-xl font-bold">{meeting.meetingType} Meeting</h3>
            <div className="mb-4 flex flex-col space-y-2">
                <p><strong>Date:</strong> {meeting.date}</p>
                <p><strong>Meeting Type:</strong> {meeting.meetingType}</p>
                <p><strong>Presiding:</strong> {meeting.presiding}</p>
                <p><strong>Conducting:</strong> {meeting.conducting}</p>
                <div>
                    <strong>Announcements:</strong>
                    <ul>
                        {meeting.announcements?.map(
                        (announcement, index) => (
                            <li key={index}>{announcement}</li>
                        ))}
                    </ul>
                </div>
                <p><strong>Opening Hymn:</strong> {meeting.openingHymn.title} ({meeting.openingHymn.number})</p>
                <p><strong>Opening Prayer:</strong> {meeting.openingPrayer}</p>
                <p><strong>Ward Business:</strong> {meeting.wardBusiness.map(item => item.description).join(", ")}</p>
                <p><strong>Stake Business:</strong> {meeting.stakeBusiness ? "Yes" : "No"}</p>
                <p><strong>Sacrament Hymn:</strong> {meeting.sacramentHymn.title} ({meeting.sacramentHymn.number})</p>
                <p><strong>Speakers:</strong> {meeting.speakers.map(speaker => `${speaker.name} - ${speaker.topic}`).join(", ")}</p>
                <p><strong>Closing Hymn:</strong> {meeting.closingHymn.title} ({meeting.closingHymn.number})</p>
                <p><strong>Closing Prayer:</strong> {meeting.closingPrayer}</p>
            </div>
        </div>
    );
}