// essa é a tela de Perfil. aqui o usuário vê seus dados (nome, email, foto)
// e pode acessar as configurações: editar conta, privacidade, ajuda e sair.

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { AnimatedButton } from "../components/animated-button";
import { AnimatedScreen } from "../components/animated-screen";
import { InfoBox } from "../components/info-box";
import { ScreenHeader } from "../components/screen-header";
import { COLORS, FONT_SIZES, SPACING } from "../constants/styles";
import {
    getSetting,
    getUserById,
    initDatabase,
    removeSetting,
} from "../db";
import { useLanguage } from "../i18n";

export default function Profile() {
  const router = useRouter();
  const { t } = useLanguage();
  const [name, setName] = useState("Sophia Darini");
  const [email, setEmail] = useState("sophia.darini@email.com");
  const [photo, setPhoto] = useState(null);

  // carrega os dados do usuário logado do banco
  useEffect(() => {
    const loadUser = async () => {
      try {
        await initDatabase();
        const sessionUserId = await getSetting("currentUserId");
        if (sessionUserId) {
          const user = await getUserById(Number(sessionUserId));
          if (user) {
            setName(user.name);
            setEmail(user.email);
            setPhoto(user.photo ?? null);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      }
    };
    loadUser();
  }, []);

  // função de logout: limpa a sessão e manda pra tela de login
  const handleLogout = async () => {
    try {
      await initDatabase();
      await removeSetting("currentUserId");
      await removeSetting("currentUserName");
      router.replace("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <AnimatedScreen>
      <SafeAreaView style={styles.container}>
        <ScreenHeader title={t("profileTitle")} onBackPress={() => router.back()} />

        <ScrollView contentContainerStyle={styles.content}>
          {/* Card com foto, nome e email */}
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              {photo ? (
                <Image source={{ uri: photo }} style={styles.avatarImage} />
              ) : (
                <MaterialCommunityIcons
                  name="account"
                  size={60}
                  color={COLORS.white}
                />
              )}
            </View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.email}>{email}</Text>
          </View>

          {/* Seção de informações básicas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("infoSection")}</Text>
            <InfoBox label={t("memberSinceLabel")} value={t("memberSinceValue")} />
            <InfoBox label={t("streakLabel")} value={t("streakValue")} />
          </View>

          {/* Seção de configurações (abre outras telas) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("settingsSection")}</Text>
            <MenuItemButton
              icon="settings"
              label={t("accountSettingsLabel")}
              onPress={() => router.push("/account")}
            />
            <MenuItemButton
              icon="lock"
              label={t("privacySettingsLabel")}
              onPress={() => router.push("/privacy")}
            />
            <MenuItemButton
              icon="help-circle"
              label={t("helpSupportLabel")}
              onPress={() => router.push("/help")}
            />
          </View>

          {/* Botão de logout */}
          <AnimatedButton
            title={t("logoutButton")}
            onPress={handleLogout}
            style={styles.logoutButton}
            textStyle={styles.logoutText}
          />
        </ScrollView>
      </SafeAreaView>
    </AnimatedScreen>
  );
}

// componente de menu: um botão com ícone, texto e setinha pra direita
function MenuItemButton({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={20} color={COLORS.primary} />
      <Text style={styles.menuText}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color="#DDD" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl + SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  profileCard: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: SPACING.xxxl,
    marginBottom: SPACING.xxl,
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.lg,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
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
  section: {
    marginBottom: SPACING.xxl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
    color: COLORS.primaryDark,
    marginBottom: SPACING.md,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  menuText: {
    flex: 1,
    marginLeft: SPACING.lg,
    fontSize: FONT_SIZES.normal,
    color: COLORS.primaryDark,
  },
  logoutButton: {
    backgroundColor: COLORS.danger,
    borderRadius: 16,
    paddingVertical: SPACING.lg,
    alignItems: "center",
    marginTop: SPACING.xl,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.medium,
    fontWeight: "bold",
  },
});
