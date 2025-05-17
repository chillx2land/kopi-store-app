import React from 'react';
import { View } from 'react-native';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { Sidebar } from './src/components/ui/Sidebar';
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
        {/* TODO: ここに各画面のコンテンツを表示 */}
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
