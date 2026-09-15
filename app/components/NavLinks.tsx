'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/meetings', label: 'Meetings' },
  { href: '/meetings/current', label: 'Current Meeting' },
];

export default function NavLinks({
  currentMeetingId,
}: {
  currentMeetingId: number | null;
}) {
  const pathname = usePathname();
  const currentMeetingPath = currentMeetingId != null ? `/meetings/${currentMeetingId}` : null;
  const isViewingCurrentMeeting = currentMeetingPath !== null && pathname === currentMeetingPath;

  return (
    <nav aria-label="Primary" className="max-w-4xl mx-auto px-4 flex justify-between items-center">
      <ul className="flex gap-6">
        {NAV_ITEMS.map(({ href, label }) => {
          const isActive =
            href === '/meetings/current'
              ? pathname === href || isViewingCurrentMeeting
              : href === '/'
                ? pathname === '/'
                : href === '/meetings'
                  ? (pathname === '/meetings' ||
                     (pathname.startsWith('/meetings/') && pathname !== '/meetings/current')) &&
                    !isViewingCurrentMeeting
                  : pathname === href;

          return (
            <li key={href}>
              <Link href={href} className={isActive ? 'active' : ''} aria-current={isActive ? 'page' : undefined}>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}