export default function CaseSettings() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Case Settings</h2>
      <select className="border p-2 w-full" placeholder="Case Categories">
        <option>Family Law</option>
        <option>Criminal Law</option>
        <option>Civil Rights</option>
        <option>Property Dispute</option>
        <option>Consumer Complaint</option>
        <option>Labor/Employement</option>
      </select>

      <select className="border p-2 w-full">
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
    </div>
  );
}