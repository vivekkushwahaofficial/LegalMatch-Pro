export default function GeneralSettings() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">General Settings</h2>
      <input className="border p-2 w-full" placeholder="LegalMatch Pro" />
      <input className="border p-2 w-full" placeholder="TimeZone" />
      <select className="border p-2 w-full">
        <option>English</option>
        
      </select>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
    </div>
  );
}
