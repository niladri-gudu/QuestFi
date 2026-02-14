import ProfileHero from "../../components/dashboard/ProfileHero";
import QuestList from "../../components/dashboard/QuestList";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <ProfileHero />
      <QuestList />
    </div>
  );
}
