import { useEffect, useState } from "react";

function LogsAndAlertsCard() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Dummy log data (simulating backend)
    const dummyLogs = [
      { id: 1, timestamp: new Date(), message: "Telescope initialized", level: "INFO" },
      { id: 2, timestamp: new Date(), message: "Tracking started", level: "INFO" },
      { id: 3, timestamp: new Date(), message: "Obseervation Started", level: "INFO" },
      { id: 4, timestamp: new Date(), message: "Dome Opened", level: "WARN" },
      { id: 5, timestamp: new Date(), message: "Observation Scheduled", level: "INFO" },
    ];

    setLogs(dummyLogs);

    // Optional auto-update simulation (new log every 5s)
    const interval = setInterval(() => {
      setLogs((prev) => [
        { id: Date.now(), timestamp: new Date(), message: "New telemetry event", level: "INFO" },
        ...prev,
      ]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
   <div className="relative w-full h-[calc(100vh/3)] p-4 rounded-3xl shadow-2xl bg-gradient-to-br from-[#0a1b2d]/90 to-[#1e3a56]/90 border border-[#2b4a78]/40 backdrop-blur-xl overflow-hidden flex flex-col">

      <h2 className="text-lg font-semibold text-white mb-3">Logs & Alerts</h2>

      <div className="h-48 overflow-y-auto space-y-2">
        {logs.length === 0 ? (
          <p className="text-gray-400 text-sm">No logs available</p>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={`text-sm ${
                log.level === "ERROR"
                  ? "text-red-400"
                  : log.level === "WARN"
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
            >
              [{new Date(log.timestamp).toLocaleTimeString()}] {log.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LogsAndAlertsCard;
