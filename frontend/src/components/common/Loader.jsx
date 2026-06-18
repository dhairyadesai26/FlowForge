import { useState, useEffect } from "react";

function Loader() {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 7500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="loader-wrap" data-testid="loader">
      <div className="loader-ring" />
      {timedOut ? (
        <p className="loader-label" style={{ color: "var(--danger)" }}>
          Cannot reach server — make sure the backend is running on port 5000.
        </p>
      ) : (
        <p className="loader-label">Syncing with server…</p>
      )}
    </div>
  );
}

export default Loader;
