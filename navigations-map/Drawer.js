// navigations-map/Drawer.js
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen/SettingsScreen";

export const DrawerRouteNames = {
  Home: "Home",
  Profile: "Profile",
  Settings: "Settings",
};

/**
 * @type {import("../types/routes").IRoutes}
 */
export const DrawerRoutes = [
  {
    component: HomeScreen,
    title: DrawerRouteNames.Home,
    options: {
      headerShown: true,
      headerTitle: 'Home',
    },
  },
  {
    component: ProfileScreen,
    title: DrawerRouteNames.Profile,
    options: {
      headerShown: true,
      headerTitle: 'Profile',
    },
  },
  {
    component: SettingsScreen,
    title: DrawerRouteNames.Settings,
    options: {
      headerShown: true,
      headerTitle: 'Settings',
    },
  },
];