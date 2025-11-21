import "./App.css";
import { Navbar } from "./components/navbar";
import { MainRouter } from "./router";
import { Button } from "@/components/ui/button";
import { NavigationMenu } from "@/components/ui/navigation-menu";

function App() {
  return (
    <>
      <MainRouter></MainRouter>;
    </>
  );
}

export default App;
