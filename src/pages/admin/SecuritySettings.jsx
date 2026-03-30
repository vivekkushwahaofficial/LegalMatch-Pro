export default function SecuritySettings() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Security</h2>
      <input type="password" className="border p-2 w-full" placeholder="Change Password" />
      <div>
      <label><input type="checkbox" /> Enable 2FA
      </label>
      </div>
      <div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
      </div>
    </div>
    
  );
}
