import QuickNotifications from "./components/QuickNotifications";
import ResumeCards from "./components/ResumeCards";
import TodaySchedule from "./components/TodaySchedule";
import Welcome from "./components/Welcome";

export default function Dashboard() {
  return (
    <div>
      <Welcome />
      <ResumeCards />
      <TodaySchedule />
      <QuickNotifications />
    </div>
  );
}
