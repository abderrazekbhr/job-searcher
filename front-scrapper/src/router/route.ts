import { JSX } from "react"
import Login from "../pages/login/index"
import RegisterPage from "../pages/register"
import { Main } from "../pages/main"
export const routersObject = {
  home: "/",
  login: "/login",
  register: "/register"
}
type RouteComposent = {
  component: () => JSX.Element,
  path: string,
  children: RouteComposent[]
}

export const appRoutes: RouteComposent[] = [
  {
    component: Main,
    path: "/",
    children:
      [{
        component: Login,
        path: routersObject.login,
        children: [],
      },
      {
        component: RegisterPage,
        path: routersObject.register,
        children: [],
      },]
  }


]
