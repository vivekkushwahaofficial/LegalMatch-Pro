export default function Filters() {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md w-64">

      <h2 className="font-semibold mb-4">Filters</h2>

      <div className="mb-4">
        <p className="text-sm font-medium">Role</p>

        <div className="flex gap-2 mt-2">
          <button className="px-3 py-1 bg-purple-600 text-white rounded">
            Lawyer
          </button>

          <button className="px-3 py-1 border rounded">
            NGO
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium">Practice Areas</p>

        <div className="flex flex-wrap gap-2 mt-2 text-sm">
          <span className="border px-2 py-1 rounded">Family Law</span>
          <span className="border px-2 py-1 rounded">Human Rights</span>
          <span className="border px-2 py-1 rounded">Criminal Defense</span>
          <span className="border px-2 py-1 rounded">Property</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium">Distance</p>
        <input type="range" className="w-full mt-2" />
      </div>

      <div>
        <p className="text-sm font-medium">Language</p>

        <div className="flex gap-2 mt-2 text-sm">
          <span className="border px-2 py-1 rounded">English</span>
          <span className="border px-2 py-1 rounded">Hindi</span>
          <span className="border px-2 py-1 rounded">Tamil</span>
        </div>
      </div>

    </div>
  );
}