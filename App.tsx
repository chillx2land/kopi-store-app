import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { DashboardScreen } from './src/screens/dashboard/DashboardScreen';
import { OrdersScreen } from './src/screens/orders/OrdersScreen';
import { MenuScreen } from './src/screens/menu/MenuScreen';
import { CreateMenuScreen } from './src/screens/menu/CreateMenuScreen';
import { Sidebar } from './src/components/ui/Sidebar';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

type Route = 'dashboard' | 'orders' | 'menu' | 'settings';
type RootStackParamList = {
  Dashboard: undefined;
  Orders: undefined;
  Menu: undefined;
  CreateMenu: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppContent = () => {
  const { user } = useAuth();
  const [activeRoute, setActiveRoute] = React.useState<Route>('dashboard');

  if (!user) {
    return <LoginScreen />;
  }

  const renderContent = () => {
    switch (activeRoute) {
      case 'orders':
        return <OrdersScreen />;
      case 'menu':
        return (
          <Stack.Navigator>
            <Stack.Screen
              name="Menu"
              component={MenuScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CreateMenu"
              component={CreateMenuScreen}
              options={{
                headerShown: false,
                presentation: 'modal',
              }}
            />
          </Stack.Navigator>
        );
      case 'settings':
        return <View style={{ flex: 1, backgroundColor: '#FAFAFA' }} />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <Sidebar activeRoute={activeRoute} onChangeRoute={setActiveRoute} />
      <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
        {renderContent()}
      </View>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </NavigationContainer>
  );
}
