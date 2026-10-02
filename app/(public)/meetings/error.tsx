'use client';

import Link from 'next/link';
import { useEffect } from 'react';

type MeetingErrorProps = {
  error: Error & { digest?: string };
  reset?: () => void;
  retry?: () => void;
};

export default function Error({ error, reset, retry }: MeetingErrorProps) {
  const tryAgain = reset ?? retry;

  useEffect(() => {
    console.error('An uncaught meeting error occurred:', error);
  }, [error]);

  return (
    <div className="mx-auto mt-16 max-w-xl rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
      <p className="mt-3 text-slate-600">
        We couldn’t load this meeting page. Please try again.
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => tryAgain?.()}
          disabled={!tryAgain}
          className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Try Again
        </button>
        <Link
          href="/meetings"
          className="rounded-md border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Back to Meetings
        </Link>
      </div>
    </div>
  );
}