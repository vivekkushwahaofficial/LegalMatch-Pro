import CaseCard from "../../components/cases/CaseCard";

export default function AssignedCases() {

  const cases = [
    {
      id: 1,
      title: "Child Custody Dispute",
      description: "Need legal help for child custody case.",
      category: "Family Law"
    },
    {
      id: 2,
      title: "Property Ownership Conflict",
      description: "Land ownership issue between siblings.",
      category: "Property Law"
    },
    {
      id: 3,
      title: "Unlawful Arrest Case",
      description: "Seeking legal assistance for wrongful arrest.",
      category: "Criminal Law"
    }
  ];

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Assigned Cases
      </h1>

      <div className="grid grid-cols-3 gap-6">

        {cases.map((caseItem) => (
          <CaseCard key={caseItem.id} caseItem={caseItem} />
        ))}

      </div>

    </div>
  );
}