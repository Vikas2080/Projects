import TelescopeStatusCard from "./TelescopeStatusCard";
import InstrumentStatusCard from "./InstrumentStatusCard";
import EnvironmentCard from "./EnvironmentCard";
import LatestImageCard from "./LatestImageCard";
import ObservationInfoCard from "./ObservationInfoCard";
import TelemetryChart from "./TelemetryChart";
import LogsAndSummariesCard from "./LogsAndSummariesCard";
import SessionSummary from "./SessionSummary";

import useSessionTimeout from "../useSessionTimeout"; 

function Dashboard() {

  useSessionTimeout();

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Column 1 */}
      <div className="flex flex-col gap-6">
        <TelescopeStatusCard />
        <InstrumentStatusCard />
        <EnvironmentCard />
      </div>

      {/* Column 2 */}
      <div className="flex flex-col gap-6">
        <LatestImageCard />
        <TelemetryChart />
      </div>

      {/* Column 3 */}
      <div className="flex flex-col gap-6">
        <ObservationInfoCard />
        <LogsAndSummariesCard />
        <SessionSummary />
      </div>
    </div>
  );
}

export default Dashboard;
