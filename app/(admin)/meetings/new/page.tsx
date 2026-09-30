import CreateMeetingForm from './create-meeting-form';

export default function NewMeetingPage() {
  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto mb-7 max-w-4xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-950">Meeting administration</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Create a meeting</h1>
        <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
          Add the meeting details and program. You can update these details later.
        </p>
      </div>
      <CreateMeetingForm />
    </main>
  );
}