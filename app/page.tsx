import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-zinc-50 font-sans dark:bg-black">
      <main className="bg-white dark:bg-black">
        <nav className="p-4 text-center">
          <Link className="text-white hover:underline" href="/meetings">View All Meetings</Link>
        </nav>
        <div className="flex flex-col items-center gap-4 text-center">
          <Image className="max-w-lg w-full" src="/chapel.jpg" alt="Inside the chapel" width={1920} height={1440} priority />
          <p className="text-center text-lg text-gray-700 dark:text-gray-300 mb-4">
            Welcome to our sacrament meetings page.
          </p>
        </div>
      </main>
    </div>
  );
}
