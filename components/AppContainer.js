import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { BaseRouteNames } from "../navigations-map/Base";
import BaseNavigator from "../navigators/BaseNavigator";

/**
 * Main App Container Component
 * @returns {React.ReactElement}
 */
const AppContainer = () => {
  return (
    <NavigationContainer>
      <BaseNavigator initialRouteName={BaseRouteNames.SignIn} />
    </NavigationContainer>
  );
};

export default AppContainer;