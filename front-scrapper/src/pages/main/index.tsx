import Sidebar from "@/components/sidebar";
import { Outlet, useNavigate } from "react-router";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { useEffect } from "react";

export function Main() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/dashboard");
  });

  return (
    <ThemeProvider>
      <div className="h-screen flex w-screen relative bg-white dark:bg-gray-950 min-h-screen">
        <Sidebar></Sidebar>
        <div className="px-4 py-2 flex-1 flex flex-col">
          <Outlet></Outlet>
        </div>
      </div>
    </ThemeProvider>
  );
}
