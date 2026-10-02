'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({ 
  error,
  reset
}: { 
  error: Error & { digest: string };
  reset: () => void 
}) {
  useEffect(() => {
    // optionally log the error
    console.error('An uncaught error occurred:', error);
  }, [error]);

  return (
    <div className="mx-auto mt-16 max-w-xl rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Something went wrong!</h1>
      <p className="mt-3 text-slate-600">An unexpected error occurred. Please try again later.</p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-md border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Home
        </Link>
      </div>
    </div>
  );
}