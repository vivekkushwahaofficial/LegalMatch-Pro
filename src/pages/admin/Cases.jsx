import { useEffect, useState } from "react";
import axios from "axios";

function Cases() {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/cases")
      .then(res => setCases(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cases</h1>

      {cases.length === 0 ? (
        <p>No cases available</p>
      ) : (
        cases.map(c => (
          <div key={c.id} className="border p-4 mb-2 rounded">
            <h3>{c.title}</h3>
            <p>{c.description}</p>
            <p>Status: {c.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Cases;