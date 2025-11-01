import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../design-system';

import { HomeScreen } from '../screens/HomeScreen';
import { DesignSystemScreen } from '../screens/DesignSystemScreen';
import { BaseComponentsScreen } from '../screens/BaseComponentsScreen';
import { AIComponentsScreen } from '../screens/AIComponentsScreen';

import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const theme = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background.rgb,
          },
          headerTintColor: theme.colors.foreground.rgb,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: theme.colors.background.rgb,
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'AI SDK UI' }}
        />
        <Stack.Screen
          name="DesignSystem"
          component={DesignSystemScreen}
          options={{ title: 'Design System' }}
        />
        <Stack.Screen
          name="BaseComponents"
          component={BaseComponentsScreen}
          options={{ title: 'Base Components' }}
        />
        <Stack.Screen
          name="AIComponents"
          component={AIComponentsScreen}
          options={{ title: 'AI Components' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
