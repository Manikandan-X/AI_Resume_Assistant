import { useState, useRef, useEffect } from "react";

const SelectSearch = ({ label, options, value, onChange, getLabel, placeholder }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = options.filter((opt) =>
    getLabel(opt).toLowerCase().includes(query.toLowerCase())
  );

  const selected = options.find((opt) => opt.id === value);

  return (
    <div ref={ref} className="relative">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full border rounded-lg px-3 py-2 text-left text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {selected ? getLabel(selected) : placeholder || "Select..."}
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search..."
            className="w-full px-3 py-2 border-b text-sm focus:outline-none"
          />
          {filtered.length === 0 ? (
            <p className="px-3 py-2 text-sm text-gray-400">No results</p>
          ) : (
            filtered.map((opt) => (
              <button
                type="button"
                key={opt.id}
                onClick={() => {
                  onChange(opt.id);
                  setOpen(false);
                  setQuery("");
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                  opt.id === value ? "bg-blue-50 text-blue-600" : ""
                }`}
              >
                {getLabel(opt)}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SelectSearch;