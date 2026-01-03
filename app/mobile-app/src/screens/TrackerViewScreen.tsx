import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TrackerChatTab from '../components/Tracker/TrackerChatTab';
import TrackerDashboardTab from '../components/Tracker/TrackerDashboardTab';
import TrackerTransactionsTab from '../components/Tracker/TrackerTransactionsTab';
import TrackerSettingsTab from '../components/Tracker/TrackerSettingsTab';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'TrackerView'>;

const Tab = createBottomTabNavigator();

export default function TrackerViewScreen({ route }: Props) {
  const { trackerId } = route.params;
  const theme = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Chat"
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Chat"
        children={() => <TrackerChatTab trackerId={trackerId} />}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color, size }) => <Icon name="chat" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Dashboard"
        children={() => <TrackerDashboardTab trackerId={trackerId} />}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Icon name="view-dashboard" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Transactions"
        children={() => <TrackerTransactionsTab trackerId={trackerId} />}
        options={{
          tabBarLabel: 'Transactions',
          tabBarIcon: ({ color, size }) => <Icon name="format-list-bulleted" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        children={() => <TrackerSettingsTab trackerId={trackerId} />}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => <Icon name="cog" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
