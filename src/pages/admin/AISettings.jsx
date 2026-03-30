export default function AISettings() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">AI Matching</h2>
      <div>
      <label><input type="checkbox" /> Enable AI-based Lawyer Matching</label>
      </div>
      <div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
      </div>
    </div>
  );
}