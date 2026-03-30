export default function UserSettings() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Users & Roles</h2>
      <input className="border p-2 w-full" placeholder="Add new user (email)" />
      <select className="border p-2 w-full">
        <option>Admin</option>
        <option>Lawyer</option>
        <option>Citizen</option>
        <option>Ngo</option>
      </select>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Add User</button>
    </div>
  );
}