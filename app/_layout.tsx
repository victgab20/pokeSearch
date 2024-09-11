import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs
    screenOptions={{
      headerShown: false,
    }}>
      <Tabs.Screen
        name="Search"
        options={{
          tabBarLabel: 'Buscar',  
          tabBarStyle: {
            backgroundColor: '#fff', 
            borderRadius: 20, 
            height: 60, 
            marginBottom: 10,
          },
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="search" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Favorites"
        options={{
          tabBarLabel: 'Favoritos',
          tabBarStyle: { 
            backgroundColor: '#fff', 
            borderRadius: 20, 
            height: 60, 
            marginBottom: 10,
          },
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name='star' color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
