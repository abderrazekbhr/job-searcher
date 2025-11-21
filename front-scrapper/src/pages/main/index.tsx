import { Navbar } from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import React from "react";
import { Outlet } from "react-router";
import { ThemeProvider } from "@/components/ui/theme-provider";

export function Main() {
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
