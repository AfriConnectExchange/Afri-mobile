import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs, useRouter } from 'expo-router';
import { Heart, Home, Menu as MenuIcon, User, Bell } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, Modal, Text, StyleSheet } from 'react-native';
import { SideMenu } from '@/components/SideMenu';
import { useState } from 'react';
import AELogo from '@/components/AELogo';

function CustomHeader() {
  const router = useRouter();
  return (
    <View style={styles.headerContainer}>
      <View style={styles.brandRow}>
        <AELogo size={30} />
        <Text style={styles.headerText}>Africonnect Exchange</Text>
      </View>
      <TouchableOpacity onPress={() => router.push('/(app)/notifications')}>
        <Bell size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

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
            header: () => <CustomHeader />,
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
         <Tabs.Screen
          name="notifications"
          options={{ 
            headerShown: false,
            href: null,
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

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 60,
    paddingBottom: 10,
    backgroundColor: 'white',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
