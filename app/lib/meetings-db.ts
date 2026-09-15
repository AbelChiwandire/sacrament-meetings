import type { SacramentMeeting } from './types';

const meetings: SacramentMeeting[] = [
  {
    id: 1,
    date: '2026-09-13',
    meetingType: 'regular',
    presiding: 'Bishop Smith',
    conducting: 'Brother Jones',
    openingHymn: { number: 2, title: 'The Spirit of God' },
    openingPrayer: 'Sister Williams',
    wardBusiness: [
      { description: 'Sustaining of new Primary president' }
    ],
    stakeBusiness: false,
    sacramentHymn: {
      number: 183,
      title: 'In Remembrance of Thy Suffering'
    },
    speakers: [
      {
        name: 'Sister Brown',
        topic: 'Faith in Jesus Christ',
        type: 'speaker'
      },
      {
        name: 'Youth Choir',
        topic: '',
        type: 'musical-number'
      }
    ],
    closingHymn: {
      number: 31,
      title: 'O God, Our Help in Ages Past'
    },
    closingPrayer: 'Brother Davis',
    announcements: ['Ward temple night: September 10']
  },

  {
    id: 2,
    date: '2026-09-20',
    meetingType: 'testimony',
    presiding: 'Bishop Smith',
    conducting: 'Sister Taylor',
    openingHymn: {
      number: 85,
      title: 'How Firm a Foundation'
    },
    openingPrayer: 'Brother Wilson',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: {
      number: 172,
      title: 'In Humility, Our Savior'
    },
    speakers: [],
    closingHymn: {
      number: 97,
      title: 'Lead, Kindly Light'
    },
    closingPrayer: 'Sister Anderson'
  },

  {
    id: 3,
    date: '2026-09-27',
    meetingType: 'stake',
    presiding: 'Stake President Johnson',
    conducting: 'President Miller',
    openingHymn: {
      number: 99,
      title: 'Nearer, Dear Savior, to Thee'
    },
    openingPrayer: 'Brother Harris',
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: {
      number: 181,
      title: 'Jesus of Nazareth, Savior and King'
    },
    speakers: [
      {
        name: 'President Johnson',
        topic: 'Strengthening Families',
        type: 'speaker'
      },
      {
        name: 'Sister Clark',
        topic: 'Serving with Faith',
        type: 'speaker'
      }
    ],
    closingHymn: {
      number: 219,
      title: 'Because I Have Been Given Much'
    },
    closingPrayer: 'Sister Roberts'
  },

  {
    id: 4,
    date: '2026-10-04',
    meetingType: 'regular',
    presiding: 'Bishop Smith',
    conducting: 'Brother Jones',
    openingHymn: {
      number: 89,
      title: 'The Lord Is My Light'
    },
    openingPrayer: 'Sister Thompson',
    wardBusiness: [
      { description: 'Calling of a new Relief Society secretary' }
    ],
    stakeBusiness: false,
    sacramentHymn: {
      number: 185,
      title: 'Reverently and Meekly Now'
    },
    speakers: [
      {
        name: 'Brother Martin',
        topic: 'Following the Savior',
        type: 'speaker'
      },
      {
        name: 'Sister Lewis',
        topic: 'The Power of Prayer',
        type: 'speaker'
      }
    ],
    closingHymn: {
      number: 301,
      title: 'I Am a Child of God'
    },
    closingPrayer: 'Brother Davis',
    announcements: ['Youth activity: October 10']
  },

  {
    id: 5,
    date: '2026-10-11',
    meetingType: 'regular',
    presiding: 'Bishop Smith',
    conducting: 'Sister Taylor',
    openingHymn: {
      number: 66,
      title: 'Rejoice, the Lord Is King!'
    },
    openingPrayer: 'Sister Williams',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: {
      number: 193,
      title: 'I Stand All Amazed'
    },
    speakers: [
      {
        name: 'Brother Davis',
        topic: 'Remembering Jesus Christ',
        type: 'speaker'
      },
      {
        name: 'Sister Brown',
        topic: 'Living the Gospel',
        type: 'speaker'
      }
    ],
    closingHymn: {
      number: 227,
      title: 'There Is Sunshine in My Soul Today'
    },
    closingPrayer: 'Brother Wilson'
  }
];

export function getMeetings(date?: string | null): SacramentMeeting[] {
  if (date) return meetings.filter(m => m.date === date);
  return meetings;
}

export function getMeetingById(id: number): SacramentMeeting | null {
  return meetings.find(m => m.id === id) ?? null;
}

export function addMeeting(meeting: SacramentMeeting): void {
    meetings.push(meeting);
}

export function updateMeeting(meeting: SacramentMeeting): void {
    const index = meetings.findIndex(m => m.id === meeting.id);
    if (index !== -1) {
        meetings[index] = meeting;
    }
}

export function deleteMeeting(id: number): void {
    const index = meetings.findIndex(m => m.id === id);
    if (index !== -1) {
        meetings.splice(index, 1);
    }
}