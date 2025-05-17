import React from 'react';
import { View } from 'react-native';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { Sidebar } from './src/components/ui/Sidebar';
import { DashboardScreen } from './src/screens/dashboard/DashboardScreen';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

const AppContent = () => {
  const { user } = useAuth();

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <Sidebar />
      <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
        <DashboardScreen />
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
