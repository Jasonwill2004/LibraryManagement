import React, { useState, useEffect } from "react";
import axios from "axios";

const PendingReturnsDashboard = () => {
  const [date, setDate] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to fetch pending members based on selected date
  const fetchPendingReturns = async () => {
    if (!date) {
      setError("Please select a date.");
      return;
    }
    setLoading(true);
    setError("");

    const API_KEY = import.meta.env.VITE_API_KEY;

    try {
        const response = await axios.get(`https://library-backend-zwc4.onrender.com/member/${date}`, {
          headers: {
            "x-api-key": API_KEY,
          },
        });
        setMembers(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="container">
      <h2>📚 Members with Pending Book Returns</h2>

      <div className="input-group">
        <input
          type="date"
          value={date || ""}
          onChange={(e) => {
            setDate(e.target.value); // The date is already in "YYYY-MM-DD" format
            // console.log("Selected Date:", e.target.value);
          }}
        />
        <button onClick={fetchPendingReturns}>Fetch Members</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {members.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Member ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.mem_id}>
                <td>{member.mem_id}</td>
                <td>{member.mem_name}</td>
                <td>{member.mem_email}</td>
                <td>{member.mem_phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No pending returns found.</p>
      )}
    </div>
  );
};

export default PendingReturnsDashboard;
