import React from "react";
import { Outlet } from "react-router";
import { Sidebar } from "../../components/sidebar";
export function Main() {
  return (
    <div className="flex w-screen">
      <Sidebar></Sidebar>
      <Outlet></Outlet>
    </div>
  );
}
