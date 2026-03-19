export default function Filters({ setRole, setSpecialization }) {

  return (
    <div className="bg-white p-5 rounded-xl shadow-md w-64">

      <h2 className="font-semibold mb-4">Filters</h2>

      {/* Role */}
      <div className="mb-4">
        <p className="text-sm font-medium">Role</p>

        <div className="flex gap-2 mt-2">
          <button onClick={() => setRole("Lawyer")} className="border px-2 py-1 rounded">
            Lawyer
          </button>

          <button onClick={() => setRole("NGO")} className="border px-2 py-1 rounded">
            NGO
          </button>

          <button onClick={() => setRole("All")} className="border px-2 py-1 rounded">
            All
          </button>
        </div>
      </div>

      {/* Specialization */}
      <div>
        <p className="text-sm font-medium">Specialization</p>

        <div className="flex flex-wrap gap-2 mt-2 text-sm">
          <button onClick={() => setSpecialization("Family Law")} className="border px-2 py-1 rounded">
            Family Law
          </button>

          <button onClick={() => setSpecialization("Human Rights")} className="border px-2 py-1 rounded">
            Human Rights
          </button>

          <button onClick={() => setSpecialization("Criminal")} className="border px-2 py-1 rounded">
            Criminal
          </button>

          <button onClick={() => setSpecialization("Property")} className="border px-2 py-1 rounded">
            Property
          </button>

          <button onClick={() => setSpecialization("All")} className="border px-2 py-1 rounded">
            All
          </button>
        </div>
      </div>

    </div>
  );
}