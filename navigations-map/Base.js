import HomeScreen from "../screens/HomeScreen/homeScreen";

export const BaseRouteNames = {
  Home: "Home",
};

/**
 * @type {import("@/app/types/routes").IRoutes}
 */
export const BaseRoutes = [
  {
    component: HomeScreen,
    title: BaseRouteNames.Home,
    options: {
      headerShown: true,
    },
  },
];