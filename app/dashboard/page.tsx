import { Main } from "@/components/main";
import { Sidebar } from "@/components/sidebar";

export default function Dashboard() {
  return (
    <div className="relative flex h-screen">
      <Sidebar />
      <Main />
    </div>
  );
}
