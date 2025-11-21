import { JSX } from "react"
import Login from "../pages/login/index"
import RegisterPage from "../pages/register"
import { Main } from "../pages/main"
import { Dashboard } from "../pages/dashbord/index"
import { CVAndCoverLetter } from "../pages/CvAndCoverLetter/index"
import { Settings } from "../pages/settings/index"
export const routersObject = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  cv: "/cv",
  settings: "/settings"
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
      },
      {
        component: Dashboard,
        path: routersObject.dashboard,
        children: []
      },
      {
        component: CVAndCoverLetter,
        path: routersObject.cv,
        children: []
      },
      {
        component: Settings,
        path: routersObject.settings,
        children: []
      }

      ]
  }


]
