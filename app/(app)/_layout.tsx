import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import { Heart, Home, Menu as MenuIcon, User } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, Modal } from 'react-native';
import { SideMenu } from '@/components/SideMenu';
import { useState } from 'react';

export default function AppLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { t } = useTranslation();
  const [isMenuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.tint,
          headerShown: true,
          tabBarStyle: {
            backgroundColor: colors.background,
            height: 64,
            paddingBottom: 8,
          },
        }}>
        {/* Discover/Home */}
        <Tabs.Screen
          name="index"
          options={{
            title: t('app.home') || 'Discover',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />

        {/* Account (moved to be second) */}
        <Tabs.Screen
          name="settings"
          options={{
            title: t('app.settings') || 'Account',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />

        {/* Saved/Wishlist */}
        <Tabs.Screen
          name="storage"
          options={{
            title: t('app.storage') || 'Saved',
            tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
          }}
        />

        {/* Menu (formerly messaging) */}
        <Tabs.Screen
          name="messaging"
          options={{
            title: t('Menu') || 'Menu',
            tabBarIcon: ({ color, size }) => (
              <MenuIcon size={size} color={color} />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              toggleMenu();
            },
          }}
        />
      </Tabs>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isMenuVisible}
        onRequestClose={toggleMenu}
      >
        <TouchableOpacity
            style={{ flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.5)' }}
            activeOpacity={1}
            onPressOut={toggleMenu}
        >
            <TouchableOpacity style={{width: '80%'}} activeOpacity={1}>
              <SideMenu />
            </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
