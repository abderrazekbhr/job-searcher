import { Route, Routes } from "react-router";
import { appRoutes } from "./route";

export const MainRouter = () => {
  return (
    <Routes>
      {appRoutes.map((item, indexItem) => {
        return (
          <Route
            id={indexItem.toString()}
            children={item.children.map((subItem, indexSubItem) => {
              return (
                <Route
                  id={indexSubItem.toString()}
                  Component={subItem.component}
                  path={subItem.path}
                ></Route>
              );
            })}
            Component={item.component}
            path={item.path}
          ></Route>
        );
      })}
    </Routes>
  );
};
