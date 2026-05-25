import { useEffect, useState } from "react";
import apiClient from "../apiClient";

function DailyDigests() {
  const [digests, setDigests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDigests = async () => {
      try {
        setLoading(true);

        const res = await apiClient.get("/system/daily-digests");

        setDigests(res.data);
      } catch (err) {
        console.error("Failed to load digests", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDigests();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        Loading daily digests...
      </div>
    );
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Daily Digests</h1>

      <div style={{ marginTop: "20px" }}>
        {digests.map((d) => (
          <div
            key={d.id}
            style={{
              background: "#fff",
              padding: "16px",
              marginBottom: "12px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
            }}
          >
            <h3>
              {new Date(d.generatedAt).toLocaleString()}
            </h3>

            <pre style={{ whiteSpace: "pre-wrap" }}>
              {d.content}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DailyDigests;
