import { JSX } from "react"
import Login from "../pages/login/index"
import RegisterPage from "../pages/register"
import { Main } from "../pages/main"
const routers = {
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
        path: routers.login,
        children: [],
      },
      {
        component: RegisterPage,
        path: routers.register,
        children: [],
      },]
  }


]
