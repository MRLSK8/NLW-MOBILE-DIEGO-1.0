import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import Home from './pages/Home';
import Detail from './pages/Detail';
import Points from './pages/Points';

const AppStack = createStackNavigator();

const routes = () => {
  return (
    <NavigationContainer>
      <AppStack.Navigator
        headerMode='none'
        screenOptions={{
          cardStyle: {
            backgroundColor: '#f0f0f5',
          },
        }}
      >
        <AppStack.Screen name='Home' component={Home} />
        <AppStack.Screen name='Detail' component={Detail} />
        <AppStack.Screen name='Points' component={Points} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default routes;
