
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  ArrowLeft,
  Home,
  MessageSquare,
  Settings,
  Shield,
  CreditCard,
  Rss,
  List,
  Phone,
  HelpCircle,
  User,
  CheckCircle,
} from 'lucide-react-native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const menuItems = [
  { icon: Home, name: 'Home' },
  { icon: MessageSquare, name: 'Chat room' },
  { icon: Settings, name: 'Settings' },
  { icon: Shield, name: 'Privacy' },
  { icon: CreditCard, name: 'Payment Method' },
  { icon: Rss, name: 'Blog Post' },
  { icon: List, name: 'List & Manage Product' },
  { icon: Phone, name: 'Contact us' },
];

export function SideMenu() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      <View style={styles.profileSection}>
        <User size={24} color={colors.text} />
        <View style={styles.profileText}>
          <Text style={[styles.profileName, { color: colors.text }]}>
            Bisi Williams (Vendor)
          </Text>
          <View style={styles.verifiedBadge}>
            <CheckCircle size={16} color="green" />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        </View>
      </View>
      <View style={styles.menu}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            <item.icon size={24} color={colors.icon} />
            <Text style={[styles.menuItemText, { color: colors.text }]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.chatSupportButton}>
          <HelpCircle size={24} color={colors.text} />
          <Text style={[styles.chatSupportText, { color: colors.text }]}>
            Chat Support
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileText: {
    marginLeft: 10,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    marginLeft: 5,
    color: 'green',
    fontSize: 12,
  },
  menu: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 20,
  },
  chatSupportButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatSupportText: {
    marginLeft: 15,
    fontSize: 16,
  },
});
