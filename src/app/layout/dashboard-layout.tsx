import type { ReactNode } from "react";
import Header from "../../widgets/header/header";
import Sidebar from "../../widgets/sidebar/sidebar";
type DashboardLayoutProps = {
  children: ReactNode;
};
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#f5f6f8]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main
          className="
            flex-1
            p-4
            min-[1800px]:p-12
            min-[2200px]:p-14
          "
        >
          <div className="h-full w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}