import { useParams } from "react-router-dom";

export default function CaseDetail() {

  const { id } = useParams();

  const caseData = {
    title: "Child Custody Dispute",
    description:
      "A parent seeking legal assistance regarding child custody rights after divorce.",
    category: "Family Law",
    location: "Chennai",
    urgency: "High",
    submittedBy: "Citizen User"
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">

      <h1 className="text-2xl font-bold mb-4">
        Case Details
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6 space-y-3">

        <h2 className="text-xl font-semibold">
          {caseData.title}
        </h2>

        <p className="text-gray-600">
          {caseData.description}
        </p>

        <p>
          <span className="font-medium">Category:</span> {caseData.category}
        </p>

        <p>
          <span className="font-medium">Location:</span> {caseData.location}
        </p>

        <p>
          <span className="font-medium">Urgency:</span> {caseData.urgency}
        </p>

        <p>
          <span className="font-medium">Submitted By:</span> {caseData.submittedBy}
        </p>

        <div className="flex gap-3 pt-4">

          <button className="flex-1 bg-green-500 text-white py-2 rounded-lg">
            Accept Case
          </button>

          <button className="flex-1 bg-red-500 text-white py-2 rounded-lg">
            Decline Case
          </button>

        </div>

      </div>

    </div>
  );
}