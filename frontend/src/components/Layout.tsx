import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-background text-white flex flex-col p-4 md:p-8">
      <div className="w-full max-w-7xl mx-auto flex flex-col flex-1">
        <Header />
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
