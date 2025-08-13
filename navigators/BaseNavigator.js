import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BaseRoutes } from "../navigations-map/Base";

const Stack = createNativeStackNavigator();

/**
 * Base Navigator Component
 * @param {Object} props
 * @param {string} props.initialRouteName - The initial route name
 * @returns {React.ReactElement}
 */
const BaseNavigator = ({ initialRouteName }) => {
  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      {BaseRoutes.map((route) => (
        <Stack.Screen
          key={route.title}
          name={route.title}
          component={route.component}
          options={route.options || { title: route.title }}
        />
      ))}
    </Stack.Navigator>
  );
};

export default BaseNavigator;