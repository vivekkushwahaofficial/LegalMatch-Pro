const specializationOptions = [
  "Family Law",
  "Human Rights",
  "Criminal",
  "Property",
];

export default function Filters({
  role,
  setRole,
  specializations,
  onToggleSpecialization,
  search,
  setSearch,
  onClearFilters,
  loading = false,
}) {
  return (
    <section
      className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm"
      aria-label="Match filters"
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-gray-900">Filters</h2>
        <button
          type="button"
          onClick={onClearFilters}
          disabled={loading}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
          aria-label="Clear all filters"
        >
          Clear All Filters
        </button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="match-role-filter" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            id="match-role-filter"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            aria-label="Filter by role"
          >
            <option value="ALL">ALL</option>
            <option value="LAWYER">Lawyer</option>
            <option value="NGO">NGO</option>
          </select>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700" id="specialization-filter-label">
            Specialization
          </p>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-labelledby="specialization-filter-label"
          >
            {specializationOptions.map((option) => {
              const active = specializations.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onToggleSpecialization(option)}
                  disabled={loading}
                  aria-pressed={active}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${active
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:text-blue-600"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="match-search-filter" className="block text-sm font-medium text-gray-700">
            Search
          </label>
          <input
            id="match-search-filter"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={loading}
            placeholder="Search by name, expertise, or mission..."
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            aria-label="Search matches"
          />
        </div>
      </div>
    </section>
  );
}