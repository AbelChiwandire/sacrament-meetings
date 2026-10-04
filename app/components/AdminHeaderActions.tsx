'use client';

import { usePathname } from 'next/navigation';

export default function AdminHeaderActions({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminPage = pathname === '/meetings/new' || /^\/meetings\/[^/]+\/edit\/?$/.test(pathname);

    return isAdminPage ? <>{children}</> : null;
}
