'use client'

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation'; 
import { validateInt } from '../lib/validation';

export function Pagination({ totalPages }: { totalPages: number }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = validateInt(searchParams.get('page') || '1') ?? 1;

    function createPageURL(page: number) {
        const params = new URLSearchParams(searchParams);
        params.set('page', String(page));
        return `${pathname}?${params.toString()}`;
    }

    return (
        <nav
            aria-label="Pagination"
            className="mt-6 flex items-center justify-center gap-4 text-sm"
        >
            {currentPage > 1 && (
                <Link
                    href={createPageURL(currentPage - 1)}
                    className="rounded-md border border-gray-300 px-3 py-2 font-medium text-gray-700 transition-colors hover:border-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                    Previous
                </Link>
            )}
            <span className="font-semibold text-gray-900" aria-current="page">
                Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages && (
                <Link
                    href={createPageURL(currentPage + 1)}
                    className="rounded-md border border-gray-300 px-3 py-2 font-medium text-gray-700 transition-colors hover:border-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                    Next
                </Link>
            )}
        </nav>
    );
}