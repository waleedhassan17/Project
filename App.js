import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen/homeScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Home' }}
          />
         
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
