import React from 'react';
import { View } from 'react-native';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { DashboardScreen } from './src/screens/dashboard/DashboardScreen';
import { OrdersScreen } from './src/screens/orders/OrdersScreen';
import { MenuScreen } from './src/screens/menu/MenuScreen';
import { Sidebar } from './src/components/ui/Sidebar';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

type Route = 'dashboard' | 'orders' | 'menu' | 'settings';

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
        return <MenuScreen />;
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
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
