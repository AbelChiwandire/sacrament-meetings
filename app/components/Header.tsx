import { WardName } from "../lib/types.js";

export default function Header({ wardName }: { wardName: WardName }) {
    return (
        <header className="bg-slate-800 text-white py-4 px-4">
            <div className="container mx-auto flex justify-between">
                <h1 className="text-2xl font-bold">{wardName}</h1>
                <p>{new Date().toLocaleDateString()}</p>
            </div>
        </header>
    );
}