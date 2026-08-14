import { MissionsList } from "../components/MissionsList";
import { Ranking } from "../components/Ranking";

export const Dashboard = () => {
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <h2 className="text-2xl font-bold">Missões Disponíveis</h2>
        <MissionsList />
      </div>

      <div className="lg:col-span-1 h-[600px] lg:h-auto">
        <Ranking />
      </div>
    </div>
  );
};
