import HomeScreen from "../screens/HomeScreen/homeScreen";
import ShezlongLogin from "../screens/AuthenticationScreens/SignIn";
import ShezlongSignUp from "../screens/AuthenticationScreens/SignUp";

export const BaseRouteNames = {
  Home: "Home",
  SignIn: "SignIn",
  SignUp: "SignUp",
};

/**
 * @type {import("../types/routes").IRoutes}
 */
export const BaseRoutes = [
  {
    component: HomeScreen,
    title: BaseRouteNames.Home,
    options: {
      headerShown: true,
    },
  },
  {
    component: ShezlongLogin,
    title: BaseRouteNames.SignIn,
  },
  {
    component: ShezlongSignUp,
    title: BaseRouteNames.SignUp,
  }
];