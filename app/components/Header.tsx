import { WardName } from "../lib/types.js";
import AdminHeaderActions from "./AdminHeaderActions";
import { SignOutButton } from "./SignoutButton";

export default function Header({ wardName }: { wardName: WardName }) {
    return (
        <header className="bg-slate-800 text-white py-4 px-4">
            <div className="container mx-auto flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-2xl font-bold">{wardName}</h1>
                <div className="flex items-center gap-4">
                    <p>{new Date().toLocaleDateString()}</p>
                    <AdminHeaderActions>
                        <SignOutButton />
                    </AdminHeaderActions>
                </div>
            </div>
        </header>
    );
}