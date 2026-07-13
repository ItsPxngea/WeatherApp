import { useState } from "react";
import { Search, Plus } from "lucide-react";

export default function SearchBar({ onAddCity }) {
    const [query, setQuery] = useState("");

    const submit = () => {
        const trimmed = query.trim();
        if (!trimmed) return;

        onAddCity(trimmed);
        setQuery("");
    };

    return (
        <div className="w-full max-w-xl flex items-center gap-2 mb-6">
            <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl"
                style={{ background: "#1C222B", border: "1px solid #2A323D" }}>
                <Search size={15} style={{ color: "#6E7887" }} />
                <input value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                    placeholder="Search city or country"
                    className="f-mono flex-1 bg-transparent outline-none text-sm"
                    style={{ color: "#E7EAEE" }} />
            </div>
            <button onClick={submit}
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "#D9A059" }}>
                <Plus size={18} style={{ color: "#12161C" }} />
            </button>
        </div>
    );
}