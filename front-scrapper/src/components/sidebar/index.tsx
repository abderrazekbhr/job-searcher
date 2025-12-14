import React, { useContext, useState } from "react";
import { Home, Settings, FileText, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router";
import { ThemeProviderContext } from "../ui/theme-provider";

type NavKey = "dashboard" | "settings" | "cv";

interface SidebarProps {
  initial?: NavKey;
}

export default function Sidebar({ initial = "dashboard" }: SidebarProps) {
  const [active, setActive] = useState<NavKey>(initial);
  const { theme, setTheme } = useContext(ThemeProviderContext);

  const navItemBase =
    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";

  const navItemActive =
    "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 ring-1 ring-sky-100 dark:ring-sky-800";

  const navItemInactive =
    "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60";

  const logout = () => {
    localStorage.removeItem("authToken");
    // implement logout logic here
  };

  return (
    <aside
      className={`w-72 min-w-[18rem] h-screen flex flex-col justify-between bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 `}
      aria-label="Primary navigation"
    >
      <div>
        <div className="flex items-center gap-3 px-1 py-2">
          <Avatar className="h-10 w-10">
            <div className="flex items-center justify-center h-full w-full rounded-full bg-sky-600 text-white">
              JD
            </div>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              John Doe
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Product Designer
            </p>
          </div>
        </div>

        <Separator className="my-3" />

        <nav className="flex flex-col gap-2" role="navigation">
          <Link
            to="/dashboard"
            onClick={() => setActive("dashboard")}
            className={`${navItemBase} ${
              active === "dashboard" ? navItemActive : navItemInactive
            }`}
            aria-current={active === "dashboard" ? "page" : undefined}
          >
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/cv"
            onClick={() => setActive("cv")}
            className={`${navItemBase} ${
              active === "cv" ? navItemActive : navItemInactive
            }`}
            aria-current={active === "cv" ? "page" : undefined}
          >
            <FileText className="h-4 w-4" />
            <span>CV / Cover Letter</span>
          </Link>

          <Link
            to="/settings"
            className={`${navItemBase} ${
              active === "settings" ? navItemActive : navItemInactive
            }`}
            aria-current={active === "settings" ? "page" : undefined}
            onClick={() => setActive("settings")}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>

      <div className="mt-4">
        <Separator className="my-3" />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Appearance
              </p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Theme
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              aria-label="toggle theme"
              title={theme === "dark" ? "Switch to light" : "Switch to dark"}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-yellow-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700" />
              )}
            </Button>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 text-red-600 dark:text-red-400">
          <Link to="/login" className="w-full" onClick={logout}>
            Log out
          </Link>
        </div>

        <p className="mt-4 text-xs text-slate-400">Version 1.0.0</p>
      </div>
    </aside>
  );
}
