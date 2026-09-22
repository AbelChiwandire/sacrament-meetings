'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export function MeetingSearch() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <input
            type="search"
            placeholder="Search by speaker, leader, or meeting type..."
            defaultValue={searchParams.get('query')?.toString()}
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Search meetings"
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition-colors placeholder:text-gray-500 mb-4 hover:border-gray-400 focus:border-gray-600 focus:ring-2 focus:ring-gray-300"
        />
    )
}