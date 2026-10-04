import { signOut } from '@/auth';

export function SignOutButton() {
    return (
        <form 
            action={async () => {
                'use server'
                await signOut({ redirectTo: '/' });
            }}
        >
            <button
                type="submit"
                className="rounded border border-slate-500 px-3 py-1 text-sm text-slate-200 transition-colors hover:border-slate-300 hover:bg-slate-700 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
                Sign out
            </button>
        </form>
    )
}