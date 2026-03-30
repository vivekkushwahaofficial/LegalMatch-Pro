export default function NotificationSettings() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Notifications</h2>
      <div>
      <label>
        <input type="checkbox" /> New Case Submitted
      </label>
      </div>
      <div>

      <label>
        <input type="checkbox" /> Case Assigned
        </label>
        </div>
        <div>
      <label>
        <input type="checkbox" /> Case Status Updated
        </label>
        </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
    </div>
  );
}