import { Tabs } from 'expo-router';

import { BottomNavBar, NAV_ITEMS } from '@/components/ui';

/**
 * The main tab shell: Home, Search, Map, Profile.
 *
 * The design draws a custom floating brown pill rather than a platform tab
 * bar, so `Tabs` handles routing and state while `BottomNavBar` renders it.
 */
export default function TabsLayout() {
  return (
    <Tabs
      // Mount every tab up front rather than on first visit — the app assumes
      // a user who opens it is about to check the Map (and the others), so
      // there's no spinner on first tap of any tab.
      screenOptions={{ headerShown: false, lazy: false }}
      tabBar={({ state, navigation }) => (
        <BottomNavBar
          activeKey={state.routes[state.index]?.name ?? 'index'}
          onSelect={(key) => navigation.navigate(key)}
        />
      )}
    >
      {NAV_ITEMS.map((item) => (
        <Tabs.Screen key={item.key} name={item.key} options={{ title: item.label }} />
      ))}
    </Tabs>
  );
}
