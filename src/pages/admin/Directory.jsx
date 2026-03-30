import { useEffect, useState } from "react";
import axios from "axios";

function Directory() {
  const [lawyers, setLawyers] = useState([]);

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/directory/lawyers");
        setLawyers(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLawyers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lawyer Directory</h1>

      {lawyers.length === 0 ? (
        <p>No lawyers found</p>
      ) : (
        lawyers.map((l) => (
          <div key={l.id} className="border p-4 mb-2 rounded">
            <h3 className="font-bold">{l.name}</h3>
            <p>{l.specialization}</p>
            <p>{l.location}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Directory;