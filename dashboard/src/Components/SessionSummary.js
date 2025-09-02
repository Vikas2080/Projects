import { useState, useEffect } from "react";

function SessionSummary() {
    const [summary, setSummary] = useState({
        exposures: 0,
        storageUsed: "0 GB",
        progress: "0%",
    });

    useEffect(() => {
        
        const dummySummary = {
            exposures: 6,
            storageUsed: "12 GB",
            progress: "60%",
        };

        setSummary(dummySummary);

        
        const interval = setInterval(() => {
            setSummary((prev) => {
                let newExposures = prev.exposures + 1;
                let newStorage = `${12 + newExposures * 0.5} GB`;
                let newProgress = `${Math.min(parseInt(prev.progress) + 10, 100)}%`;

                return {
                    exposures: newExposures,
                    storageUsed: newStorage,
                    progress: newProgress,
                };
            });
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-[calc(100vh/3)] p-4 rounded-3xl shadow-2xl bg-gradient-to-br from-[#0a1b2d]/90 to-[#1e3a56]/90 border border-[#2b4a78]/40 backdrop-blur-xl overflow-hidden flex flex-col">

            {/* Title */}
            <h2 className="text-xl font-extrabold text-white mb-2 border-b border-[#2b4a78]/50 pb-1 tracking-wide">
                Session Summary
            </h2>

            <div className="space-y-2 text-gray-300 text-sm">
                <div className="flex justify-between">
                    <span>Exposures</span>
                    <span>{summary.exposures}</span>
                </div>
                <div className="flex justify-between">
                    <span>Storage used</span>
                    <span>{summary.storageUsed}</span>
                </div>
                <div className="flex justify-between">
                    <span>Session progress</span>
                    <span>{summary.progress}</span>
                </div>
            </div>
        </div>

    );

}
export default SessionSummary;  