import { Link } from "react-router-dom";

export default function CaseCard({ caseItem }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-5 border">

      <Link to={`/case/${caseItem.id}`}>
        <h3 className="text-lg font-semibold mb-2 hover:text-purple-600">
          {caseItem.title}
        </h3>
      </Link>

      <p className="text-sm text-gray-600 mb-3">
        {caseItem.description}
      </p>

      <p className="text-sm text-gray-500 mb-4">
        Category: {caseItem.category}
      </p>

      <div className="flex gap-2">
        <button className="flex-1 bg-green-500 text-white py-2 rounded-lg">
          Accept Case
        </button>

        <button className="flex-1 bg-red-500 text-white py-2 rounded-lg">
          Decline
        </button>
      </div>

    </div>
  );
}