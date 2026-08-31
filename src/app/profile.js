import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS, FONT_SIZES, SPACING } from "../constants/styles";

// Tela de Perfil - Informações do usuário e configurações
export default function Profile() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header com botão de voltar e título */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={COLORS.primaryDark}
            style={styles.backButton}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Cartão de perfil do usuário */}
        <View style={styles.profileCard}>
          {/* Avatar circular */}
          <View style={styles.avatar}>
            <MaterialCommunityIcons
              name="account"
              size={60}
              color={COLORS.white}
            />
          </View>
          <Text style={styles.name}>Ana Silva</Text>
          <Text style={styles.email}>ana.silva@email.com</Text>
        </View>

        {/* Seção de informações do usuário */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Membro desde:</Text>
            <Text style={styles.infoValue}>Janeiro 2024</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Sequência atual:</Text>
            <Text style={styles.infoValue}>7 dias</Text>
          </View>
        </View>

        {/* Seção de configurações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          {/* Menu Item: Configurações da Conta */}
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="settings" size={20} color={COLORS.primary} />
            <Text style={styles.menuText}>Configurações da Conta</Text>
            <Ionicons name="chevron-forward" size={20} color="#DDD" />
          </TouchableOpacity>
          {/* Menu Item: Privacidade e Segurança */}
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="lock" size={20} color={COLORS.primary} />
            <Text style={styles.menuText}>Privacidade e Segurança</Text>
            <Ionicons name="chevron-forward" size={20} color="#DDD" />
          </TouchableOpacity>
          {/* Menu Item: Ajuda e Suporte */}
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle" size={20} color={COLORS.primary} />
            <Text style={styles.menuText}>Ajuda e Suporte</Text>
            <Ionicons name="chevron-forward" size={20} color="#DDD" />
          </TouchableOpacity>
        </View>

        {/* Botão de logout */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Fundo e layout principal
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Header com título
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
  },
  backButton: {
    marginRight: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: "bold",
    color: COLORS.primaryDark,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  // Cartão de perfil do usuário
  profileCard: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: SPACING.xxl,
    marginBottom: SPACING.xxl,
  },
  // Avatar circular
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  name: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS.primaryDark,
  },
  email: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.textGray,
    marginTop: SPACING.md,
  },
  // Seção com título
  section: {
    marginBottom: SPACING.xxl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.primaryDark,
    marginBottom: SPACING.md,
  },
  // Item de informação
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  infoLabel: {
    fontSize: FONT_SIZES.normal,
    color: COLORS.textGray,
  },
  infoValue: {
    fontSize: FONT_SIZES.normal,
    fontWeight: "bold",
    color: COLORS.primaryDark,
  },
  // Item de menu com ícone
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.md,
  },
  menuText: {
    flex: 1,
    marginLeft: SPACING.lg,
    fontSize: FONT_SIZES.normal,
    color: COLORS.primaryDark,
  },
  // Botão de logout
  logoutButton: {
    backgroundColor: COLORS.danger,
    borderRadius: 8,
    paddingVertical: SPACING.lg,
    alignItems: "center",
    marginTop: SPACING.xxl,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
  },
});
