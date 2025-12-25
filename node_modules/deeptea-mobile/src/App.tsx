import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ErrorBoundary } from './components/ErrorBoundary';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Nearby from './screens/Nearby';
import Send from './screens/Send';
import Waiting from './screens/Waiting';
import Result from './screens/Result';
import Settings from './screens/Settings';

const Tab = createBottomTabNavigator();

export default function App() {
return (
<ErrorBoundary>
<NavigationContainer>
<Tab.Navigator screenOptions={{ headerShown: false }}>
<Tab.Screen name="Nearby" component={Nearby} options={{ title: 'Рядом' }} />
<Tab.Screen name="Send" component={Send} options={{ title: 'Отправить' }} />
<Tab.Screen name="Waiting" component={Waiting} options={{ title: 'Ожидание' }} />
<Tab.Screen name="Result" component={Result} options={{ title: 'Результат' }} />
<Tab.Screen name="Settings" component={Settings} options={{ title: 'Настройки' }} />
</Tab.Navigator>
</NavigationContainer>
</ErrorBoundary>
);
}